var mongoose=require('mongoose');



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    regno:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['user','admin']
    },
    image:{
        type:String
    }
})

module.exports=mongoose.model("User",userSchema);