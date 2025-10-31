import React from "react";
import BookingForm from "./BookingForm";
import { Navigate, useNavigate } from "react-router-dom";

export default function GuestHouseCard() {

  const Navigate = useNavigate(); 

  const handleClick = () => {
    Navigate("/bookingform"); 
  };

  const guestHouses = [
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      name: "Cozy Guest House 1",
      desc: "Comfortable and welcoming guest house perfect for families.",
    },
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      name: "Luxury Villa",
      desc: "Premium villa with private pool and ocean view for ultimate relaxation.",
    },
    {
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      name: "Mountain Retreat",
      desc: "Peaceful getaway surrounded by fresh air and mountain views.",
    },
    {
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      name: "Lakeview Cottage",
      desc: "Serene lake-side cottage offering tranquility and beautiful sunsets.",
    },
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      name: "City Lights Apartment",
      desc: "Modern apartment in the heart of the city with rooftop access.",
    },
    {
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      name: "Desert Mirage Camp",
      desc: "Luxury desert camp experience with stargazing and bonfire nights.",
    },
  ];

  

  return (
    <div
      className="px-8 py-20 flex flex-col items-center"
      style={{
        background: "linear-gradient(to bottom right, #F5F5F5, #D5DBDB, #E5E7EB)",
        marginTop: "40px", // spacing below navbar only
        boxSizing: "border-box", // ✅ added line
         width:"1480px"
      }}
    >
      <h2
        className="text-5xl font-extrabold text-blue-800 mb-12 text-center tracking-wide drop-shadow-md"
        style={{
          boxSizing: "content-box",
        }}
      >
        Explore Our Beautiful Guest Houses
      </h2>

      <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-12 justify-items-center" style={{
        boxSizing:"border-box"
      }}>
        {guestHouses.map((house, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-80"
          >
            <img
              src={house.image}
              alt={house.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {house.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{house.desc}</p>
              <p className="text-yellow-500 font-semibold mb-2">
                {house.rating}
              </p>
              <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full font-medium transition-all duration-300">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
