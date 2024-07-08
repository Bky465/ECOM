
const express=require("express");
const app=express();
app.use(express.json());
const port=5000;
require('../database/database')();
const userRouter = require("../route/userRoute");
const productRouter=require("../route/productRoute");
const orderRouter=require("../route/orderRoute");
const cartRouter=require("../route/cartRoute");
const addressRouter=require("../route/addressRoute");
const paymentRouter=require("../route/paymentRoute")
require("dotenv").config()
var cors=require('cors');
var upload=require('multer');
const fileUpload=require('express-fileupload');



app.use(fileUpload({
    useTempFiles:true
}))
app.use(cors());
app.use((req,res,next)=>{
    console.log("HTTP METHOD-"+req.method+", URL-"+req.url);
    next();
})
app.use("/api/order",orderRouter);
app.use("/api",userRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/payment",paymentRouter)

app.get("/",(req,res)=>{
    res.send("hello");
})
    
app.listen(port,()=> {
    console.log(`Open Your Project at http://localhost:${port}`)
});
