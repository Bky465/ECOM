var mongoose = require('mongoose');

const cartSchema=new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    product_id: [   {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Product'
    
    }]
    
},{ versionKey: false })
module.exports=mongoose.model('Cart',cartSchema);