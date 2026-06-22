import crown from "../assets/crown.png";
import iconlogo from "../assets/plane.png";

import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoutesList from "../utils/routesList";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".user-menu-container")) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate(RoutesList.Login);
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();
    }
    if (user?.name) {
      const parts = user.name.split(/[\s-]+/);
      if (parts.length >= 2) {
        return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
      }
      return (parts[0][0] || "").toUpperCase();
    }
    return "U";
  };

  // 🎯 Active Link Style
  const activeLink = (path) =>
    location.pathname === path
      ? "text-[#d14b30] font-bold"
      : "text-black hover:text-[#d14b30] transition";

  return (
    <>
      {/* 🧭 NAVBAR */}
      <div className="flex justify-between items-center w-full px-4 md:px-10 py-3 bg-white sticky top-0 z-50 shadow-sm">

        {/* 🪙 LOGO */}
        <Link to={RoutesList.Home}>
          <div className="logo flex items-center gap-2 relative cursor-pointer">
            <p className="text-black text-lg md:text-2xl font-bold">
              Wander
              <span className="text-[#d14b30] font-extrabold">L</span>
              ust
            </p>

            <img
              src={iconlogo}
              className="w-10 md:w-16 absolute left-16 md:left-26 top-[-10%] md:top-[-15%]"
              data-aos="flip-left"
              alt="plane"
            />
          </div>
        </Link>

        {/* 🖥️ DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8 font-semibold">

          <Link to={RoutesList.Home} className={activeLink(RoutesList.Home)}>
            Home
          </Link>

          {/* 🌍 Countries
          <Link to={RoutesList.Country} className="text-black hover:text-[#d14b30] transition cursor-pointer">
            Countries
          </Link> */}

          {/* 🗓️ Trip Plan
          <Link to={RoutesList.TripPlan} className="text-black hover:text-[#d14b30] transition cursor-pointer">
            Trip Plan
          </Link> */}

          <Link to={RoutesList.Subscription} className={activeLink(RoutesList.Subscription)}>
            Subscription
          </Link>

          {/* 👑 Premium Badge */}
          <Link
            to={RoutesList.Premium}
            className={`flex items-center gap-2 transition ${location.pathname === RoutesList.Premium
              ? "text-[#d14b30] font-bold"
              : "text-gray-600 hover:text-[#d14b30]"
              }`}
          >
            <img src={crown} alt="crown" className="w-5" />
            <span className="text-sm">Premium</span>
          </Link>
        </div>

        {/* 🔘 DESKTOP AUTH BUTTONS / USER DROPDOWN */}
        <div className="hidden md:flex items-center gap-3 relative user-menu-container">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-[#d14b30] text-white flex items-center justify-center font-bold text-sm shadow-md hover:scale-105 transition duration-200"
              >
                {getInitials()}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 text-left">
                    <p className="text-sm font-bold text-gray-800 leading-tight">
                      {(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : (user?.name || "Explorer")}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to={RoutesList.Profile}
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d14b30] font-semibold text-left transition duration-200"
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d14b30] font-semibold transition duration-200"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to={RoutesList.Login}>
                <button className="text-black px-4 py-1.5 rounded-full font-semibold hover:text-[#d14b30] transition">
                  Login
                </button>
              </Link>

              <Link to={RoutesList.Signup}>
                <button className="bg-[#d14b30] px-5 py-1.5 rounded-full text-white hover:scale-105 transition shadow-md">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile User Initials Avatar & Dropdown */}
        {isAuthenticated && (
          <div className="md:hidden relative mr-2 user-menu-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-9 h-9 rounded-full bg-[#d14b30] text-white flex items-center justify-center font-bold text-sm shadow-md"
            >
              {getInitials()}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 text-left">
                <div className="px-4 py-1 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : (user?.name || "Explorer")}
                  </p>
                </div>
                <Link
                  to={RoutesList.Profile}
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d14b30] font-semibold"
                >
                  👤 Profile
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d14b30] font-semibold"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* 🍔 MOBILE HAMBURGER */}
        <button
          className="md:hidden z-50 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 🌑 OVERLAY */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40
          transition-all duration-500
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={() => setOpen(false)}
      />

      {/* 📱 MOBILE DRAWER */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white z-50
          transform transition-transform duration-500 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          p-6 flex flex-col gap-6 shadow-2xl
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d14b30] text-white flex items-center justify-center font-bold text-sm shadow-md">
                {getInitials()}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-black leading-tight">
                  {(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : (user?.name || "Explorer")}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[150px]">
                  {user?.email}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xl font-bold text-black">Menu</p>
          )}
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Links */}
        <nav className="flex flex-col gap-4">
          <Link
            to={RoutesList.Home}
            onClick={() => setOpen(false)}
            className={activeLink("/home")}
          >
            🏠 Home
          </Link>

          {/* 🌍 Countries - Mobile
          <Link
            to={RoutesList.Country}
            onClick={() => setOpen(false)}
            className="text-black hover:text-[#d14b30] transition cursor-pointer font-semibold"
          >
            🌍 Countries
          </Link> */}

          {/* 🗓️ Trip Plan - Mobile
          <Link
            to={RoutesList.TripPlan}
            onClick={() => setOpen(false)}
            className="text-black hover:text-[#d14b30] transition cursor-pointer font-semibold"
          >
            🗓️ Trip Plan
          </Link> */}

          <Link
            to={RoutesList.Subscription}
            onClick={() => setOpen(false)}
            className={activeLink(RoutesList.Subscription)}
          >
            💳 Subscription
          </Link>

          {/* Premium Badge */}
          <Link
            to={RoutesList.Premium}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 mt-2 p-3 bg-orange-50 rounded-xl"
          >
            <img src={crown} alt="crown" className="w-5" />
            <span className="font-semibold text-orange-600">Premium</span>
          </Link>
        </nav>

        {/* Mobile Auth Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full bg-gray-100 px-5 py-2.5 rounded-full text-black font-semibold border border-gray-300 hover:bg-gray-200 transition text-center"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to={RoutesList.Login} onClick={() => setOpen(false)}>
                <button className="w-full text-black px-4 py-2.5 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 transition">
                  Login
                </button>
              </Link>

              <Link to={RoutesList.Signup} onClick={() => setOpen(false)}>
                <button className="w-full bg-[#d14b30] px-5 py-2.5 rounded-full text-white font-semibold hover:scale-[1.02] transition shadow-md">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;