const express=require('express');
const {addToCart,getProduct,updateCart}=require('../controllers/cartController')
const cartRouter=express.Router();

cartRouter.post('/add',addToCart);
cartRouter.get('/fetch/:id',getProduct);
cartRouter.put('/update/:id',updateCart)

module.exports=cartRouter;