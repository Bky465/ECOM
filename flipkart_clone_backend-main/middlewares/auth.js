const jwt=require("jsonwebtoken");
const secret_key = "type-user";

const auth=(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(token){
            let user=jwt.verify(token,secret_key);
            req.userId=user.id;
            req.role=user.role;
            console.log("authed")
            next();
        }
        else{
            res.status(401).json({message:"unauthorized user1"}); 
        }
    }catch(error){
        console.log(error);
        res.status(401).json({message:"unauthorized user"})
    }
}
module.exports=auth;