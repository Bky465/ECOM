var address=require('../models/Address')

const addAddress=async(req,res)=>{
    try {
        const {userid,location,post,pin}=req.body;
        const checkuser=await address.find({user_id:userid});
        let result,message;
        if(location.trim()==="" || post.trim()==="" || pin.trim()===""){
            return res.status(200).json({message:"! all the fields are required"})
        }
        if(!checkuser[0]){
             result=await address.create({
                user_id:userid,
                address:[{
                location:location,
                post:post,
                pin:pin
            }]
            })
            message="new adress created";
        }
        else{
            result= await address.findByIdAndUpdate(checkuser[0],{$push:{address:[{
                location:location,
                post:post,
                pin:pin
            }]}})
            message="address updated";
            }
    
    return res.status(201).json({address:result,message:message})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"something went wrong"})
    }
}
const fetchAddress=async(req,res)=>{
    try {
        const userid=req.params.userid;
        const result=await address.find({user_id:userid});
        return res.status(201).json({address:result,message:"ready"});
        
    } catch (error) {
        console.log(error)
        return res.status(201).json({message:"fetchapi failure"})
    }
}
const deleteAddress=async(req,res)=>{
    try {
        const id=req.params.addressid;
        const userid=req.params.userid;
        const result=await address.find({user_id:userid});
        const addressarray=result[0].address;
         const objid=result[0]._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        const filtered_array=addressarray.filter((element)=>{
            return element._id.toString().replace(/ObjectId\("(.*)"\)/, "$1") !== id;
            
        })
        // console.log(result[0]._id);
        const deletedresult=await address.findByIdAndUpdate(objid,{$set:{address:filtered_array}},{new:true})
        return res.status(201).json({result:deletedresult});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"error in delete api"})
    }
}

module.exports={addAddress,fetchAddress,deleteAddress}