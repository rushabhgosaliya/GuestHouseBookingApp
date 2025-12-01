import React, { useEffect } from "react";
import UserNav from "../../user/components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import AdminRoutes from "../routes/AdminRoutes";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {

  useEffect(() => {
    toast.success("Admin Login Successful!", {
      position: "top-right",
      autoClose: 2500,
      pauseOnHover: false,
      theme: "colored",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#d5dbdb] to-[#e5e7eb] overflow-hidden">

      {/* Toast container */}
      <ToastContainer />

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <UserNav />
      </div>

      {/* Sidebar + Main Section */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 fixed top-[64px] left-0 bottom-0 bg-white shadow-md z-40">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-64 overflow-y-auto mt-[64px]">
          <div className="bg-white shadow-md rounded-xl border border-gray-200 ">
            <AdminRoutes /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
