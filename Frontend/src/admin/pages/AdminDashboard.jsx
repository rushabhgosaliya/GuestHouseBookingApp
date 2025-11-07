// import React from "react";
// import UserNav from "../../user/components/UserNav";
// import AdminSidebar from "../components/AdminSidebar";
// import Dashboard from "../components/MainBody";

// const AdminDashboard = () => {
//   return (
//     <div className="h-screen bg-gradient-to-br from-[#f5f5f5] via-[#d5dbdb] to-[#e5e7eb] overflow-hidden">
//       {/* Fixed Navbar */}
//       <div className="fixed top-0 left-0 right-0 z-50">
//         <UserNav />
//       </div>

//       {/* Sidebar + Main Content */}
//       <div className="flex pt-16 h-full">
//         {/* Sidebar */}
//         <div className="w-64 fixed top-20 left-0 bottom-0 bg-white shadow-md z-40 h-[calc(100vh-4rem)] overflow-hidden">
//           <AdminSidebar />
//         </div>

//         {/* Main Body */}
//         <div className="flex-1  ml-64 p-6 h-[calc(100vh-4rem)] overflow-hidden">
//           <Dashboard />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React from "react";
// import UserNav from "../../user/components/UserNav";
// import AdminSidebar from "../components/AdminSidebar";
// import Dashboard from "../components/MainBody";
// import RecentBooking from "../components/RecentBooking";

// const AdminDashboard = () => {
//   return (
//     <div className="h-screen bg-linear-to-br from-[#f5f5f5] via-[#d5dbdb] to-[#e5e7eb] overflow-hidden">
//       {/* Fixed Navbar */}
//       <div className="fixed top-0 left-0 right-0 z-50">
//         <UserNav />
//       </div>

//       {/* Sidebar + Main Content */}
//       <div className="flex pt-16 h-[calc(100vh-4rem)]">
//         {/* Sidebar */}
//         <div className="w-64 fixed top-16 left-0 bottom-0 bg-white shadow-md z-40 h-[calc(100vh-4rem)] overflow-hidden">
//           <AdminSidebar />
//         </div>

//         {/* Main Body */}
//         <div className="flex-1 ml-64 h-[calc(100vh-4rem)] overflow-hidden">
//           <div className="w-full h-full">
//             <Dashboard />
//               <RecentBooking/>
//           </div>
//         </div>
//       </div>
//     </div>

  
//   );
// };

// export default AdminDashboard;

// import React from "react";
// import UserNav from "../../user/components/Navbar";
// import AdminSidebar from "../components/AdminSidebar";
// import Dashboard from "../components/MainBody";
// import RecentBooking from "../components/RecentBooking";

// const AdminDashboard = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#d5dbdb] to-[#e5e7eb] overflow-hidden">
//       {/* 🔹 Fixed Navbar */}
//       <div className="fixed top-0 left-0 right-0 z-50">
//         <UserNav />
//       </div>

//       {/* 🔹 Sidebar + Main Section */}
//       <div className="flex min-h-screen">
//         {/* Sidebar */}
//         <div className="w-64 fixed top-[64px] left-0 bottom-0 bg-white shadow-md z-40">
//           <AdminSidebar />
//         </div>

//         {/* Main Section */}
//         <div className="flex-1 ml-64 overflow-y-auto mt-[64px]">
//           {/* Main Dashboard Body */}
//           <div className="bg-white shadow-md rounded-none border-b border-gray-200">
//             <Dashboard />
//           </div>

//           {/* Recent Bookings Section */}
//           <div className="bg-white shadow-md rounded-none border-t border-gray-200">
//             <RecentBooking />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React from "react";
import UserNav from "../../user/components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import AdminRoutes from "../routes/AdminRoutes";
// import AdminRoutes from "../routes/AdminRoutes"; // ✅ new import

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#d5dbdb] to-[#e5e7eb] overflow-hidden">
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
            <AdminRoutes/> {/* ✅ This changes dynamically when sidebar links are clicked */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

