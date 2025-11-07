import React from "react";
import { MdOutlineHome } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo & Brand Name */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white rounded-lg shadow">
            <MdOutlineHome className="text-blue-600 text-xl" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-white">
            Rishabh’s Guest-House
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-white font-medium">
          <a href="/about" className="hover:text-gray-200 transition">About</a>
          <a href="/contact" className="hover:text-gray-200 transition">Contact</a>
          <a href="/faq" className="hover:text-gray-200 transition">FAQ</a>
          <a href="/privacy" className="hover:text-gray-200 transition">Privacy</a>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 to-blue-600 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between text-white">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <div className="p-2 bg-white rounded-lg shadow">
            <MdOutlineHome className="text-blue-600 text-xl" />
          </div>
          <h1 className="text-lg font-semibold">Rishabh’s Guest-House</h1>
        </div>

        {/* Menu Links */}
        <div className="flex space-x-6 text-sm font-medium">
          <a href="/about" className="hover:text-gray-200 transition">About</a>
          <a href="/contact" className="hover:text-gray-200 transition">Contact</a>
          <a href="/faq" className="hover:text-gray-200 transition">FAQ</a>
        </div>
      </div>
    </footer>
  );
};

export { Navbar, Footer };
