import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

function UsersList() {
  let [users, setUsers] = useState([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);
  const navigate = useNavigate();
  const deleteUser = async (userObj) => {
    const obj = { isActive: !userObj.isActive };
    try {
      setLoading(true);
      let res = await axios.patch(
        `https://articlehub-yu4s.onrender.com/admin-api/users/${userObj?._id}/status`,
        obj,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(
          userObj.isActive
            ? "Blocked Successfully 🚫"
            : "Unblocked Successfully ✅"
        );
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === userObj._id
              ? { ...u, isActive: !u.isActive }
              : u
          )
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function getUsers() {
      try {
        setLoading(true);
        let res = await axios.get(
          "http://localhost:4000/admin-api/users",
          { withCredentials: true }
        );
        if (res.status === 200) {
          setUsers(res.data.payload);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold text-blue-600">
        Loading users...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <button
        onClick={() => navigate("/admin-profile")}
        className="mb-8 px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        ⬅ Back to Dashboard
      </button>
      {error && (
        <p className="text-red-500 font-semibold mb-4">
          {error}
        </p>
      )}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {user.firstName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {user.email}
            </p>
            <p className="text-sm mt-2">
              Role:
              <span className="ml-1 font-medium text-blue-500">
                {user.role}
              </span>
            </p>
            <p
              className={`text-sm mt-1 font-semibold ${
                user.isActive
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {user.isActive ? "Active" : "Blocked"}
            </p>
            <button
              onClick={() => deleteUser(user)}
              className={`w-full mt-4 py-2 rounded-lg text-white font-medium transition ${
                user.isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {user.isActive ? "Block User 🚫" : "Unblock User ✅"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default UsersList;