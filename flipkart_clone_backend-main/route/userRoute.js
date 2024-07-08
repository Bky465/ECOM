const express = require("express");
const { signUp, signIn,deleteUser,updateUser,createUser } = require("../controllers/userController");
const userRouter=express.Router();
const auth=require("../middlewares/auth");


userRouter.post("/signup",signUp);
userRouter.post("/signin",signIn);
userRouter.post("/createuser",auth,createUser);
userRouter.put("/updateUser/:id",auth,updateUser);
userRouter.delete("/deleteuser/:id",auth,deleteUser);

module.exports=userRouter;
