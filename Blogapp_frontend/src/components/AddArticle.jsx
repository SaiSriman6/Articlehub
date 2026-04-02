import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router';
function AddArticle() {
  let { register, handleSubmit,formState:{errors} } = useForm()
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate()
  const addArticle = async (articleObj) => {
    setLoading(true);
    try {
      let res = await axios.post(
        "https://articlehub-yu4s.onrender.com/author-api/articles",
        articleObj,
        { withCredentials: true }
      );
      if (res.status === 201) {
        toast.success("Article Published Successfully");
        navigate("/author-articles");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-xl text-blue-600 animate-pulse">
          Publishing article...
        </p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Article
        </h1>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit(addArticle)} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title",{required:true})}
              placeholder="Enter article title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.title?.type === "required" && (
             <p className="text-red-500 text-sm mt-1">Title is required</p>
         )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <input
              type="text"
              {...register("category",{required:true})}
              placeholder="e.g. Gaming,Sports,Health...."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.category?.type === "required" && (
  <p className="text-red-500 text-sm mt-1">Category is required</p>
)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Content
            </label>
            <textarea
              rows="6"
              {...register("content",{required:true})}
              placeholder="Write your article here..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            {errors.content?.type === "required" && (
          <p className="text-red-500 text-sm mt-1">Content is required</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddArticle