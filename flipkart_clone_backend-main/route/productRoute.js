const express=require('express');
const {addProduct,getProduct,updateProduct,deleteProduct,getProductByCategory,getSingleProduct,getProductBySearch}=require("../controllers/productController")
const productRouter=express.Router();
const auth=require("../middlewares/auth");


productRouter.post("/add",auth,addProduct);
productRouter.get("/fetch/:page/:category?",getProduct);
productRouter.get("/categorywise/:category",getProductByCategory);
productRouter.put("/update/:id",auth,updateProduct);
productRouter.delete("/delete/:id",auth,deleteProduct);
productRouter.get("/singleproduct/:id",getSingleProduct)
productRouter.get("/search/:search_key",getProductBySearch)
module.exports=productRouter;