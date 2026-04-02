import React from 'react'
import { useNavigate } from 'react-router'
function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 text-center">
     
      <p className="text-gray-600 font-bold mb-8 max-w-xl">
        A platform to create, explore, and manage articles seamlessly.
      </p>
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-xl space-y-3 text-gray-700">
        <p>📝 Create and publish articles with ease using a clean editor.</p>
        <p>📚 Explore a wide range of articles across different categories.</p>
        <p>💬 Engage with content by adding comments and discussions.</p>
        <p>✏️ Edit, update, or manage your articles anytime.</p>
        <p>🔐 Secure authentication with role-based dashboards (User, Author, Admin).</p>
      </div>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Home