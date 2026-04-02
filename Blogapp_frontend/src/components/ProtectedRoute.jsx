import React from 'react'
import { useAuth } from '../store/authStore'
import {Navigate} from 'react-router'

function ProtectedRoute({children,allowedRoles}) {
    let {currentUser,isAuthenticated,loading,logout}=useAuth();
    if(loading){
        return <p>Loading...</p>
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    if( allowedRoles && !allowedRoles.includes(currentUser.role)){
        //logout
        const Logout=async()=>{
            await logout();
        }
        Logout();
        //redirect to Login
        return <Navigate to="/" replace/>
    }
  return children;
}

export default ProtectedRoute