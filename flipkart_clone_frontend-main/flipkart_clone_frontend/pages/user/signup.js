import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
// import Logo from '/home/nte-590-vm/Tantra_project/flipkart_clone_frontend/flipkart_clone_frontend/public/ecomlogo.png'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'

export default function signup() {
  const [regDetails,setRegDetails]=useState({name:"",age:"",email:"",password:"",regno:"",key:"",displaypic:""})
  const [errormsg,setErrorMsg]=useState();
  const router=useRouter();
  const changedInput=(e)=>{
    const fieldname=e.target.name;
    const inpval=e.target.value;
    setRegDetails({...regDetails,[fieldname]:inpval});
  }
  const imageUpload=async(e)=>{
    var ifile=e.target.files[0];
    const data=new FormData();
    data.append('file',ifile);
    data.append('upload_preset','debarchandash10')
    const result=await axios.post('https://api.cloudinary.com/v1_1/debarchandash/image/upload',data);
    setRegDetails({...regDetails,'displaypic':result.data.secure_url});
  }
  const submitHandler=async(e)=>{
    e.preventDefault();

    const result=await axios.post('http://localhost:5000/api/signup',regDetails);
    console.log(result);
    if(result.status===201)
    {
      router.push('/user/login'); 
    }
    else{
      console.log(result.response.data.message)
    setErrorMsg(result.response.data.message);
    }
    
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
       <div className='mt-16'>
       <div className='container mx-auto mt-8 w-[90%] justify-center sm:w-[400px]  xl:w-1/3 bg-white
     rounded-[20px] drop-shadow-xl border-2 border-blue-300'>
      <div className=' ml-[30%] w-[40%] justify-center'><Image  src="/ecomlogo.png" width={200} height={200}/></div>
        <h1 className='font-bold text-2xl  ml-[35%] pb-2 font-sans'>SignUp</h1>
        <form onSubmit={submitHandler}>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><i className="fa-solid fa-circle-user text-blue-500 pt-4 ml-3"></i><input type="text" name='name' onChange={changedInput}  placeholder='Name' className='border-none outline-none w-[70%]' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><i className="fab fa-adn text-blue-500 pt-4 ml-3"></i><input type="number" name='age' onChange={changedInput}  placeholder='Age' className='border-none outline-none w-[70%]' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50'><i className="fa-solid fa-envelope text-blue-500 pt-4 ml-3"></i><input type="text" name='email' onChange={changedInput}  placeholder='Email' className='border-none outline-none w-[70%]' /></div>  
                        <p>{errormsg}</p>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50 '> <i className="fa-solid fa-lock text-blue-500 pt-4 ml-3"></i><input type="text" name='password' onChange={changedInput} placeholder='Password' className='border-none outline-none w-[65%]' /><i className="fa-solid fa-eye text-blue-500 pt-4"></i></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50 '><i className="fa-solid fa-hashtag text-blue-500 pt-4 ml-3"></i><input type="text" name='regno' onChange={changedInput}  placeholder='Registration No' className='border-none outline-none w-[70%]' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8  shadow-md shadow-blue-500/50 '><i className="fas fa-key text-blue-500 pt-4 ml-3"></i><input type="text" name='key' onChange={changedInput}  placeholder='Enter secret key(optional)' className='border-none outline-none w-[70%]' /></div>
                        <div className='mx-auto h-12 w-[75%] rounded-full mt-8 shadow-md shadow-blue-500/50 object-center'><input type="file" name='displaypic' onChange={imageUpload}   placeholder='ProfilePicture' className='file:bg-gradient-to-b file:bg-blue-500 file:border-none file:rounded-full file:text-white w-[70%] pt-3' /></div>
                        <div className='mt-4 ml-20'>
                            <input type="checkbox" name='chkbx'  />I read and agree to <a href='https://privacyterms.io/privacy/privacy-policy-vs-terms-and-conditions/' className='text-blue-600'>Terms & conditions</a>
                        </div>
                        <div className='mx-[30%] w-[40%]'><button type='submit' className='mt-4 bg-blue-500 w-[100%] h-8 mb-8 rounded-full'>SignUp</button></div>
         </form>
        <div className='pb-4 ml-[35%]'><Link href="" ><a  className='text-red-500 underline underline-offset-1'>Forgot Password</a></Link></div>
        <div className='pb-4  ml-[40%]'><Link  href="/user/login"><a className='text-blue-500 underline underline-offset-1'>Login</a></Link></div>
      </div>
      </div>
   </>
  )
}
