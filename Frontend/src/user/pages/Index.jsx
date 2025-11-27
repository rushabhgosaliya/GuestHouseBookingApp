import React from "react";
import LandingNavbar from "../components/LandingNavbar ";
import GuestHouseCard from "../components/GuestHouseCard";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  // BOOK NOW LOGIC
  const handleBookNow = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
    } else {
      navigate("/bookingform");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200 overflow-x-hidden">
      {/* NAVBAR */}
      <LandingNavbar />

      {/* HERO SECTION (UPDATED) */}
      <section
        className="relative w-full min-h-[90vh] flex flex-col justify-center items-center text-center 
        bg-cover bg-center bg-no-repeat shadow-2xl rounded-b-3xl"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.5px] rounded-b-3xl"></div>

        {/* CENTERED CONTENT */}
        <div className="relative z-10 max-w-4xl px-4 w-full flex flex-col items-center">
          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-2xl leading-tight whitespace-nowrap mt-10">
            Welcome to Rishabh's Guest House
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-gray-200 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg">
            Book your stay with comfort, luxury, and peace of mind.
          </p>

          {/* BOOK NOW BUTTON ONLY (FORM REMOVED) */}
          <button
            onClick={handleBookNow}
            className="mt-10 w-full md:w-auto bg-white text-blue-800 px-10 py-4 rounded-xl 
            font-semibold text-lg shadow-xl hover:bg-blue-800  hover:text-white transition-all duration-300"
          >
            Book Now
          </button>
        </div>
      </section>

      {/* FEATURED GUEST HOUSES */}
      <section className="px-6 md:px-12 lg:px-20 pb-20 text-center mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-14 tracking-wide">
          Featured Guest Houses
        </h2>

        <GuestHouseCard isLanding={true} />
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 py-5 text-center shadow-inner border-t border-blue-900">
        <p className="text-white font-medium">
          © {new Date().getFullYear()} Rishabh's Guest-House. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
