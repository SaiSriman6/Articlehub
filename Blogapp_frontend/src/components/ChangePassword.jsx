import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const currentUser = useAuth((state) => state.currentUser);

  const onSubmit = async (userDetails) => {
    userDetails.email = currentUser.email;

    console.log(userDetails);

    try {
      setLoading(true);

      let res = await axios.put(
        `${import.meta.env.VITE_API_URL}/common-api/change-password`,
        userDetails,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Password Changed Successfully");
        navigate(`/profile/${currentUser._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col items-center justify-center px-4">

    {/* Back Button Above Card */}
    <div className="w-full max-w-md mb-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        ← Back
      </button>
    </div>

    {/* Change Password Card */}
    <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Change Password
          </h1>

          <p className="text-gray-500 mt-2">
            Update your account password securely
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Current Password
          </label>

          <input
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            type="password"
            placeholder="Enter current password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            New Password
          </label>

          <input
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition duration-300 disabled:opacity-50"
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  </div>
);
}

export default ChangePassword;