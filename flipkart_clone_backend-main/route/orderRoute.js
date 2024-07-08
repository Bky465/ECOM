const express=require('express')
const {addOrder,updateOrderByEmail,getStatus,getOrder}=require('../controllers/orderController');
const orderRouter=express.Router();
const auth=require('../middlewares/auth');  


orderRouter.post('/add',addOrder);
orderRouter.get('/updateByEmail/:id',updateOrderByEmail)
orderRouter.get('/getstatus/:order_code',getStatus)
orderRouter.get('/getorders/:page',getOrder);

module.exports=orderRouter