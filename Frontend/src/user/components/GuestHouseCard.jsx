import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa"; // 📍 Location icon

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
      location: { city: "Pune", state: "Maharashtra" },
      underMaintenance: false,
    },
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      name: "Luxury Villa",
      desc: "Premium villa with private pool and ocean view for ultimate relaxation.",
      location: { city: "Hydrabad", state: "Telangana" },
      underMaintenance: true,
    },
    {
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      name: "Mountain Retreat",
      desc: "Peaceful getaway surrounded by fresh air and mountain views.",
      location: { city: "Banglore", state: "Karnataka" },
      underMaintenance: true,
    },
    {
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      name: "Lakeview Cottage",
      desc: "Serene lake-side cottage offering tranquility and beautiful sunsets.",
      location: { city: "Ahmedabad", state: "Gujarat" },
      underMaintenance: false,
    },
    {
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      name: "City Lights Apartment",
      desc: "Modern apartment in the heart of the city with rooftop access.",
      location: { city: "Vadodara", state: "Gujarat" },
      underMaintenance: true,
    },
    {
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      name: "Desert Mirage Camp",
      desc: "Luxury desert camp experience with stargazing and bonfire nights.",
      location: { city: "Vadodara", state: "Gujarat" },
      underMaintenance: false,
    },
  ];

  return (
    <div
      className="px-8 py-20 flex flex-col items-center w-fullbg-gradient-to-br from-[#f5f5f5] via-[#d5dbdb] to-[#e5e7eb]"
      style={{ marginTop: "40px", boxSizing: "border-box", overflowX: "hidden" , }}
    >
      <h2 className="text-5xl font-extrabold text-blue-800 mb-12 text-center tracking-wide drop-shadow-md">
        Explore Our Beautiful Guest Houses
      </h2>

      <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-12 justify-items-center">
        {guestHouses.map((house, index) => (
          <div
            key={index}
            className={`guesthouse-card relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-80 ${
              house.underMaintenance ? "maintenance" : "available"
            }`}
          >
            {/* 🖼️ Image Section */}
            <div className="relative">
              <img
                src={house.image}
                alt={house.name}
                className={`w-full h-56 object-cover transition-opacity duration-300 ${
                  house.underMaintenance ? "opacity-70" : "opacity-100"
                }`}
              />

              {/* 🚧 Maintenance Badge */}
              {house.underMaintenance && (
                <div className="absolute top-3 right-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                  Under Maintenance
                </div>
              )}
            </div>

            {/* 🏠 Guest House Info */}
            <div className="p-6 text-center">
              {/* Name */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {house.name}
              </h3>

              {/* 📍 Location */}
              <p className="flex items-center justify-center text-gray-700 font-medium mb-3">
                <FaMapMarkerAlt className="text-blue-600 mr-2" />
                {house.location.city}, {house.location.state}
              </p>

              {/* 📝 Description */}
              <p className="text-gray-600 text-sm mb-5">{house.desc}</p>

              {/* 🟦 Book Button */}
              <button
                onClick={handleClick}
                disabled={house.underMaintenance}
                className={`book-btn text-white px-5 py-2 rounded-lg w-full font-semibold transition-all duration-300 ${
                  house.underMaintenance
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {house.underMaintenance ? "Unavailable" : "Book Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function GuestHouseCard() {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate("/BookingForm");
//   };

//   const guestHouses = [
//     {
//       image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
//       name: "Cozy Guest House 1",
//       desc: "Comfortable and welcoming guest house perfect for families.",
//     },
//     {
//       image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
//       name: "Luxury Villa",
//       desc: "Premium villa with private pool and ocean view for ultimate relaxation.",
//     },
//     {
//       image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
//       name: "Mountain Retreat",
//       desc: "Peaceful getaway surrounded by fresh air and mountain views.",
//     },
//     {
//       image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
//       name: "Lakeview Cottage",
//       desc: "Serene lake-side cottage offering tranquility and beautiful sunsets.",
//     },
//     {
//       image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
//       name: "City Lights Apartment",
//       desc: "Modern apartment in the heart of the city with rooftop access.",
//     },
//     {
//       image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
//       name: "Desert Mirage Camp",
//       desc: "Luxury desert camp experience with stargazing and bonfire nights.",
//     },
//   ];

//   return (
//     <div
//       className="w-screen min-h-screen overflow-hidden"
//       style={{
//         background: "linear-gradient(to bottom right, #F5F5F5, #D5DBDB, #E5E7EB)",
//         marginTop: "40px",
//         overflowX: "hidden", // ✅ removes any side scroll
//       }}
//     >
//       <div className="px-6 py-16 max-w-7xl mx-auto">
//         <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-12 text-center tracking-wide drop-shadow-md">
//           Explore Our Beautiful Guest Houses
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
//           {guestHouses.map((house, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-80"
//             >
//               <img
//                 src={house.image}
//                 alt={house.name}
//                 className="w-full h-56 object-cover"
//               />
//               <div className="p-6 text-center">
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                   {house.name}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-3">{house.desc}</p>
//                 <button
//                   onClick={handleClick}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full font-medium transition-all duration-300"
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
