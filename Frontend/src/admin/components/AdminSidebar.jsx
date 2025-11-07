import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdHotel,
  MdMeetingRoom,
  MdBed,
  MdNotifications,
  MdAssignment,
  MdMenu,
  MdClose,
} from "react-icons/md";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Booking Management",
      icon: <MdAssignment size={20} />,
      path: "/admin/bookings",
    },
    {
      name: "Guest Houses",
      icon: <MdHotel size={20} />,
      path: "/admin/guesthouses",
    },
    {
      name: "Room Management",
      icon: <MdMeetingRoom size={20} />,
      path: "/admin/rooms",
    },
    { name: "Bed Management", icon: <MdBed size={20} />, path: "/admin/beds" },
    {
      name: "Notifications",
      icon: <MdNotifications size={20} />,
      path: "/admin/notifications",
    },
    {
      name: "Audit Logs",
      icon: <MdAssignment size={20} />,
      path: "/admin/audit-logs",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-blue-700 text-white p-2 rounded-lg shadow-md focus:outline-none"
        >
          {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 w-auto top- left-0 h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg p-5 pt-8 duration-300 
        ${isOpen ? "w-64" : "w-20"} 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Close button (desktop hidden) */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none md:hidden"
        >
          <MdClose />
        </button>

        {/* Logo / Title */}
        <h1 style={{marginLeft:"20px"}}
          className={`text-2xl font-bold tracking-wide text-white mb-10 transition-all duration-300 ${
            !isOpen && "hidden"
          }`}
        >
          Admin Panel
        </h1>

        {/* Menu */}
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-blue-600 hover:text-white text-blue-100"
              }`}
              onClick={() => window.innerWidth < 768 && setIsOpen(false)} // Auto-close on mobile
            >
              <span>{item.icon}</span>
              <span className={`${!isOpen && "hidden"} text-sm font-medium`}>
                {item.name}
              </span>
            </Link>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div
        // className="flex-1 p-8 mt-16 md:ml-0 transition-all duration-300"
        // style={{
        //   background:
        //     "linear-gradient(to bottom right, #f5f5f5, #d5dbdb, #e5e7eb)",
        // }}
      >
        {/* <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-3xl font-semibold text-blue-800 mb-4">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-8">
            Welcome to the admin panel! Manage guest houses, bookings, and
            system operations here.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default AdminSidebar;
