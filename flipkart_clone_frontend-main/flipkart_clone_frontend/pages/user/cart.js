import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

export default function cart() {
  const router=useRouter();
  const [total,setTotal]=useState(0);
  const [productDatas,setProductDatas]=useState([]);
  const [itemsNo,setItemsNo]=useState([]);
  const [emptyCart,setEmptyCart]=useState(false);
  const [inputval,setInputval]=useState('');
  const [pid,setPid]=useState('');
  
  
  const checklogin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/')
    }
  }


  const getApiData = async () => {
    const userdata = JSON.parse(localStorage.getItem('fcuserdata'));
    const result = await axios.get("http://localhost:5000/api/cart/fetch/" + userdata._id)
    console.log('debarchan',result);
    if(result.data.product[0])
    {
      if(result.data.product[0].product_id.length===0){
        setItemsNo([])
      setEmptyCart(false)
  
    }
      else{setEmptyCart(true);
    const product_arr = result.data.product[0].product_id;
    const temparr = [];
    product_arr.map((element) => {
      temparr.push(element._id);
    })
    const count = {};
    let subtotal=0;
    temparr.forEach(element => {
      count[element] = (count[element] || 0) + 1;
    });
    // console.log(count)
    const finalarr=[];
    Object.keys(count).map(function (key, index) {
      let check=0;
      product_arr.map((element)=>{
        if(key===element._id && check===0){
          const obj={
            product:element,
            quantity:count[key],
          }
          subtotal=subtotal+(element.product_price*count[key]);
        finalarr.push(obj);
        check++;
      }
      })
    });
    console.log('this is final array-',finalarr)
    setTotal(subtotal);
    setItemsNo(product_arr.length);
    setProductDatas(finalarr);
  }
  }
   


  }
  const updateQuantity= async(e)=>{
    const inputvalue=e.target.value;
    if(inputvalue>0){
      
      const pr_id=e.target.id;
      const target_index=e.target.parentElement.id
      const productarray=productDatas;
      productarray[target_index].quantity=inputvalue;
      setProductDatas(productarray)
      setInputval(inputvalue);
      setPid(pr_id);
      // console.log('productDatas state',productarray)
      // console.log(pid)
      // return;
    }
    
  }
  const saveUpdate=async()=>{
    if(inputval!=="")
    {
      const uid=JSON.parse(localStorage.getItem('fcuserdata'))._id;
    const result=await axios.put("http://localhost:5000/api/cart/update/"+uid,{product_id:pid,quantity:inputval});
    getApiData();
    }
  }


  const removeProduct=async(e)=>{
    const pid=e.target.id.slice(1);
    const uid=JSON.parse(localStorage.getItem('fcuserdata'))._id;
    const result=await axios.put("http://localhost:5000/api/cart/update/"+uid,{product_id:pid,quantity:0});
    getApiData();
  }


  const doCheckOut=()=>{
    router.push("/user/checkoutpage/cartitem")
  }

  
  useEffect(() => {
    checklogin();
    getApiData();
  }, [])
  return (
    <>
      <Navbar total_no_item={itemsNo}/>
    
      <Head>

        <title>Document</title>

      </Head>
      {emptyCart?
      
      <main className="bg-gray-100">
      
        <div className="container mx-auto mt-10">
          <div className="flex flex-col sm:flex-row shadow-md my-10">
            <div className="w-3/4 bg-white px-10 py-10">
              <div className="flex justify-between border-b pb-8">
                <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                <h2 className="font-semibold text-2xl">{itemsNo} Items</h2>
              </div>
              <div className="flex mt-10 mb-5">
                <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Quantity</h3>
                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Price</h3>
                <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">Total</h3>
              </div>
              
              {
                productDatas.map((element,index)=>{
                  console.log(element);
                 return <div key={index}>
                  <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                <div className="flex w-2/5">
                  {/* <!-- product --> */}
                  <div className="w-20">
                    <img className="h-24" src={element.product.product_image} alt="" />
                  </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow">
                    <span className="font-bold text-sm">{element.product.name}</span>
                    <span className="text-red-500 text-xs">{element.product.brand}</span>
                    <a onClick={removeProduct} id={"p"+element.product._id}  className="font-semibold hover:text-red-500 text-gray-500 text-xs">Remove</a>
                  </div>
                </div>
                <div className="flex justify-center w-1/5" id={index}>
                  
                  <input className="mx-2 border text-center w-10" type="number" value={element.quantity} id={element.product._id} onChange={updateQuantity} />
                  
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full' onClick={saveUpdate}>save</button> 
                  
                </div>
                <span className="text-center w-1/5 font-semibold text-sm">₹{element.product.product_price}.00</span>
                <span className="text-center w-1/5 font-semibold text-sm">₹{element.product.product_price*element.quantity}.00</span>
              </div>
              </div>
                })
                
              }
              
              <Link href='/'>
              <a  className="flex font-semibold text-indigo-600 text-sm mt-10">

                <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                Continue Shopping
              </a>
              </Link>
            </div>

            <div id="summary" className="w-1/4 px-8 py-10">
              <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
              <div className="flex justify-between mt-10 mb-5">
                <span className="font-semibold text-sm uppercase">Items {itemsNo}</span>
                <span className="font-semibold text-sm">₹{total}</span>
              </div>
              <div>
                <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
                <select className="block p-2 text-gray-600 w-full text-sm">
                  <option>Standard shipping - ₹10.00</option>
                </select>
              </div>
              <div className="py-10">
                <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">Promo Code</label>
                <input type="text" id="promo" placeholder="Enter your code" className="p-2 text-sm w-full" />
              </div>
              <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">Apply</button>
              <div className="border-t mt-8">
                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                  <span>Total cost</span>
                  <span>₹{total+10}</span>
                </div>
                <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full" onClick={doCheckOut}>Checkout</button>
              </div>
            </div>

          </div>
        </div>
      </main>:<div className='mt-16'><h1 className='text-slate-500 mt-10 mx-[40%]'>Your cart is empty</h1>
            <Link href='/'>
              <a  className="flex font-semibold text-indigo-600 text-sm mt-10 mx-[40%]">

                <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                Continue Shopping
              </a>
              </Link>
              </div>
    }

    </>


  )
}
