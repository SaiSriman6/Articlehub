import React from 'react'

import { useNavigate } from 'react-router'


function AuthorDashboard() {
  let navigate = useNavigate();
  const publishArticle = () => {
    navigate("/add-article");
  }
  const viewArticles = () => {
    navigate("/articles");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center">
      <div className="flex flex-1 justify-center items-center px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create New Article
            </h2>
            <p className="text-gray-600 mb-6">
              Share your thoughts, ideas, and knowledge with others.
            </p>
            <button
              onClick={publishArticle}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              Create Article
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Articles
            </h2>
            <p className="text-gray-600 mb-6">
              Manage, edit, or delete your published articles.
            </p>
            <button
              onClick={viewArticles}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
            >
              View Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorDashboard