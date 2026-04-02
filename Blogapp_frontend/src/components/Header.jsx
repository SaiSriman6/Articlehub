import React, { useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import logo from "../assets/OIP (1).jpg";

function Header() {
  let currentUser = useAuth((state) => state.currentUser);
  let logout = useAuth((state) => state.logout);
  let navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const onLogout = async () => {
    await logout();
    toast.success("Logout successful ✅");
    navigate("/login");
  };
  const navStyle =
    "text-gray-700 hover:text-blue-600 font-medium transition";
  const activeStyle = "text-blue-600 font-semibold underline";
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold text-blue-600">
            ARTICLEHUB
          </h1>
        </div>
        {currentUser && (
        <h1 className="hidden md:block text-lg font-semibold text-gray-700">
        {`${currentUser.firstName.charAt(0).toUpperCase()}${currentUser.firstName.slice(1)}'s Dashboard 👋`}
       </h1>
       )}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          } md:flex`}
        >
          {!currentUser ? (
            <ul className="flex flex-col md:flex-row gap-6 p-6 md:p-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? activeStyle : navStyle
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? activeStyle : navStyle
                  }
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? activeStyle : navStyle
                  }
                >
                  Login
                </NavLink>
              </li>
            </ul>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-0">
              <img
                src={currentUser.profileImageUrl}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
              />
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
              >
                Logout 🚪
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
export default Header;