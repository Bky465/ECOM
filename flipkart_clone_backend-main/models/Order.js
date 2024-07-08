var mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    user_id:{
        type:String,
        require:true
    },
    delivery_adress:{
        location:{
            type:String,
        require:true
        },
        post:{
            type:String,
        require:true
        },
        pin:{
            type:Number,
            require:true
        }
    },
    subtotal:{
        type:Number,
        require:true
    },
    total:{
        type:Number,
        require:true
    },
    shipping:{
        type:Number,
        require:true
    },
    order_code:{
        type:String,
        require:true,
        unique:true
    },
    order_status:{
        type:String,
        enum:['success','pending','cancelled']
    },
    products:{
        type:Array,
        default:[]
    },
    payment_mode:{
        type:String,
        require:true
    },
    paymentid:String
})
module.exports=mongoose.model('Order',orderSchema)