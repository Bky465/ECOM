var mongoose=require('mongoose');

const orderDetailSchema=new mongoose.Schema({
    order_id:{
        type:String,
        require:true
    },
    product_id:{
        type:String,
        require:true
    },
    quantity:Number,
    value:Number,

})
module.exports=mongoose.model('Order_details',orderDetailSchema)