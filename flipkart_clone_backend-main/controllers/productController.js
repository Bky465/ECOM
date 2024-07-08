const product = require("../models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const addProduct=async(req,res)=>{
    console.log("hello")
    try{
        
        if(req.role==="admin"){
            
            let { name, desc, category, brand, product_code,product_cost,product_price,product_status,product_image} = req.body;
            // console.log(req.body);
            // console.log(req.body)
            const existingProduct = await product.findOne({ product_code: product_code });
            if (existingProduct) {
                return res.status(400).json({ message: "product already exists" })
            }
            console.log("first")
            if(product_status==="")
            {
                product_status='instock';
            }

            const result = await product.create({
                name: name,
                desc: desc,
                category: category,
                brand: brand,
                product_code: product_code,
                product_cost:product_cost,
                product_price:product_price,
                product_status:product_status,
                product_image:product_image
            })
            return res.status(201).json({ product: result,message:"product created successfully"});
        }
        else{
            return res.status(404).json({message:"unauthorized user!"})
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
        
    }
}
const getSingleProduct=async(req,res)=>{
    try {
        console.log("single");
            const result=await product.findById({_id:req.params.id});
            const simillar_product=await product.find({category:result.category,_id:{$ne:req.params.id}})
            // console.log(simillar_product)
            res.status(201).json({product:result,simillar_product:simillar_product,message:"single product selected"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"single product fetch api failed"})
    }
}
const getProduct=async(req,res)=>{
    try{
        const limit_num=3;
        const skip_num=(req.params.page-1)*limit_num;
        if(!req.params.category || req.params.category==="Select"){
            const result=await product.find().distinct('category');
            const total_quantity=await product.find().count();
            const length=result.length;
            let temparr=[];
            for(let i=0;i<length;i++)
            {
                const tempres=await product.find({category:result[i]}).skip(skip_num).limit(limit_num);
                tempres.map((element)=>{
                    temparr.push(element)
                }) 
            }
            // console.log(result)
            return res.status(201).json({product:temparr,total_product_quantity:total_quantity,message:"multiple products selected"})
        }
        else{
            console.log("categorywise");
            const total_quantity=await product.find({category:req.params.category}).count();
            console.log(total_quantity)
            const result=await product.find({category:req.params.category}).skip(skip_num).limit(limit_num);
            return res.status(201).json({product:result,total_product_quantity:total_quantity,message:"categorywise product selected"})
        }
    }
    catch(error){
        console.log(error);
            return res.status(500).json({ message: "something went wrong" });
    }
}
const getProductBySearch=async(req,res)=>{
    try {
        const search_key=req.params.search_key;
        const total=await product.find().count();
        const result=await product.find({name:{$regex: search_key, $options:'i'}})
        return res.status(201).json({product:result,total:total,message:'successfully fetched search result'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'search product api error'})
    }
}
const getProductByCategory=async(req,res)=>{
    try{
            console.log("categorywise");
            const result=await product.find({category:req.params.category});
            res.status(201).json({product:result,message:"categorywise product selected"})
        
    }
    catch(error){
        console.log(error);
            res.status(500).json({ message: "something went wrong" });
    }
}
const updateProduct=async(req,res)=>{
    const id=req.params.id;
    try{

        if(req.role==="admin"){
            const { name, desc, category, brand, product_cost,product_price,product_status,product_image} = req.body;

            

            const newproduct={
                    name: name,
                    desc: desc,
                    category: category,
                    brand: brand,
                    product_cost:product_cost,
                    product_price:product_price,
                    product_status:product_status,
                    product_image:product_image
                }
                await product.findByIdAndUpdate(id,newproduct,{new:true});
                return res.status(201).json({newproduct:newproduct,message:"product updated successfully"})  
        }
        else{
            return res.status(404).json({message:"unauthorized user!"})
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "something went wrong" });

    }
}
const deleteProduct=async(req,res)=>{
    const id=req.params.id;
    try{

        if(req.role==="admin"){
           
                await product.deleteOne({_id:id})
                return res.status(201).json({message:"product deleted successfully"})
        }
        else{
            return res.status(404).json({message:"unauthorized user!"})
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "something went wrong" });

    }
}
module.exports={addProduct,getProduct,updateProduct,deleteProduct,getProductByCategory,getSingleProduct,getProductBySearch}