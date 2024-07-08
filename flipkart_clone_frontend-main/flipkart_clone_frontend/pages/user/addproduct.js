import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import Navbar from '../../components/Navbar'

export default function addproduct() {
    const [productDetails, setProductDetails] = useState({ name: "", desc: "", category: "", brand: "", product_code: "", product_cost: "", product_price: "", product_status: "", product_image: "" })
    const router=useRouter();
    const changedInput = (e) => {
        const inpfield = e.target.name;
        const value = e.target.value;
        setProductDetails({ ...productDetails, [inpfield]: value })
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const token=localStorage.getItem('token');
        const header={authorization:token};
        const result = await axios.post('http://localhost:5000/api/product/add', productDetails,{headers:header});
        console.log(result);
        if (result.status === 201) {
            router.push('/');
        }
    }
    const imageUpload = async (e) => {
        var ifile = e.target.files[0];
        const data = new FormData();
        data.append('file', ifile);
        data.append('upload_preset', 'debarchandash10')
        const result = await axios.post('https://api.cloudinary.com/v1_1/debarchandash/image/upload', data);
        console.log("uploadresult")
        console.log(result);
        setProductDetails({ ...productDetails, 'product_image': result.data.secure_url });
    }
    return (
        <>
            <Navbar/>
            <div className='mt-16'>
                <div className='container mx-auto mt-8 w-[90%] justify-center sm:w-[400px]  xl:w-1/3 bg-white
          rounded-[20px] drop-shadow-xl border-2 border-blue-300'>
                    <h1 className='font-bold text-2xl  ml-[35%] pb-2 font-sans'>AddProduct</h1>
                    <form onSubmit={submitHandler}>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><input type="text" name='name' onChange={changedInput} placeholder='product_name' className='border-none outline-none w-[70%] ml-4 pt-2 ' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><input type="text" name='desc' onChange={changedInput} placeholder='product_desc' className='border-none outline-none w-[70%] ml-4 pt-2' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50'><select name='category' onChange={changedInput} className='bg-white mt-2 border-collapse'>
                            <option defaultValue="selected">category</option>
                            <option value="mobile">Mobile</option>
                            <option value="fashion">Fashion</option>
                            <option value="electronics">Electronics</option>
                            <option value="beauty">Beauty</option>
                            <option value="homeappliences">Homeappliences</option>
                            <option value="furniture">Furniture</option>
                            <option value="grocery">Grocery</option>
                            <option value="sport">Sport</option>
                        </select></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50 '><input type="text" name='brand' onChange={changedInput} placeholder='product_brand' className='border-none outline-none w-[65%] ml-4 pt-2' /><i className="fa-solid fa-eye text-blue-500 pt-4"></i></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50 '><input type="text" name='product_code' onChange={changedInput} placeholder='product_code' className='border-none outline-none w-[70%] ml-4 pt-2' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><input type="number" name='product_cost' onChange={changedInput} placeholder='product_cost' className='border-none outline-none w-[70%] ml-4 pt-2' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><input type="number" name='product_price' onChange={changedInput} placeholder='product_price' className='border-none outline-none w-[70%] ml-4 pt-2' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><select name='product_status' onChange={changedInput} className='bg-white mt-2 border-collapse'>
                            <option value="instock">Instock</option>
                            <option value="outofstock">OutOfStock</option>
                        </select></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50 object-center'><input type="file" name='product_image' onChange={imageUpload} placeholder='ProfilePicture' className='file:bg-gradient-to-b file:bg-blue-500 file:border-none file:rounded-full file:text-white w-[70%] pt-3' /></div>

                        <div className='mx-[30%] w-[40%]'><button type='submit' className='mt-4 bg-blue-500 w-[100%] h-8 mb-8 rounded-full'>Add</button></div>
                    </form>
                </div>
            </div>
        </>
    )
}

