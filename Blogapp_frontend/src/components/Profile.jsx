import React from "react";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";

function Profile() {
  const currentUser = useAuth((state) => state.currentUser);

  const navigate = useNavigate();

  const toChangePass = () => {
    navigate("/change-password");
  };
 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex flex-col items-center justify-center p-6">
    <div className="w-full max-w-md">
      <button
        onClick={() => {
          if (currentUser?.role === "AUTHOR") {
            navigate("/author-profile");
          }
          if (currentUser?.role === "USER") {
            navigate("/user-profile");
          }
          if (currentUser?.role === "ADMIN") {
            navigate("/admin-profile");
          }
        }}
        className="mb-8 px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      > ⬅ Back to Dashboard
      </button>
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white mt-20">
            <span className="text-4xl font-bold text-indigo-600">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        {/* Profile Content */}
        <div className="pt-16 px-8 pb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {currentUser?.firstName}
          </h1>
          <p className="text-gray-500 mt-2">
            {currentUser?.email}
          </p>
          {/* Info Cards */}
          <div className="mt-8 space-y-4">
            <div className="bg-gray-100 rounded-xl p-4 text-left shadow-sm">
              <p className="text-sm text-gray-500">First Name</p>
              <h2 className="text-lg font-semibold text-gray-800">
                {currentUser?.firstName}
              </h2>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-left shadow-sm">
              <p className="text-sm text-gray-500">Email Address</p>
              <h2 className="text-lg font-semibold text-gray-800 break-words">
                {currentUser?.email}
              </h2>
            </div>
          </div>
          {/* Button */}
          <button
            onClick={toChangePass}
            className="mt-8 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition duration-300"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default Profile;
