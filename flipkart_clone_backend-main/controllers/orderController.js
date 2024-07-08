const order = require('../models/Order')
const cart = require('../models/Cart')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const user = require('../models/User');
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

function makecode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
function sendmail(tomail, html_tmp, subject) {
    try {
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'debarchan.dash@nettantra.net',
                pass: 'Damodar@01'
            }
        });
        mailTransporter.use('compile', hbs({
            viewEngine: {
                partialsDir: path.resolve('../views/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./views/'),
        }))
        let mailDetails = {
            from: 'debarchan.dash10@nettantra.net',
            to: tomail,
            subject: subject,
            html: html_tmp
        };
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}

const addOrder = async (req, res) => {
    try {
        const { products_arr, user_id, address, subtotal, shipping, user_email, paymentid, payment_mode,order_type } = req.body;
        console.log(products_arr)
        // console.log(products_arr);
        const address_obj = {
            location: address[0],
            post: address[1],
            pin: address[2]
        }
        const order_code = makecode(10);
        let new_product_arr = [];
        products_arr.map((element, index) => {
            new_product_arr[index] = element;
        });
        const orderData = {
            user_id: user_id,
            delivery_adress: address_obj,
            subtotal: subtotal,
            total: subtotal + shipping,
            shipping: shipping,
            order_code: order_code,
            order_status: "pending",
            products: new_product_arr,
            payment_mode: payment_mode
        }
        if (payment_mode === 'card') {
            orderData.paymentid = paymentid;
            orderData.order_status = "success";
        }
        const result = await order.create(orderData);
        if(order_type==='cart')
        {
        await cart.deleteOne({ user_id: user_id })
        }
        const resultid = result._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        // console.log('mycurrent requirement',result.products)
        const result1 = await user.find({ role: "admin" });
        if (payment_mode === 'cash') {
            const subject = 'CHECK ORDER';
            const html_msg = `<p><a style="color:blue;" href="http://localhost:5000/api/order/updateByEmail/${resultid}">click here</a> to confirm the order</p>`;
            result1.map((element) => {
                sendmail(element.email.toString().replace(/ObjectId\("(.*)"\)/, "$1"), html_msg, subject);
            })
        }
        else if(payment_mode==='card'){
            const subject='order details';
            const html_msg_for_admin=`<p>Customer having userid: ${user_id} placed a order of ₹ ${subtotal+shipping} .Transaction id:${paymentid}</p>`
            result1.map((element) => {
                sendmail(element.email.toString().replace(/ObjectId\("(.*)"\)/, "$1"), html_msg_for_admin, subject);
            })
            let html_list= '';
        result.products.forEach((element) => {
            html_list = html_list + `<tr><td><img src="${element.product.product_image}" alt="Product Image" width="100" height="100"></td><td>${element.product.name}</td><td>${element.quantity}</td><td>${element.product.product_price*element.quantity}</td></tr>`
        })
        console.log('here',html_list)
        const final_html_list= `<div>
                                    <p>Your order is successfully placed</p><p>Transaction_id: ${paymentid}</p><p>See your list below</p>
                                    <table><tr><th>Product Image</th><th>Product name</th><th>Quantity</th><th>Amount</th></tr>
                                    ${html_list}</table>
                                </div>`
                                sendmail(user_email,final_html_list,subject);
        }
        return res.status(201).json({ ordercode: order_code, result: result });

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "something went wrong" })
    }
}

const updateOrderByEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const newOrder = {
            order_status: "success"
        };
        const updated = await order.findByIdAndUpdate(id, newOrder, { new: true });
        // console.log('updated',updated)
        let html_list= '';
        updated.products.forEach((element) => {
            // console.log(element)
            html_list = html_list + `<tr><td><img src="${element.product.product_image}" alt="Product Image" width="100" height="100"></td><td>${element.product.name}</td><td>${element.quantity}</td><td>${element.product.product_price*element.quantity}</td></tr>`
        })
        const final_html_list= `<div>
                                    <p>Your order is successfully placed</p><p>See your list below</p>
                                    <table><tr><th>Product Image</th><th>Product name</th><th>Quantity</th><th>Amount</th></tr>
                                    ${html_list}</table>
                                </div>`
        // console.log(final_html_list)
        const user_to_send = await user.findById(updated.user_id)
        const subject = 'order confirmation'
        // console.log(user_to_send)
        sendmail(user_to_send.email, final_html_list, subject)
        return res.status(201).json({ message: "Thank you the order is confirmed successfully" })

    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong" })
    }
}
const getStatus = async (req, res) => {
    try {
        console.log("called")
        const order_code = req.params.order_code;
        const result = await order.find({ order_code: order_code }, { order_status: 1, _id: 0 });
        return res.status(201).json({ result: result[0] });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "status check api error" })
    }
}
const getOrder=async(req,res)=>{
    try {
        console.log(req.params.page)
        const limit=10;
        const page=req.params.page;
        const skip_num=(page-1)*10;

       const result= await order.find().skip(skip_num).limit(limit);
       return res.status(201).json({orders:result})
    } catch (error) {
        console.log(error)
    }
}

module.exports = { addOrder, updateOrderByEmail, getStatus ,getOrder}
