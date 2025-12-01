import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: { "Cache-Control": "no-cache" },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.bookings || [];

      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBookings(sortedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Polling every 10 seconds
  useEffect(() => {
    fetchBookings();

    const intervalId = setInterval(() => {
      axios
        .get("http://localhost:5000/api/bookings", {
          headers: { "Cache-Control": "no-cache" },
        })
        .then((res) => {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data.bookings || [];

          const sortedData = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setBookings(sortedData);
        })
        .catch((err) => console.error("Polling error:", err));
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Status Change + Toast added
  const handleStatusChange = async (id, newStatus) => {
    try {
      const backendStatus = newStatus === "Rejected" ? "Cancelled" : newStatus;

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );

      localStorage.setItem("bookingUpdated", Date.now());

      await axios.patch(`http://localhost:5000/api/bookings/${id}`, {
        status: backendStatus,
      });

      //  INSTANT TOAST (FAST)
      toast.success(
        newStatus === "Approved"
          ? "Booking approved successfully! ✅"
          : "Booking rejected successfully! ❌",
        {
          position: "top-right",
          autoClose: 1200,
        }
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status!", {
        position: "top-right",
        autoClose: 1200,
      });
    }
  };

  if (loading)
    return (
      <div className="p-6 text-gray-600 font-medium">Loading bookings...</div>
    );

  if (error)
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Booking Management
        </h2>
      </div>

      {/* Success Message (keep same functionality) */}
      {successMessage && (
        <div className="mb-4 text-center bg-green-100 text-green-700 py-2 rounded-lg font-medium shadow-md">
          {successMessage}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#f3f4f6] text-gray-900 uppercase text-sm font-semibold tracking-wide">
            <tr>
              <th className="p-4 text-left whitespace-nowrap">Booking ID</th>
              <th className="p-4 text-left whitespace-nowrap">User</th>
              <th className="p-4 text-left whitespace-nowrap">Guest House</th>
              <th className="p-4 text-left whitespace-nowrap">Room</th>
              <th className="p-4 text-left whitespace-nowrap">Bed</th>
              <th className="p-4 text-left whitespace-nowrap">Check-In</th>
              <th className="p-4 text-left whitespace-nowrap">Check-Out</th>
              <th className="p-4 text-left whitespace-nowrap">Status</th>
              <th className="p-4 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {bookings.map((b) => (
              <tr
                key={b._id}
                className="border-t hover:bg-gray-50 transition-all duration-150"
              >
                <td className="p-4">{b.bookingId}</td>

                <td className="p-4">
                  {b.userId
                    ? `${b.userId.firstName} ${b.userId.lastName}`
                    : "N/A"}
                  <div className="text-xs text-gray-500">{b.userId?.email}</div>
                </td>

                <td className="p-4">{b.guesthouseId?.guestHouseName || "—"}</td>
                <td className="p-4">{b.roomId?.roomNumber || "—"}</td>
                <td className="p-4">{b.bedId?.bednumber || "—"}</td>

                <td className="p-4">
                  {new Date(b.checkIn).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {new Date(b.checkOut).toLocaleDateString()}
                </td>

                <td className="p-4 font-semibold">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : b.status === "Rejected" || b.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {b.status === "Cancelled" ? "Rejected" : b.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="p-4 flex gap-3 justify-center">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="px-2 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                  >
                    View
                  </button>

                  {b.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(b._id, "Approved")}
                        className="px-2 py-2 text-sm font-medium bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:shadow-lg transition-all duration-200"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleStatusChange(b._id, "Rejected")}
                        className="px-2 py-2 text-sm font-medium bg-red-600 text-white rounded-lg shadow hover:bg-red-700 hover:shadow-lg transition-all duration-200"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Booking Details
            </h3>

            <div className="space-y-2 text-gray-700">
              <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
              <p><strong>User:</strong> {selectedBooking.userId?.firstName} {selectedBooking.userId?.lastName}</p>
              <p><strong>Guest House:</strong> {selectedBooking.guesthouseId?.guestHouseName}</p>
              <p><strong>Room:</strong> {selectedBooking.roomId?.roomNumber}</p>
              <p><strong>Bed:</strong> {selectedBooking.bedId?.bednumber}</p>
              <p><strong>Check-In:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
              <p><strong>Check-Out:</strong> {new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    selectedBooking.status === "Approved"
                      ? "text-green-600"
                      : selectedBooking.status === "Rejected" ||
                        selectedBooking.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {selectedBooking.status === "Cancelled"
                    ? "Rejected"
                    : selectedBooking.status}
                </span>
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
