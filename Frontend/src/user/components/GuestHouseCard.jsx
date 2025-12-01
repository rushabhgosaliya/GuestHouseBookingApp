import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

export default function GuestHouseCard({ isLanding = false }) {
  const navigate = useNavigate();
  const [guestHouses, setGuestHouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = (id) => {
    navigate("/bookingform", { state: { guestHouseId: id } });
  };

  //  Fetch dynamic guesthouses from backend
  const fetchGuestHouses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/guesthouses");
      setGuestHouses(res.data || []);
    } catch (err) {
      console.error("Error fetching guest houses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestHouses();
  }, []);


  return (
    <div
      className={
        isLanding 
          ? "w-full flex flex-col items-center" 
          : "px-8 py-20 flex flex-col items-center w-full bg-gradient-to-br from-[#f5f5f5] via-[#d5dbdb] to-[#e5e7eb]"
      }
      style={
        isLanding 
          ? {} 
          : { marginTop: "40px", boxSizing: "border-box", overflowX: "hidden" }
      }
    >
      {/* 3. Only show this Heading if NOT on the landing page */}
      {!isLanding && (
        <h2 className="text-5xl font-extrabold text-blue-800 mb-12 text-center tracking-wide drop-shadow-md">
          Explore Our Beautiful Guest Houses
        </h2>
      )}

      {/*  Loading / Empty States */}
      {loading ? (
        <p className="text-gray-700 text-lg font-medium">Loading guest houses...</p>
      ) : guestHouses.length === 0 ? (
        <p className="text-gray-600 text-lg">No guest houses available.</p>
      ) : (
        <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-12 justify-items-center">
          {guestHouses.map((house, index) => (
            <div
              key={index}
              className={`guesthouse-card relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-80 ${
                house.underMaintenance ? "maintenance" : "available"
              }`}
            >
              {/*  Image */}
             <div className="relative">
  <img
    src={`http://localhost:5000${house.image_url}`}
    alt={house.guestHouseName}
    className={`w-full h-56 object-cover transition-opacity duration-300 ${
      house.underMaintenance ? "opacity-70" : "opacity-100"
    }`}
  />

  {house.underMaintenance && (
    <div className="absolute top-3 right-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
      Under Maintenance
    </div>
  )}
</div>


              {/*  Info Section */}
              <div className="p-6 text-center">
                {/*  Name */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {house.guestHouseName}
                </h3>

                {/*  Location */}
                <p className="flex items-center justify-center text-gray-700 font-medium mb-3">
                  <FaMapMarkerAlt className="text-blue-600 mr-2" />
                  {house.location?.city || "N/A"}, {house.location?.state || ""}
                </p>

                {/*  Description */}
                <p className="text-gray-600 text-sm mb-5">
                  {house.description?.length > 100
                    ? `${house.description.slice(0, 100)}...`
                    : house.description || "No description available."}
                </p>

                {/*  Book Button */}
                {/* <button
                  onClick={() => handleClick(house._id)}
                  disabled={house.underMaintenance}
                  className={`book-btn w-full font-semibold px-5 py-3 rounded-lg border transition-all duration-300 ${
                    house.underMaintenance
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-800 text-white border-[#4C5C68]/40 hover:translate-y-[-2px] hover:from-blue-600 hover:to-gray-500 shadow-md"
                  }`}
                >
                  {house.underMaintenance ? "Unavailable" : "Book Now"}
                </button> */}

                {/* Book Button */}
<button
  onClick={() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
    } else {
      navigate("/bookingform", { state: { guestHouseId: house._id } });
    }
  }}
  disabled={house.underMaintenance}
  className={`book-btn w-full font-semibold px-5 py-3 rounded-lg border transition-all duration-300 ${
    house.underMaintenance
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-blue-800 text-white border-[#4C5C68]/40 hover:translate-y-[-2px] hover:bg-blue-700 shadow-md"
  }`}
>
  {house.underMaintenance ? "Unavailable" : "Book Now"}
</button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
