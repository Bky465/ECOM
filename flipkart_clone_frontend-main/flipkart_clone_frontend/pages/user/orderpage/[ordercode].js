import React,{useState,useEffect} from 'react'
import Navbar from '../../../components/Navbar'
import { useRouter } from 'next/router'
import axios from 'axios';

export default function orderpage () {
  const router=useRouter();
  const {ordercode}=router.query;
  console.log(ordercode)
  const [orderStatus,setOrderStatus]=useState();
  const [status,setStatus]=useState();
  // console.log(orderStatus);
  const getStatus=async()=>{
    const result=await axios.get('http://localhost:5000/api/order/getstatus/'+ordercode);
    if(result.data.result){
      setStatus(result.data.result.order_status)
    }
    // console.log(result)
  }

  useEffect(()=>{
    getStatus()
  })
  return (
    <>
    <Navbar/>
    {
      status==="pending"? <div className='text-orange-400 font-extrabold ml-[30%] mt-32'>Thank you for ordering ,your order is reviewing by our officials.<h1 className='text-blue-400'>Your order id is:&emsp;{ordercode}</h1> </div>:<div className='text-green-600 font-extrabold ml-[30%] mt-32'>Thank you for ordering , your order is successfully placed.<h1 className='text-blue-400'>Your order id is:&emsp;{ordercode}</h1> </div>
    }
    </>
  )
}
