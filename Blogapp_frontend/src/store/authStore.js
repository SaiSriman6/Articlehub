import {create} from 'zustand'
import axios from 'axios'

export const useAuth=create((set)=>({
    currentUser:null,
    loading:false,
    isAuthenticated:false,
    error:null,
    login:async(userCredWithRole)=>{
        const {...userObj}=userCredWithRole;
        try{
            set({loading:true,error:null});
            
            let res=await axios.post("https://articlehub-yu4s.onrender.com/common-api/login",
                userObj,
            {withCredentials:true})
            set({loading:false,
                isAuthenticated:true,
                currentUser:res.data.payload
            })
    
        }catch(err){
          set({
              loading:false,
              isAuthenticated:false,
              currentUser:null,
              error:err.response?.data?.error || "Login failed",
          });
        }
    },
    logout:async()=>{
        //set loading state 
        //make logout update state
        //update state
        try{
           set({loading:true,error:null})
           await axios.get("https://articlehub-yu4s.onrender.com/common-api/logout",{withCredentials:true})
           set({
            currentUser:null,
            loading:false,
            isAuthenticated:false
           })
        }catch(err){
          set({
              loading:false,
              isAuthenticated:false,
              currentUser:null,
              error:err.response?.data?.error || "LogOut failed",
          });
    }
    },

   checkUser : async () => {
        try{
            set({
                loading : true,
                error : null
            })
            let res = await axios.get('https://articlehub-yu4s.onrender.com/common-api/check-auth',{withCredentials : true})
            
            set({
                currentUser : res.data.payload,
                isAuthenticated : true,
                loading : false
            })
        }catch(err){
            set({
                loading : false,
                error : err.response?.data?.error || "Failed"
            })
        }
    }
}))