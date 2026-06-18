import crown from "../assets/crown.png";
import iconlogo from "../assets/plane.png";

import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import RoutesList from "../utils/routesList";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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

          {/* 👤 Profile */}
          <Link to={RoutesList.Profile} className="text-black hover:text-[#d14b30] transition cursor-pointer">
            Profile
          </Link>

          <Link to={RoutesList.Subscription} className={activeLink(RoutesList.Subscription)}>
            Subscription
          </Link>

          {/* 👑 Premium Badge */}
          <div className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-[#d14b30] transition">
            <img src={crown} alt="crown" className="w-5" />
            <span className="text-sm">Premium</span>
          </div>
        </div>

        {/* 🔘 DESKTOP AUTH BUTTONS */}
        <div className="hidden md:flex gap-3">
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
        </div>

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
          <p className="text-xl font-bold text-black">Menu</p>
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

          {/* 👤 Profile - Mobile */}
          <Link
            to={RoutesList.Profile}
            onClick={() => setOpen(false)}
            className="text-black hover:text-[#d14b30] transition cursor-pointer font-semibold"
          >
            👤 Profile
          </Link>

          <Link
            to={RoutesList.Subscription}
            onClick={() => setOpen(false)}
            className={activeLink(RoutesList.Subscription)}
          >
            💳 Subscription
          </Link>

          {/* Premium Badge */}
          <div className="flex items-center gap-2 mt-2 p-3 bg-orange-50 rounded-xl">
            <img src={crown} alt="crown" className="w-5" />
            <span className="font-semibold text-orange-600">Premium</span>
          </div>
        </nav>

        {/* Mobile Auth Buttons */}
        <div className="mt-auto flex flex-col gap-3">
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
        </div>
      </div>
    </>
  );
};

export default Navbar;