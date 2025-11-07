import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react"; // professional icons

const RecentBooking = () => {
  const bookings = [
    { name: "John Smith", house: "Sunrise Villa", room: "Room 101", bed: "Bed A", in: "Apr 20, 2023", out: "Apr 25, 2023", status: "Pending Approval" },
    { name: "Emma Johnson", house: "Ocean View", room: "Room 205", bed: "Bed B", in: "Apr 22, 2023", out: "Apr 28, 2023", status: "Pending Approval" },
    { name: "Michael Brown", house: "Mountain Lodge", room: "Room 103", bed: "Bed C", in: "Apr 18, 2023", out: "Apr 21, 2023", status: "Approved" },
    { name: "Sarah Davis", house: "Garden House", room: "Room 301", bed: "Bed A", in: "Apr 25, 2023", out: "Apr 30, 2023", status: "Pending Approval" },
    { name: "David Wilson", house: "Lakeside Retreat", room: "Room 102", bed: "Bed D", in: "Apr 19, 2023", out: "Apr 24, 2023", status: "Rejected" },
  ];

  const renderStatus = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-green-100 to-green-50 text-green-700 border border-green-200">
            <CheckCircle size={14} /> Approved
          </span>
        );
      case "Pending Approval":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200">
            <Clock size={14} /> Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-red-100 to-red-50 text-red-700 border border-red-200">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-2">
        Recent Booking Requests
      </h2>

      {/* Table Container */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Guest Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Guest House</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Room</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Bed</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Check-in</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Check-out</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking, i) => (
              <tr
                key={i}
                className={`hover:bg-gray-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-6 py-4 font-medium text-gray-800">{booking.name}</td>
                <td className="px-6 py-4 text-gray-700">{booking.house}</td>
                <td className="px-6 py-4 text-gray-700">{booking.room}</td>
                <td className="px-6 py-4 text-gray-700">{booking.bed}</td>
                <td className="px-6 py-4 text-gray-700">{booking.in}</td>
                <td className="px-6 py-4 text-gray-700">{booking.out}</td>

                {/* Status */}
                <td className="px-6 py-4">{renderStatus(booking.status)}</td>

                {/* Action */}
                <td className="px-6 py-4">
                  {booking.status === "Pending Approval" && (
                    <div className="flex gap-2">
                      <button className=  "px-3 py-1.5 rounded-md text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition" style={
                        {
                          backgroundColor:"red"
                        }
                      }>
                        Approve
                      </button>
                      <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition">
                        Reject
                      </button>
                    </div>
                  )}
                  {booking.status === "Approved" && (
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition">
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBooking;
