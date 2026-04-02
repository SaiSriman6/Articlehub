import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import {Outlet} from 'react-router'
import {useAuth} from '../store/authStore'


function RootLayout() {
  let checkUser= useAuth(state => state.checkUser);

  const checkUserDetails = async() => {
        await checkUser();
    }

   useEffect(()=> {
       
        checkUserDetails();
  },[])

  return (
    <div>
        <Header/>
        <div className=' min-h-screen'>
            {/* {component placeholder} */}
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout;