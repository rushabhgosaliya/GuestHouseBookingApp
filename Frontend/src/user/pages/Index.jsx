import React from "react";
import UserNav from "../components/Navbar";

const Index = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ Top Navbar */}
      <UserNav />

      {/* 🌄 Hero Section */}
      <div className="relative w-full h-screen">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Guest House"
          className="w-full h-full object-cover"
        />

        {/* 🖤 Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white px-6">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-wide drop-shadow-xl">
            Welcome to{" "}
            <span className="text-white">Rishabh’s Guest-House</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mb-10 opacity-90 font-light leading-relaxed">
            A peaceful escape where luxury meets comfort. Enjoy elegant rooms,
            serene surroundings, and heartfelt hospitality — your perfect stay
            begins here.
          </p>

          {/* ✨ Book Now Button */}
          <button
            style={{ width: "200px" }}
            onClick={() => (window.location.href = "/bookingform")}
            className="px-8 py-3 rounded-lg font-semibold text-white 
             bg-gradient-to-r from-yellow-500 to-amber-600 
             shadow-md hover:shadow-xl hover:scale-105 
             transition-all duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
