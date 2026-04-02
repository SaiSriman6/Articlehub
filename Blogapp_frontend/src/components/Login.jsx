import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast'

function Login() {
  let { register, handleSubmit } = useForm();
  const login = useAuth(state => state.login);
  const isAuthenticated = useAuth(state => state.isAuthenticated);
  const currentUser = useAuth(state => state.currentUser)
  const error = useAuth(state => state.error)
  const navigate = useNavigate();
  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
  }
  const toRegister = () => {
    navigate("/register")
  }
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login Successfully");

      if (currentUser.role === "USER") navigate("/user-profile");
      if (currentUser.role === "AUTHOR") navigate("/author-profile");
      if (currentUser.role === "ADMIN") navigate("/admin-profile");
    }
  }, [currentUser, isAuthenticated])
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h1>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit(onUserLogin)} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          New User?{" "}
          <button
            onClick={toRegister}
            className="text-blue-500 hover:underline font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login