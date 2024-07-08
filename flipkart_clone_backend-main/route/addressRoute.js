const express=require('express');
const addressRouter=express.Router();
const {addAddress,fetchAddress,deleteAddress}=require('../controllers/addressController')

addressRouter.post('/add',addAddress);
addressRouter.get('/get/:userid',fetchAddress);
addressRouter.delete('/delete/:addressid/:userid',deleteAddress);
module.exports=addressRouter;