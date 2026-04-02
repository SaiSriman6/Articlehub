import React from "react";
import { useNavigate } from "react-router";

function AdminDashboard() {
  let navigate = useNavigate();
  const viewArticles = () => {
    navigate("/articles");
  };
  const viewUsers = () => {
    navigate("/users");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center">
      <div className="grid md:grid-cols-2 gap-10 w-[80%]">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center hover:shadow-2xl transition duration-300">
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            View All Users
          </h1>
          <button
            onClick={viewUsers}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-300"
          >
            View Users
          </button>
        </div>
      
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center hover:shadow-2xl transition duration-300">
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            Manage Articles
          </h1>
          <button
            onClick={viewArticles}
            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition duration-300"
          >
            View Articles
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;