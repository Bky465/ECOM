import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';



export default function checkout() {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [productDatas, setProductDatas] = useState([]);
  const [itemsNo, setItemsNo] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressMsg, setAddressMsg] = useState();
  const [paymentType, setPaymentType] = useState('cash');
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState('');
  const parameter = router.query.checkout;
  const [orderType,setOrderType]=useState('cart');
  console.log(parameter)

  const getApiData = async () => {
    if (parameter === 'cartitem') {
      const userdata = JSON.parse(localStorage.getItem('fcuserdata'));
      const result = await axios.get("http://localhost:5000/api/cart/fetch/" + userdata._id)
      if (result.data.product[0]) {
        const product_arr = result.data.product[0].product_id;
        const temparr = [];
        product_arr.map((element) => {
          temparr.push(element._id);
        })
        const count = {};
        let subtotal = 0;
        temparr.forEach(element => {
          count[element] = (count[element] || 0) + 1;
        });
        // console.log(count)
        const finalarr = [];
        Object.keys(count).map(function (key, index) {
          let check = 0;
          product_arr.map((element) => {
            if (key === element._id && check === 0) {
              const obj = {
                product: element,
                quantity: count[key],
              }
              subtotal = subtotal + (element.product_price * count[key]);
              finalarr.push(obj);
              check++;
            }
          })
        });
        setTotal(subtotal);
        setItemsNo(product_arr.length);
        setProductDatas(finalarr);
      }

      else {
        router.push('/');
      }
    }
    else{
      const singleresult=await axios.get('http://localhost:5000/api/product/singleproduct/'+parameter)
      const singleproductdata= [{product:singleresult.data.product,quantity:1}];
      console.log(singleproductdata)
      setProductDatas(singleproductdata)
      setTotal(singleresult.data.product.product_price)
      setOrderType('direct')
    }
  }
  const getAddress = async () => {
    const userid = JSON.parse(localStorage.getItem('fcuserdata'))._id;
    const result = await axios.get('http://localhost:5000/api/address/get/' + userid);
    setUserAddress(result.data.address[0].address);
  }
  const deleteAddress = async (id) => {
    const userid = JSON.parse(localStorage.getItem('fcuserdata'))._id;
    console.log(userid)
    const result = await axios.delete('http://localhost:5000/api/address/delete/' + id + "/" + userid);
    getApiData();
    getAddress();
  }
  const submitCheckout = async () => {
    if (selectedAddress === "") {
      setAddressMsg("! please select address");
    }
    else {
      setAddressMsg("");
      const userdata = JSON.parse(localStorage.getItem('fcuserdata'));
      const address_arr = selectedAddress.split("\/");
      // console.log(productDatas);
      // console.log(total)
      // console.log(address_arr)
      const data = {
        user_id: userdata._id,
        user_email: userdata.email,
        address: address_arr,
        products_arr: productDatas,
        subtotal: total,
        shipping: 10,
        payment_mode: paymentType,
        order_type:orderType
      }
      if (paymentType === 'card') {
        if (!stripe || !elements) {
          // Stripe.js has not yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }

        const stripeFrontendData = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            // Include any additional collected billing details.
            name: userdata.name
          },
        });
        if (stripeFrontendData.error) {
          setPaymentError('! Please enter a valid card')
          return;
        }
        const paymentbody = {
          amount: total + 10,
          payment_method_id: stripeFrontendData.paymentMethod.id
        }
        console.log('stripedata  :', stripeFrontendData)
        const result2 = await axios.post('http://localhost:5000/api/payment/pay', paymentbody)

        console.log(result2.data.result.id)
        data.paymentid = result2.data.result.id;
        console.log(data)
      }


      const result = await axios.post('http://localhost:5000/api/order/add', data);
      // console.log('result',result.data.ordercode);
      router.push({ pathname: '/user/orderpage/[ordercode]', query: { ordercode: result.data.ordercode }, })

    }
  }
  const addressSelector = (e) => {
    setSelectedAddress(e.target.value)
  }
  const paymentMethod = (e) => {
    setPaymentType(e.target.value)
    console.log(paymentType)
  }

  const checklogin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/')
    }
  }
  useEffect(() => {
    checklogin();
    getApiData();
    getAddress();
  }, [])
  return (
    <>
      <Navbar />
      <div className=' grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16'>

        <div className='flex flex-col  w-[90%] ml-[5%]'>
          <div className='bg-blue-400  h-16 align-center text-center font-bold'><h1 className='mt-6 text-white'>SELECT DELIVERY ADDRESS</h1></div>
          {/* card to show all the address starts here */}
          <div className='border-2 border-lime-400 grid grid-cols-8' onChange={addressSelector}>
            {
              userAddress.map((element) => {
                return (
                  <>
                    <div className='bg-slate-50 flex flex-row h-auto  p-4  col-span-6' >
                      <input type="radio" name='address' defaultValue={element.location + "\/" + element.post + "\/" + element.pin} /><div className='mt-2 mx-2'>{element.location + "," + element.post + "," + element.pin}</div>
                    </div>
                    <div className='bg-slate-50 col-span-2'><button className='bg-red-400 border-2 border-red-600 mt-4 text-white w-16' onClick={() => { deleteAddress(element._id) }}>Delete</button></div>
                  </>
                )
              })
            }

          </div>
        </div>

        <div className=' grid grid-cols-1'>
          <div className='bg-slate-50 w-[70%] mx-[15%]'>
            <h1 className="font-semibold text-2xl border-b pb-8 text-center">Order Summary</h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase ml-5">Items {itemsNo}</span>
              <span className="font-semibold text-sm">₹{total}</span>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase ml-5">Shipping</label>
              <select className="block p-2 text-gray-600 w-full text-sm">
                <option>Standard shipping - ₹10.00</option>
              </select>
            </div>
            <div className="py-10">
              <label htmlFor="paymentmethod" className="font-semibold inline-block mb-3 text-sm uppercase ml-5">Payment method</label>
              <select id='paymentmethod' onChange={paymentMethod}>
                <option value='cash' selected>Cash on delivery</option>
                <option value='card'>Card</option>
              </select>
              {
                paymentType === 'card' ? <CardElement /> : null
              }
              <p className='text-red-400'>{paymentError}</p>
            </div>

            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>₹{total + 10}</span>
              </div>
              <p className='text-red-400'>{addressMsg}</p>
              <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full" onClick={submitCheckout}>Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
