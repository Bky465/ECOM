import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { Component, useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import { FiEdit } from 'react-icons/fi';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  const [totalProductInDatabase,setTotalProductInDatabase]=useState();
  const [currentProductCount,setCurrentProductCount]=useState();
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [adminLogged, setAdminLogged] = useState(false);
  const [currentCategory,setCurrentCategory]=useState('Select');
  const [pageNo,setPageNo]=useState(1);
  const [productDetails, setProductDetails] = useState({ name: "", desc: "", category: "", brand: "", product_code: "", product_cost: "", product_price: "", product_status: "", product_image: "" })
  const [searchInput,setSearchInput]=useState("");
  const [searchMessage,setSearchMessage]=useState("");
  const getApiData = async () => {
    const productobj = await axios.get('http://localhost:5000/api/product/fetch/'+pageNo);
    console.log(productobj)
    setTotalProductInDatabase(productobj.data.total_product_quantity)
    setProducts(productobj.data.product)
    setCurrentProductCount(productobj.data.product.length)
    const token = localStorage.getItem('token')
    // console.log(token)
    if (token) {
      const user_type = JSON.parse(localStorage.getItem('fcuserdata')).role;
      if (user_type === 'admin') {
        setAdminLogged(true)
      }
    }

  }
  let id;
  const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    const header = { authorization: token };
    const result = await axios.delete('http://localhost:5000/api/product/delete/' + id, { headers: header });
    // window.location.reload();
    getApiData();
  }
  const editProduct = async (id) => {
    // alert(id)
    const result = await axios.get('http://localhost:5000/api/product/singleproduct/' + id);
    const productval = result.data.product;
    console.log(productval);
    setProductDetails(productval)
    setShowModal(true);
  }
  const changedInput = (e) => {
    const inpfield = e.target.name;
    const value = e.target.value;
    setProductDetails({ ...productDetails, [inpfield]: value })
  }
  const imageUpload = async (e) => {
    var ifile = e.target.files[0];
    const data = new FormData();
    data.append('file', ifile);
    data.append('upload_preset', 'debarchandash10')
    const result = await axios.post('https://api.cloudinary.com/v1_1/debarchandash/image/upload', data);
    setProductDetails({ ...productDetails, 'product_image': result.data.secure_url });
  }
  const submitHandler = async () => {
    const token = localStorage.getItem('token');
    const header = { authorization: token };
    const result = await axios.put('http://localhost:5000/api/product/update/' + productDetails._id, productDetails, { headers: header });
    console.log(result)
    if (result.status === 201) {
      setShowModal(false);
      getApiData();
    }
  }
  const selectChange = async (e) => {
    const val = e.target.value;
    alert(val);
    setCurrentCategory(val)
    const result = await axios.get("http://localhost:5000/api/product/fetch/1/" + val);
    setPageNo(1)
    setProducts(result.data.product);
    setTotalProductInDatabase(result.data.total_product_quantity);
    setCurrentProductCount(result.data.product.length)


  }
  const paging=async(page_num)=>{
    alert(page_num);
    setPageNo(page_num)
    const result = await axios.get("http://localhost:5000/api/product/fetch/"+page_num+"/" + currentCategory);
    setProducts(result.data.product);
    setTotalProductInDatabase(result.data.total_product_quantity);
    setCurrentProductCount(result.data.product.length)
  }

  const searchProduct= async(e)=>{
    const valInput= e.target.value;
    setSearchInput(valInput);
    if(valInput.length>2){
      // alert(valInput)
      const search_result=await axios.get('http://localhost:5000/api/product/search/'+valInput)
      if(search_result.data.product.length>=1){
        setSearchMessage("")
        setProducts(search_result.data.product)
        setTotalProductInDatabase(search_result.data.total);
        setCurrentProductCount(search_result.data.product.length)
      }
      else{
        setSearchMessage("No match found");
      }
    }
    else{
      setSearchMessage("")
      getApiData()
    }

  }


  useEffect(() => {
    const userdetails = JSON.parse(localStorage.getItem('fcuserdata'));
    getApiData();
  }, [])
  return (
    <>
      <Navbar />

      {/* modal start*/}

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Update Product
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form>
                  <div className='flex flex-row'>

                    <div className='grid-cols-6'>

                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Name</label><div className='mx-auto h-12 w-[75%] rounded-md   shadow-md shadow-blue-500/50 '><input type="text" name='name' id='pname' value={productDetails.name} onChange={changedInput} placeholder='product_name' className='border-none outline-none w-[70%] ml-4 pt-2 ' /></div></div>
                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Description</label><div className='mx-auto h-12 w-[75%] rounded-md   shadow-md shadow-blue-500/50 '><input type="text" name='desc' id='pdesc' value={productDetails.desc} onChange={changedInput} placeholder='product_desc' className='border-none outline-none w-[70%] ml-4 pt-2' /></div></div>
                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Category</label><div className='mx-auto h-12 w-[75%] rounded-md  shadow-md shadow-blue-500/50'><select name='category' id='pcategory' value={productDetails.category} onChange={changedInput} className='bg-white mt-2 border-collapse'>
                        <option value="mobile">Mobile</option>
                        <option value="fashion">Fashion</option>
                        <option value="electronics">Electronics</option>
                        <option value="beauty">Beauty</option>
                        <option value="homeappliences">Homeappliences</option>
                        <option value="furniture">Furniture</option>
                        <option value="grocery">Grocery</option>
                        <option value="sport">Sport</option>
                      </select></div></div>
                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Brand</label><div className='mx-auto h-12 w-[75%] rounded-md  shadow-md shadow-blue-500/50 '><input type="text" name='brand' id='pbrand' value={productDetails.brand} onChange={changedInput} placeholder='product_brand' className='border-none outline-none w-[65%] ml-4 pt-2' /><i className="fa-solid fa-eye text-blue-500 pt-4"></i></div></div>
                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Code</label><div className='mx-auto h-12 w-[75%] rounded-md  shadow-md shadow-blue-500/50 '><input type="text" name='product_code' id='pproduct_code' value={productDetails.product_code} placeholder='product_code' className='border-none outline-none w-[70%] ml-4 pt-2' disabled /></div></div>
                    </div>
                    <div className='grid-cols-6'>

                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Cost</label><div className='mx-auto h-12 w-[75%] rounded-md   shadow-md shadow-blue-500/50 '><input type="number" name='product_cost' id='pproduct_cost' value={productDetails.product_cost} onChange={changedInput} placeholder='product_cost' className='border-none outline-none w-[70%] ml-4 pt-2' /></div></div>
                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Price</label><div className='mx-auto h-12 w-[75%] rounded-md   shadow-md shadow-blue-500/50 '><input type="number" name='product_price' id='pproduct_price' value={productDetails.product_price} onChange={changedInput} placeholder='product_price' className='border-none outline-none w-[70%] ml-4 pt-2' /></div></div>
                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Status</label><div className='mx-auto h-12 w-[75%] rounded-md   shadow-md shadow-blue-500/50 '><select name='product_status' id='pproduct_status' value={productDetails.product_status} onChange={changedInput} className='bg-white mt-2 border-collapse'>
                        <option value="instock">Instock</option>
                        <option value="outofstock">OutOfStock</option>
                      </select></div></div>
                      <div className='flex flex-col mt-6'><label className='text-center  text-orange-500'>Product Image</label><div className='mx-auto h-12 w-[75%] rounded-md  shadow-md shadow-blue-500/50 object-center'><input type="file" name='product_image' id='pproduct_image' onChange={imageUpload} placeholder='ProfilePicture' className='file:bg-gradient-to-b file:bg-blue-500 file:border-none file:rounded-full file:text-white w-[70%] pt-3' /></div></div>
                    </div>
                  </div>

                </form>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => { submitHandler(id) }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {/* modal end */}
      <Head>
        <title>flipclone</title>
      </Head>
      <div>

        {/*carousel start */}
        <div className='mt-16'>
          <Carousel autoPlay infiniteLoop={true} interval={2000} stopOnHover={false}>
            <div>
              <img src="/banner1.jpeg" alt="image1" />
            </div>
            <div>
              <img src="/banner2.jpg" alt="image2" />
            </div>
            <div>
              <img src="/banner3.jpeg" alt="image3" />
            </div>
            <div>
              <img src="/banner12.jpg" alt="image4" />
            </div>
            <div>
              <img src="/banner15.jpg" alt="image5" />
            </div>
          </Carousel>
        </div>
        
        <main className="flex flex-col w-screen min-h-screen  p-10 bg-gray-100 text-gray-800">

          {/* <!-- Component Start --> */}
          <h1 className="text-3xl">Product Home Page </h1>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mt-6">
            <span className="text-sm font-semibold">{currentProductCount} of {totalProductInDatabase} Products</span>
            <input type="text" className='w-1/6 p-2 rounded-md border-2 border-yellow-50' placeholder='search' onChange={searchProduct} value={searchInput} />
            <p>{searchMessage}</p>
            <select className="relative text-sm focus:outline-none group mt-4 sm:mt-0" onChange={selectChange}>
              {/* <div className="flex items-center justify-between w-40 h-10 px-3 border-2 border-gray-300 rounded hover:bg-gray-300"> */}
              <option className="font-medium" defaultValue='selected'>Select</option>
              <option className="font-medium" value="mobile">Mobile</option>
              <option className="font-medium" value="fashion">Fashion</option>
              <option className="font-medium" value="electronics">Electronics</option>
              <option className="font-medium" value="beauty">Beauty</option>
              <option className="font-medium" value="homeappliences">Homeappliences</option>
              <option className='font-medium' value="furniture">furniture</option>
              <option className="font-medium" value="grocery">Grocery</option>
              <option className="font-medium" value="sport">Sport</option>
              {/* </div> */}

            </select>
          </div>
          <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-12 w-full mt-6">
            {/* <!-- Product Tile Start --> */}
            {
              products.map((element, index) => {
                return (<div key={index}>
                  <Link href={{ pathname: "user/product/[product_id]", query: { product_id: element._id }, }}>
                    <a className="block h-64 rounded-lg shadow-lg bg-white object-cover overflow-hidden"><img src={element.product_image} alt="productImage " /></a>
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <a href="#" className="font-medium">{element.name}</a>
                      <a className="flex items-center" href="#">
                        <span className="text-xs font-medium text-gray-600">by</span>
                        <span className="text-xs font-medium ml-1 text-indigo-500">{element.brand}</span>
                      </a>
                    </div>
                    {adminLogged ? <>
                      <span><button onClick={() => { deleteProduct(element._id) }} className='bg-red-600 p-1 rounded-md border-2 border-red-400 text-white'>Delete</button></span>
                      <span><button onClick={() => { editProduct(element._id) }} className='flex flex-row bg-yellow-600 p-1 rounded-md border-2 border-green-400 text-white'>Edit<FiEdit className='mt-1 ml-1' /></button></span>
                    </> : null
                    }
                    <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">₹{element.product_price}</span>
                  </div>
                </div>)
              })
              //jsx bracket below
            }
          

          </div>
          <div className="flex justify-center mt-10 space-x-1">
            {/* <button className="flex items-center justify-center h-8 w-8 rounded text-gray-600">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button> */}
            {/* <button className="flex items-center justify-center h-8 px-2 rounded text-sm font-medium text-gray-600" >
              Prev
            </button> */}
            {/* first pagination button start */}
            {pageNo===1?
            <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 bg-indigo-200 text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo)}}>
            {pageNo}
          </button>:<button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo-1)}}>
              {pageNo-1}
            </button>  
          }

          {/* second pagination button start */}
           {totalProductInDatabase<=3?null:pageNo===1?
            <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200  text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo+1)}}>
            {pageNo+1}
          </button>:<button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 bg-indigo-200 text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo)}}>
              {pageNo}
            </button>  
          }
          {/* second pagination button end */}
            {
              Math.ceil(totalProductInDatabase/3)=== pageNo || totalProductInDatabase<=6?null:<button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={()=>{paging(pageNo===1?pageNo+2:pageNo+1)}}>
            {pageNo===1?pageNo+2:pageNo+1}
            </button>
            }
            {/* <button className="flex items-center justify-center h-8 px-2 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600">
              Next
            </button> */}
            {/* <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-gray-600 hover:text-indigo-600">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button> */}
          </div>
          {/* <!-- Component End  --> */}

        </main>

      </div>
    </>
  )
}
