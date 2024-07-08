var mongoose=require('mongoose')

const addressSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    address:[{
        location:{
            type:String
        },
        post:{
            type:String
        },
        pin:{
            type:Number
        }
    }
    ]
})
module.exports=mongoose.model('Address',addressSchema)