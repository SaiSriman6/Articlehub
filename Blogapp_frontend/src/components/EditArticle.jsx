import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function EditArticle() {
  let { register, handleSubmit } = useForm();
  let { state } = useLocation();
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let currentUser = useAuth((state) => state.currentUser);

  const editArticle = async (articleObj) => {
    setLoading(true);

    const updatedArticle = {
      ...state.article,
      ...articleObj,
      author: currentUser._id,
      articleId: state.article._id,
    };

    try {
      let res = await axios.put(
        "https://articlehub-yu4s.onrender.com/author-api/articles",
        updatedArticle,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Article Updated Successfully 🎉");

        navigate(`/article/${state.article._id}`, {
          state: { article: res.data.payload },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start sm:items-center px-3 sm:px-6 py-6">
      
      {/* Card */}
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white shadow-xl rounded-2xl p-5 sm:p-8">

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Edit Article ✏️
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-3 text-sm sm:text-base">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-blue-500 text-center mb-3 animate-pulse text-sm sm:text-base">
            Updating article...
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(editArticle)}
          className="space-y-4 sm:space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>

            <input
              type="text"
              defaultValue={state?.article?.title}
              {...register("title")}
              className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>

            <input
              type="text"
              defaultValue={state?.article?.category}
              {...register("category")}
              className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Content
            </label>

            <textarea
              rows="6"
              defaultValue={state?.article?.content}
              {...register("content")}
              className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
            >
              Update Article
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2.5 rounded-lg transition"
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditArticle;