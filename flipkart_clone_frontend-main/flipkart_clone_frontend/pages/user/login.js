import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router';
import Navbar from '../../components/Navbar'


export default function login() {
  const [logDetails,setLogDetails]=useState({email:"",password:""});
  const router=useRouter()
  const changedInput = (e) => {
    const inpfield = e.target.name;
    const inpval = e.target.value;
    setLogDetails({ ...logDetails, [inpfield]: inpval })
  }
  const doLogin=async(e)=>{
    e.preventDefault();
    const result=await axios.post('http://localhost:5000/api/signin',logDetails);
    if(result.status===201){
      localStorage.setItem('token',result.data.token);
      const userdata=result.data.user;
      delete userdata.password;
      localStorage.setItem('fcuserdata',JSON.stringify(userdata));
      router.push('/');
    }
    // console.log(result);
  }
  const checklogin=()=>{
    const token=localStorage.getItem('token');
    if(token){
      router.push('/')
    }
  }
  useEffect(()=>{
    checklogin();
  },[])
  
  return (
   <>
    <Navbar/>
       <Script src="https://kit.fontawesome.com/ed99ad750a.js" crossOrigin="anonymous" strategy="beforeInteractive"/>
       <div className="mt-16 " >
       <div className='container mx-auto mt-8 w-[90%] justify-center sm:w-[400px]  xl:w-1/3 bg-white
     rounded-[20px] drop-shadow-xl border-2 border-blue-300'>
      <div className=' ml-[30%] w-[40%] justify-center'><Image  src="/ecomlogo.png" width={200} height={200}/></div>
        <h1 className='font-bold text-2xl  ml-[35%] pb-2 font-sans'>Login</h1>
        <form onSubmit={doLogin}>

          <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md blue-500/50'><i className="fa-solid fa-envelope text-blue-500 pt-4 ml-3"></i><input type="text" onChange={changedInput} value={logDetails.email} name='email'  placeholder='Email' className='border-none outline-none w-[70%]'/></div>
          <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md blue-500/50 '> <i className="fa-solid fa-lock text-blue-500 pt-4 ml-3"></i><input type="password" onChange={changedInput} value={logDetails.password} name='password'  placeholder='Password' className='border-none outline-none w-[65%]' /><i className="fa-solid fa-eye text-blue-500 pt-4"></i></div>
          <p className='text-red-500'></p>
          <div className='mt-8 ml-[30%]'>
            <input type="checkbox" name='chkbx' /> Remember me?
          </div>
          <div className='w-[40%]'></div><button className='mt-8 ml-[30%] bg-blue-500 w-[30%] h-8 mb-8 rounded-full'>LOGIN</button>
        </form>
        <div className='pb-4 ml-[30%]'><Link href="" ><a  className='text-red-500 underline underline-offset-1'>Forgot Password</a></Link></div>
        <div className='pb-4  ml-[40%]'><Link  href="http://localhost:3000/user/signup"><a className='text-blue-500 underline underline-offset-1'>Sign Up</a></Link></div>
      </div>
      </div>
   </>
  )
}
