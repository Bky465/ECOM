const cart=require('../models/Cart');
const product=require('../models/Product');
const jwt=require('jsonwebtoken');
var mongoose=require('mongoose');

const addToCart=async(req,res)=>{
 try{
 const {user_id,product_id}=req.body;
const checkcart=await cart.find({user_id:user_id})
const c_length=checkcart.length;
if(c_length===0){
   const productdata=await product.findById({_id:product_id});
   
   const result=await cart.create({
      user_id:user_id,
      product_id:product_id
   })
   return res.status(201).json({product:result,message:"created"});
}
else{

   const result=await cart.findByIdAndUpdate(checkcart[0]._id,{$push:{product_id:{$each:product_id}}},{new:true});
   return res.status(201).json({cart:result,message:"updated"});
}
 }
 catch(error)
 {
   console.log(error);
   return res.status(500).json({message:"something went wrong"})
 }
}
const getProduct=async(req,res)=>{
   try{
      const userid=mongoose.Types.ObjectId(req.params.id);
      console.log(userid)
   const result=await cart.find({user_id:userid}).populate("product_id");
   // const tempresult=await cart.aggregate([{$match:{user_id:userid}}]);
   // const result=await product.populate(tempresult,{path:"product_id"})
   // console.log(result)
   return res.status(201).json({product:result});
   }
   catch(error){
      console.log(error);
        res.status(500).json({ message: "something went wrong" });
   }
}
const updateCart=async(req,res)=>{
   try {
      const userid=req.params.id;
      const {product_id,quantity}=req.body;
      const checkcart=await (await cart.find({user_id:userid}));
      let str_id_array=[];
      checkcart[0].product_id.forEach(element => {
         str_id_array.push(element.toString().replace(/ObjectId\("(.*)"\)/, "$1"))
      });
      const otherid=str_id_array.filter(element => element !== product_id);
         temparr=[];
         for(let i=0;i<quantity;i++)
         {
            temparr.push(product_id);
         }
         const finalarr=temparr.concat(otherid);
      // console.log(finalarr);
         const result=await cart.findByIdAndUpdate(checkcart[0]._id,{$set:{product_id:finalarr}},{new:true});

      
      return res.status(201).json({userid:str_id_array})
   } catch (error) {
      console.log(error)
      return res.status(500).json({message:"updatecart error"})
   }
}


module.exports={addToCart,getProduct,updateCart}