import React, { useState,useEffect} from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { useNavigate } from 'react-router';
import {toast} from 'react-hot-toast'

function Register() {
  let { register, handleSubmit,formState:{errors} } = useForm();
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);
  let navigate = useNavigate();
  let [preview,setPreview]=useState(null)

  let onUserRegister = async (newUser) => {

    setLoading(true);
    // Create form data object
        const formData = new FormData();
        //get user object
        let { role, profileImageUrl, ...userObj } = newUser;
        //add all fields except profilePic to FormData object
        Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
        });
        // add profilePic to Formdata object
        formData.append("profileImageUrl", profileImageUrl[0]) 
    try {

      if (role === "user") {
        let res = await axios.post(`${import.meta.env.VITE_API_URL}/user-api/users`, formData);
        if (res.status === 201){
          toast.success("Registration successful! Please login.");
          navigate('/login');
        } 
      }
      if (role === "author") {
        let res = await axios.post(`${import.meta.env.VITE_API_URL}/author-api/users`, formData);
        if (res.status === 201) {
          toast.success("Registration successful! Please login.");
          navigate('/login');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
        }, [preview]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-xl text-blue-600 animate-pulse">
          Creating account...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit(onUserRegister)} className="space-y-5">

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              Select Role
            </p>
            <div className="flex gap-6 justify-center">
              <label className="flex items-center gap-2">
                <input type="radio" value="user" {...register("role",{required:true})} />
                User
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" value="author" {...register("role",{required:true})} />
                Author
              </label>
            </div>
            {errors.role?.type === "required" && (
  <p className="text-red-500 text-sm mt-1">Role is required</p>
         )}

          </div>

          <div className="flex gap-3">
            <input
              type="text"
              {...register("firstName",{required:true})}
              placeholder="First Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              {...register("lastName")}
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.firstName?.type === "required" && (
           <p className="text-red-500 text-sm mt-1">firstName is required</p>
           )}
          <input
            type="email"
            {...register("email",{required:true})}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email?.type === "required" && (
  <p className="text-red-500 text-sm mt-1">Email is required</p>
)}

          <input
            type="password"
            {...register("password",{required:true})}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password?.type === "required" && (
  <p className="text-red-500 text-sm mt-1">Password is required</p>
)}


         <input
        type="file"
        accept="image/png, image/jpeg"
        {...register("profileImageUrl")}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        onChange={(e) => {

            //get image file
            const file = e.target.files[0];
            // validation for image format
            if (file) {
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                setError("Only JPG or PNG allowed");
                return;
                }
                //validation for file size
                if (file.size > 2 * 1024 * 1024) {
                setError("File size must be less than 2MB");
                return;
                }
                //Converts file → temporary browser URL(create preview URL)
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setError(null);
            }

        }} />
        {preview && (
                <div className="mt-3 flex justify-center">
                <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border"
                />
                </div>
            )}
            
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register