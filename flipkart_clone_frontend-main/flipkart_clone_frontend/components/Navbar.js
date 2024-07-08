import React, { useEffect,useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { BsCart3 } from 'react-icons/bs';
import {FaBars} from 'react-icons/fa';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Navbar(props) {
  const [scrollDirection, setScrollDirection] = useState(null);

  const [show,setShow]=useState(true);
  
  const router=useRouter();
  const [loginState,setLoginState]=useState(false);
  const [userDetails,setUserDetails]=useState({});
  const [totalItems,setTotalItems]=useState();
  const [sideBar,setSideBar]=useState(false);
  

  const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('fcuserdata');
    setLoginState(false)
    router.push('/');
  }
  const getProductCount=async(id)=>{
   const result=await axios.get("http://localhost:5000/api/cart/fetch/" +id)
   if(result.data.product[0]){
     const productarr=result.data.product[0].product_id;
     setTotalItems(productarr.length);
   }
  }
  const goToAddress=()=>{
    setSideBar(!sideBar);
    router.push('/user/address')
  }
 
  useEffect(() => {
    const token=localStorage.getItem('token');
    if(token!==null)
    {
      setLoginState(true)
      setUserDetails(JSON.parse(localStorage.getItem('fcuserdata')));
      getProductCount(JSON.parse(localStorage.getItem('fcuserdata'))._id);

    }
  }, [loginState])
  

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
        if(direction==="down"){
          setShow(false)
        }
        else{
          setShow(true)
        }
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    }
  }, [scrollDirection]);
  return (
    <>
      <nav className={`${show?'block':'hidden'} font-serif mb-4 m-0 flex flex-row justify-between h-14 fixed top-0 left-0 right-0 z-50  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...`}>
        <div className='w-1/5 flex flex-row items-center justify-evenly'>
        {loginState?
        <button className='ml-[5%]  float-left text-white text-xs sm:text-lg ' onClick={()=>{setSideBar(!sideBar)}}><FaBars/></button>:null}
        <Link href="/">
          <a className='ml-[2%]  float-left text-white text-xs sm:text-lg '>HOME</a>
        </Link>
        </div>
        {loginState?
          <div className='w-[75%] cdm:w-2/5 sm:w-[60%]  xl:w-1/4 flex flex-row items-center justify-between'>
            <div className='block box-border h-4 w-4 md:h-8 md:w-8 overflow-hidden rounded-full transform hover:scale-150 mr-5 '>
              <img src={userDetails.image} alt="Dp" className='h-full w-full object-cover' />
            </div>
            <button onClick={logout} className='mr-[5%]   float-right text-white text-xs sm:text-lg'>LOGOUT</button>
            <Link href="/user/cart">
              <a className='mr-[5%] text-white  '><div className='flex flex-row justify-end text-base sm:text-lg '><div className=''><BsCart3/></div><span className=' z-5 '>{props.total_no_item?props.total_no_item:totalItems}</span></div></a>
            </Link>
            {userDetails.role==="admin"?<Link href="/user/addproduct"><a className='mr-[5%] text-xs  float-right text-white sm:text-lg '>ADD PRODUCT</a></Link>:null}
            
          </div>:
          <div className='flex flex-row items-center mx-5'>
            <Link href="/user/login" >
             <a className='mr-[5%]  float-right text-white text-xs sm:text-lg '>LOGIN</a>
            </Link>
            </div>
        }       
      </nav>
      {sideBar ? (
        <>
          <div className="justify-start items-start flex overflow-y-auto fixed inset-l-0 inset-t-10 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0  shadow-lg relative flex flex-col h-fit w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-pink-400">
                    {userDetails.name}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0   float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setSideBar(false)}
                  >
                    <span className=" text-red-500 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className='grid grid-cols-1'>
                  <div className='h-16 text-center mt-8'>
                    <button className='border-collapse' onClick={goToAddress}>Add Address</button>
                  </div>
                  <div className='h-16 text-center'>
                    {
                      userDetails.role==="admin"?<Link href="/user/orderhistory"><a>OrderHistory</a></Link>:null
                    }
                  </div>
                </div>
               
                {/*footer*/}
                <hr/>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setSideBar(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

    </>
  )
}
