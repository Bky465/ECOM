import axios from 'axios'
import React, {useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'

export default function orderhistory() {
    const [totalOrderInDatabase,setTotalOrderInDatabase]=useState();
  const [currentOrderCount,setCurrentOrderCount]=useState();
    const [pageNo,setPageNo]=useState(1);
    const [orderDatas,setOrderDatas]=useState([]);
    const getApiData=async()=>{
        const result=await axios.get('http://localhost:5000/api/order/getorders/'+pageNo)
        setOrderDatas(result.data.orders)
        console.log(result.data.orders)
    }
    const confirmOrder=async(id)=>{
        const result=await axios.get('http://localhost:5000/api/order/updateByEmail/'+id)
        getApiData()
    }
    const paging=async(page)=>{
        alert(page);
    setPageNo(page)
    const result = await axios.get('http://localhost:5000/api/order/getorders/'+page);
    setOrderDatas(result.data.orders);
    // setTotalProductInDatabase(result.data.total_product_quantity);
    // setCurrentProductCount(result.data.product.length)
    }
    useEffect(()=>{
        getApiData()
    },[])
  return (
    <>
    <Navbar/>
    <div className='mt-16'>
        <div className='flex justify-center mt-10'>
        <table className='bg-neutral-50'>
            <caption className='md:text-2xl md:font-bold text-blue-500'>ORDER HISTORY</caption>
            <thead>
            <tr>
                <th className='border border-slate-300 p-3 text-green-600'>SL NO</th>
                <th className='border border-slate-300 p-3 text-green-600'>USERID</th>
                <th className='border border-slate-300 p-3 text-green-600'>DELIVERY ADDRESS</th>
                <th className='border border-slate-300 p-3 text-green-600'>PAYMENT MODE</th>
                <th className='border border-slate-300 p-3 text-green-600'>PAYMENT ID</th>
                <th className='border border-slate-300 p-3 text-green-600'>ORDER STATUS</th>
            </tr>
            </thead>
            <tbody>
            {
                orderDatas.map((element,index)=>{
                    console.log('helo',element)
                    return(
                    <tr key={index}>
                        <td className='text-center border border-slate-300 p-3 text-blue-600'>{index+1}</td>
                        <td className='text-center border border-slate-300 p-3 text-blue-600'>{element.user_id}</td>
                        <td className='text-center border border-slate-300 p-3 text-blue-600'>{element.delivery_adress.location+','+element.delivery_adress.pin+','+element.delivery_adress.post}</td>
                        <td className='text-center border border-slate-300 p-3 text-blue-600'>{element.payment_mode}</td>
                        <td className='text-center border border-slate-300 p-3 text-blue-600'>{element.paymentid}</td>
                        <td className='text-center border border-slate-300 p-3 text-blue-600'>{element.order_status==="pending"?<button className='border-collapse bg-orange-400 p-1 rounded-lg text-white' onClick={()=>{confirmOrder(element._id)}}>pending</button>:element.order_status}</td>
                    </tr>
                    )
                })
                
            }
            </tbody>
        </table>
        </div>
        <div className="flex justify-center mt-10 space-x-1">
            
             {/* first pagination button start */}
             {pageNo===1?
            <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 bg-indigo-200 text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo)}}>
            {pageNo}
          </button>:<button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo-1)}}>
              {pageNo-1}
            </button>  
          }

          {/* second pagination button start */}
           {pageNo===1?
            <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200  text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo+1)}}>
            {pageNo+1}
          </button>:<button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 bg-indigo-200 text-sm font-medium text-indigo-600" onClick={()=>{paging(pageNo)}}>
              {pageNo}
            </button>  
          }
          {/* second pagination button end */}
            <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={()=>{paging(pageNo===1?pageNo+2:pageNo+1)}}>
            {pageNo===1?pageNo+2:pageNo+1}
            </button>
            
          </div>

    </div>
    </>
  )
}
