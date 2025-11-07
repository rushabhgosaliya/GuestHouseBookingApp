// src/admin/components/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/MainBody";
import RecentBooking from "../components/RecentBooking";
import GuestHouses from "../pages/GuestHouses";
import RoomsManagement from "../pages/RoomsManagement";

const BookingManagement = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold text-gray-800">Booking Management</h2>
    <p className="text-gray-600 mt-4">Manage all guest bookings here.</p>
  </div>
);

// const GuestHouses = () => (
//   <div className="p-8">
//     <h2 className="text-2xl font-semibold text-gray-800">Guest Houses</h2>
//     <p className="text-gray-600 mt-4">Add or manage guest houses here.</p>
//   </div>
// );

// const Rooms = () => (
//   <div className="p-8">
//     <h2 className="text-2xl font-semibold text-gray-800">Room Management</h2>
//     <p className="text-gray-600 mt-4">Manage rooms and bed allocations here.</p>
//   </div>
// );

const Beds = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold text-gray-800">Bed Management</h2>
    <p className="text-gray-600 mt-4">Manage rooms and bed allocations here.</p>
  </div>
);

const Notifications = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
    <p className="text-gray-600 mt-4">View latest updates and system alerts.</p>
  </div>
);

const AuditLogs = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold text-gray-800">Audit Logs</h2>
    <p className="text-gray-600 mt-4">Track all admin activities and history.</p>
  </div>
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bookings" element={<BookingManagement />} />
      <Route path="/guesthouses" element={<GuestHouses/>} />
      <Route path="/rooms" element={<RoomsManagement/>} />
      <Route path="/beds" element={<Beds />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/recent-bookings" element={<RecentBooking />} />
    </Routes>
  );
};

export default AdminRoutes;
