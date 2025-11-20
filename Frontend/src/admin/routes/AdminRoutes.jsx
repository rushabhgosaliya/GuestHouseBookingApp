// src/admin/components/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/MainBody";
import RecentBooking from "../components/RecentBooking";
import GuestHouses from "../pages/GuestHouses";
import RoomsManagement from "../pages/RoomsManagement";
import BedManagement from "../pages/BedManagement"
import UserManagement from "../pages/UserManagement";
import BookingManagement from "../pages/BookingManagement";
import AuditLogPage from "../pages/AuditLogPage";



// const BookingManagement = () => (
//   <div className="p-8">
//     <h2 className="text-2xl font-semibold text-gray-800">Booking Management</h2>
//     <p className="text-gray-600 mt-4">Manage all guest bookings here.</p>
//   </div>
// );

// const UserManagement = () => (
//   <div className="p-8">
//     <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
//     <p className="text-gray-600 mt-4">Manage all registered users here.</p>
//   </div>
// );

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

// const Beds = () => (
//   <div className="p-8">
//     <h2 className="text-2xl font-semibold text-gray-800">Bed Management</h2>
//     <p className="text-gray-600 mt-4">Manage rooms and bed allocations here.</p>
//   </div>
// );

// const Notifications = () => (
//   <div className="p-8">
//     <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
//     <p className="text-gray-600 mt-4">View latest updates and system alerts.</p>
//   </div>
// );

// const AuditLogs = () => (
//   <div className="p-8">
//     <h2 className="text-2xl font-semibold text-gray-800">Audit Logs</h2>
//     <p className="text-gray-600 mt-4">Track all admin activities and history.</p>
//   </div>
// );

const AdminRoutes = () => {
  return (
    <Routes>z
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bookings" element={<BookingManagement/>} />
      <Route path="/users" element={<UserManagement/>} />
      <Route path="/guesthouses" element={<GuestHouses/>} />
      <Route path="/rooms" element={<RoomsManagement/>} />
      <Route path="/beds" element={<BedManagement />} />
      {/* <Route path="/notifications" element={<Notifications />} /> */}
      <Route path="/audit-logs" element={<AuditLogPage/>} />
      <Route path="/recent-bookings" element={<RecentBooking />} />
    </Routes>
  );
};

export default AdminRoutes;
