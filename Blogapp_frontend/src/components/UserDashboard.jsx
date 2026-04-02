import React from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router';
function UserDashboard() {
  let currentUser = useAuth(state => state.currentUser);
  let navigate = useNavigate();
  const viewArticles = () => {
    navigate("/articles")
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Welcome, {currentUser?.firstName} ...
        </h2>
        <p className="text-gray-600 mb-8">
          Explore articles and stay updated with the latest content.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={viewArticles}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-lg transition"
          >
            View Articles
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard