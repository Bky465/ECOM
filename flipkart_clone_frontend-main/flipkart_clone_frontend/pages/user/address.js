import axios from 'axios';
import React,{useEffect,useState} from 'react'
import Navbar from '../../components/Navbar';
import {useRouter} from 'next/router';

export default function address() {
    const [addressDetails,setAddressDetails]=useState({location:"",post:"",pin:""})
    const router=useRouter();
    const [errMsg,setErrMsg]=useState("");

    const checklogin = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/')
        }
      }

    
    const submitHandler= async(e)=>{
        e.preventDefault();
        const userDetails=JSON.parse(localStorage.getItem("fcuserdata"));
        const result=await axios.post("http://localhost:5000/api/address/add",{userid:userDetails._id,location:addressDetails.location,post:addressDetails.post,pin:addressDetails.pin})
        console.log(result)
        if(result.status!==201)
        {
          setErrMsg(result.data.message);
        }
        else{
        router.push('/user/checkout');
        }
    }
    const cancelFunction=()=>{
      router.push('/user/checkout');
    }


    const changedInput = (e) => {
      const inpfield = e.target.name;
      const inpval = e.target.value;
      setAddressDetails({ ...addressDetails, [inpfield]: inpval })
    }


    useEffect(() => {
        checklogin();
      }, [])
  return (
        <div className=''>
        <Navbar/>
       <div className='container mx-auto mt-8 w-[90%] justify-center sm:w-[400px]  xl:w-1/3 bg-white
      drop-shadow-xl border-2 border-blue-300'>
        <h1 className='font-bold text-2xl  ml-[35%] pb-2 font-sans'>ADDRESS</h1>
        <form onSubmit={submitHandler}>
                        <div className='mx-auto h-12 w-[75%]  mt-8  shadow-md shadow-blue-500/50 '><i className="fa-solid fa-circle-user text-blue-500 pt-4 ml-3"></i><input type="text" name='location' onChange={changedInput}  placeholder='Enter Location here' className='border-none outline-none w-[70%]' /></div>
                        <div className='mx-auto h-12 w-[75%]  mt-8  shadow-md shadow-blue-500/50 '><i className="fab fa-adn text-blue-500 pt-4 ml-3"></i><input type="text" name='post' onChange={changedInput}  placeholder='Enter  post' className='border-none outline-none w-[70%]' /></div>
                        <div className='mx-auto h-12 w-[75%]  mt-8 shadow-md shadow-blue-500/50'><i className="fa-solid fa-envelope text-blue-500 pt-4 ml-3"></i><input type="number" name='pin' onChange={changedInput}  placeholder='Enter  pin code' className='border-none outline-none w-[70%]' /></div>  
                        <p className='mx-[20%] text-red-600'>{errMsg}</p>
                        <div className='mx-[30%] w-[40%]'><button type='submit' className='mt-4 bg-blue-500 w-[100%] h-8 mb-8 rounded-full'>Add</button></div>
                        <div className='mx-[30%] w-[40%]'><button type='button' className='mt-4 bg-red-500 w-[100%] h-8 mb-8 rounded-full' onClick={cancelFunction}>cancel</button></div>
         </form>

      </div>
    </div>
  )
}
