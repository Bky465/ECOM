var mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    product_code:{
        type:String,
        required:true
    },
    product_cost:{
        type:Number,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_status:{
        type:String,
        required:true,
        enum:['instock','outofstock']
    },
    product_image:{
        type:String
    },
    created_at: { type : Date, default: Date.now }
})
module.exports=mongoose.model("Product",productSchema);