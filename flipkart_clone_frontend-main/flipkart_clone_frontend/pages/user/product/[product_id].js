import axios from 'axios'
import React, {useState, useEffect } from 'react'
import {useRouter} from 'next/router'
import Navbar from '../../../components/Navbar';
import Link from 'next/link';

export default function productview() {
  const router=useRouter();
  const productid=router.query;
  // console.log(productid.product_id)
  const [myProduct,setMyProduct]=useState({});
  const [simillarProduct,setSimillarProduct]=useState([]);
  const getApiData=async()=>{
    const productdetails=await axios.get('http://localhost:5000/api/product/singleproduct/'+productid.product_id) 
    setMyProduct(productdetails.data.product)
    setSimillarProduct(productdetails.data.simillar_product)
    console.log(productdetails)
  }
  
  const addtocart=async()=>{
    const userdata=JSON.parse(localStorage.getItem('fcuserdata'));
    const data={
      "product_id":[productid.product_id],
      "user_id":userdata._id
    }
    await axios.post('http://localhost:5000/api/cart/add',data);
    router.push('/user/cart');
  }

  const buyNow=()=>{
    router.push({ pathname: '/user/checkoutpage/[checkout]', query: { checkout: productid.product_id }, })
  }

  const checklogin=()=>{
    const token=localStorage.getItem('token');
    if(!token){
      router.push('/')
    }
  }

  useEffect(()=>{
    checklogin();
  },[])
  useEffect(()=>{
    if(router.isReady){
    getApiData();
  }
  },[router])
  return (
    <>
    <Navbar/>
      <div className="antialiased mt-16">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4">
              <div x-data="{ image: 1 }">
                    <img src={myProduct.product_image}/>

                </div>
              </div>
              <div className="md:flex-1 px-4">
                <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">{myProduct.name}</h2>
                <p className="text-gray-500 text-sm">By <a href="#" className="text-indigo-600 hover:underline">{myProduct.brand}</a></p>

                <div className="flex items-center space-x-4 my-4">
                  <div>
                    <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                      <span className="text-indigo-400 mr-1 mt-1">₹</span>
                      <span className="font-bold text-indigo-600 text-3xl">{myProduct.product_price}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-green-500 text-xl font-semibold">Save 12%</p>
                    <p className="text-gray-400 text-sm">Inclusive of all Taxes.</p>
                  </div>
                </div>

                <p className="text-gray-500">{myProduct.desc}</p>

                <div className="flex py-4 space-x-4">
                  {/* <div className="relative">
                    <div className="text-center left-0 pt-2 right-0 absolute block text-xs uppercase text-gray-400 tracking-wide font-semibold">Qty</div>
                    <select className="cursor-pointer appearance-none rounded-xl border border-gray-200 pl-4 pr-8 h-14 flex items-end pb-1">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>

                    <svg className="w-5 h-5 text-gray-400 absolute right-0 bottom-0 mb-2 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div> */}

                  <button type="button" className="h-14 px-6 py-2 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white" onClick={addtocart}>
                    Add to Cart
                  </button>
                  <button type="button" className="h-14 px-6 py-2 font-semibold rounded-xl bg-green-600 hover:bg-indigo-500 text-white" onClick={buyNow}>
                   Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-16 mx-[20%] bg-orange-200 p-4 font-serif font-bold'><h1>SIMILLAR PRODUCTS</h1></div>
        <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-12 w-2/3 justify-evenly mt-4 mx-[20%] mb-16">
        {
          simillarProduct.map((element, index) => {
            if(index===3)return;
            return (<div key={index}>
              <Link href={{ pathname: "/user/product/[product_id]", query: { product_id: element._id }, }}>
                <a className="block h-32 rounded-lg shadow-lg bg-white object-cover overflow-hidden"><img src={element.product_image} alt="productImage " /></a>
              </Link>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <a href="#" className="font-medium">{element.name}</a>
                  <a className="flex items-center" href="#">
                    <span className="text-xs font-medium text-gray-600">by</span>
                    <span className="text-xs font-medium ml-1 text-indigo-500">{element.brand}</span>
                  </a>
                </div>
                <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">₹{element.product_price}</span>
              </div>
            </div>)
          })
        }
        </div>
      </div>
    </>
  )
}
