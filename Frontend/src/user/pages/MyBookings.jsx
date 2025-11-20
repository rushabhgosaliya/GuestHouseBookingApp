import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Home,
  BedDouble,
  CalendarDays,
  Hash,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

import Navbar from "../../user/components/Navbar";
import { Footer } from "../components/Footer";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser._id) {
          alert("⚠️ Please log in to view your bookings.");
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/bookings/user/${storedUser._id}`
        );
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#EAF2F8] via-[#D6EAF8] to-[#AED6F1]">
          <p className="text-blue-700 text-lg font-semibold">
            Loading your bookings...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (bookings.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-blue-100">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            No Bookings Found 😕
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* ✅ Fixed Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* ✅ Centered Booking Section */}
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200 px-6 py-20">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl border border-blue-200 p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700">My Bookings</h2>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          {/* Booking List Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-blue-200 rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">
                    <ClipboardList className="inline mr-1" size={16} /> Booking ID
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    <Home className="inline mr-1" size={16} /> Guest House
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    <BedDouble className="inline mr-1" size={16} /> Room
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    <Hash className="inline mr-1" size={16} /> Bed
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    <CalendarDays className="inline mr-1" size={16} /> Check-In
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    <CalendarDays className="inline mr-1" size={16} /> Check-Out
                  </th>
                  <th className="py-3 px-4 text-center font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {bookings.map((booking, index) => (
                  <tr
                    key={booking._id || index}
                    className="hover:bg-blue-50 transition-all"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      #{booking.bookingId || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {booking.guesthouseId?.guestHouseName || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {booking.roomId?.roomNumber || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {booking.bedId?.bednumber || "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {formatDate(booking.checkIn)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {formatDate(booking.checkOut)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyBookings;
