import React, { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">

        {/* LOGO + TITLE */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.jpeg"
            className="w-12 h-12 rounded-full shadow object-cover"
            alt="logo"
          />
          <span className="text-2xl font-bold text-blue-900 tracking-wide">
            Rishabh's Guest House
          </span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-3xl text-gray-700"
        >
          {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t pb-4 px-6 flex flex-col items-start gap-4">
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
