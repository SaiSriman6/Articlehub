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
            
            let res=await axios.post(`${import.meta.env.VITE_API_URL}/common-api/login`,
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
           await axios.get(`${import.meta.env.VITE_API_URL}/common-api/logout`,{withCredentials:true})
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
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/common-api/check-auth`,{withCredentials : true})
            
            set({
                currentUser : res.data.payload,
                isAuthenticated : true,
                loading : false
            })
        }catch(err){
            set({
                loading : false,
                isAuthenticated:false,
                currentUser:null,
                error : err.response?.data?.error || "Failed"
            })
        }
    }
}),{
    name: 'auth-storage',
    partialize: (state) => ({ currentUser: state.currentUser, isAuthenticated: state.isAuthenticated })
}
)