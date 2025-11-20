import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen w-full">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <span className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            Premium Guest House Booking
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Welcome to  
            <br />
            <span className="text-blue-700">Rishabh’s Guest House</span>
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            Stay at the most luxurious and comfortable guest houses across India.
            We provide a seamless booking experience, premium rooms, and top-quality hospitality.
          </p>

          <button className="px-6 py-3 bg-blue-700 text-white rounded-xl text-lg font-semibold shadow-md hover:bg-blue-800 transition">
            Book Now
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="https://cdn.pixabay.com/photo/2016/05/28/09/34/home-1421201_1280.jpg"
            alt="Guest House"
            className="rounded-3xl shadow-2xl w-full max-w-lg object-cover"
          />
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-3">
          Featured Guest Houses
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12">
          Handpicked premium spaces for your next stay
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* CARD 1 */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-4">
            <img
              src="https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=900&q=80"
              className="rounded-2xl w-full h-56 object-cover"
              alt="Property"
            />
            <h3 className="text-xl font-bold mt-4">Luxury Premium Stay</h3>
            <p className="text-gray-600">📍 Mumbai, India</p>
            <p className="text-yellow-600 mt-2 font-semibold">⭐ 4.9 (250 reviews)</p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-4">
            <img
              src="https://images.unsplash.com/photo-1560448075-bb4b1a2ab1a7?auto=format&fit=crop&w=900&q=80"
              className="rounded-2xl w-full h-56 object-cover"
              alt="Property"
            />
            <h3 className="text-xl font-bold mt-4">Mountain View Retreat</h3>
            <p className="text-gray-600">📍 Manali, India</p>
            <p className="text-yellow-600 mt-2 font-semibold">⭐ 4.8 (180 reviews)</p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-4">
            <img
              src="https://images.unsplash.com/photo-1572120360610-d971b9b78825?auto=format&fit=crop&w=900&q=80"
              className="rounded-2xl w-full h-56 object-cover"
              alt="Property"
            />
            <h3 className="text-xl font-bold mt-4">Urban Premium Suite</h3>
            <p className="text-gray-600">📍 Bangalore, India</p>
            <p className="text-yellow-600 mt-2 font-semibold">⭐ 4.7 (300 reviews)</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
