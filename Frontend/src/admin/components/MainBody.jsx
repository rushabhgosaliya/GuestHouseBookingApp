// // import React, { useState } from 'react';
// // import { TrendingUp, TrendingDown, Home, Bed, Calendar, Users, Mail, ClipboardList, Search, Bell } from 'lucide-react';

// // const Dashboard = () => {
// //   const [selectedDate] = useState('Apr 17, 2023');

// //   return (
// //     <div className="min-h-screen bg-gray-50">

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-6 py-8">
// //         {/* Overview Title */}
// //         <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>

// //         {/* Stats Grid */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           {/* Total Guest Houses */}
// //           <div className="bg-white rounded-lg p-6 border border-gray-200">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-sm text-gray-600">Total Guest Houses</h3>
// //               <span className="text-sm font-medium text-green-600">+12%</span>
// //             </div>
// //             <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
// //             <p className="text-xs text-gray-500 mb-4">Active properties</p>
// //             <div className="h-16 flex items-end gap-1">
// //               {[40, 50, 45, 60, 55, 70, 65, 80, 75, 85, 90, 95, 88, 92, 98, 100].map((h, i) => (
// //                 <div key={i} className="flex-1 bg-green-100 rounded-t" style={{height: `${h}%`}}></div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Pending Approvals */}
// //           <div className="bg-white rounded-lg p-6 border border-gray-200">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-sm text-gray-600">Pending Approvals</h3>
// //               <span className="text-sm font-medium text-red-600">+18</span>
// //             </div>
// //             <div className="text-3xl font-bold text-gray-900 mb-2">42</div>
// //             <p className="text-xs text-gray-500 mb-4">Awaiting review</p>
// //             <div className="h-16 flex items-end gap-1">
// //               {[60, 65, 62, 70, 68, 75, 72, 78, 76, 82, 80, 85, 83, 88, 86, 90].map((h, i) => (
// //                 <div key={i} className="flex-1 bg-red-100 rounded-t" style={{height: `${h}%`}}></div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Total Bookings */}
// //           <div className="bg-white rounded-lg p-6 border border-gray-200">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-sm text-gray-600">Total Bookings</h3>
// //               <span className="text-sm font-medium text-blue-600">+25%</span>
// //             </div>
// //             <div className="text-3xl font-bold text-gray-900 mb-2">1,248</div>
// //             <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
// //             <div className="h-16 flex items-end gap-1">
// //               {[50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88].map((h, i) => (
// //                 <div key={i} className="flex-1 bg-blue-100 rounded-t" style={{height: `${h}%`}}></div>
// //               ))}
// //             </div>
// //           </div>

// //             <div className="bg-white rounded-lg p-6 border border-gray-200">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-sm text-gray-600">Total Bookings</h3>
// //               <span className="text-sm font-medium text-blue-600">+25%</span>
// //             </div>
// //             <div className="text-3xl font-bold text-gray-900 mb-2">1,248</div>
// //             <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
// //             <div className="h-16 flex items-end gap-1">
// //               {[50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88].map((h, i) => (
// //                 <div key={i} className="flex-1 bg-blue-100 rounded-t" style={{height: `${h}%`}}></div>
// //               ))}
// //             </div>
// //           </div>

// //             <div className="bg-white rounded-lg p-6 border border-gray-200">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-sm text-gray-600">Total Bookings</h3>
// //               <span className="text-sm font-medium text-blue-600">+25%</span>
// //             </div>
// //             <div className="text-3xl font-bold text-gray-900 mb-2">1,248</div>
// //             <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
// //             <div className="h-16 flex items-end gap-1">
// //               {[50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88].map((h, i) => (
// //                 <div key={i} className="flex-1 bg-blue-100 rounded-t" style={{height: `${h}%`}}></div>
// //               ))}
// //             </div>
// //           </div>

// //             <div className="bg-white rounded-lg p-6 border border-gray-200">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-sm text-gray-600">Total Bookings</h3>
// //               <span className="text-sm font-medium text-blue-600">+25%</span>
// //             </div>
// //             <div className="text-3xl font-bold text-gray-900 mb-2">1,248</div>
// //             <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
// //             <div className="h-16 flex items-end gap-1">
// //               {[50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88].map((h, i) => (
// //                 <div key={i} className="flex-1 bg-blue-100 rounded-t" style={{height: `${h}%`}}></div>
// //               ))}
// //             </div>
// //           </div>

// //             <div className="bg-white rounded-lg p-6 border border-gray-200">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-sm text-gray-600">Total Bookings</h3>
// //               <span className="text-sm font-medium text-blue-600">+25%</span>
// //             </div>
// //             <div className="text-3xl font-bold text-gray-900 mb-2">1,248</div>
// //             <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
// //             <div className="h-16 flex items-end gap-1">
// //               {[50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88].map((h, i) => (
// //                 <div key={i} className="flex-1 bg-blue-100 rounded-t" style={{height: `${h}%`}}></div>
// //               ))}
// //             </div>
// //           </div>

// //           </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Home,
  Bed,
  Calendar,
  Users,
  Mail,
  ClipboardList,
  Search,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0); // 👈 new state
  const [loading, setLoading] = useState(true);

  // 👇 fetch total users from backend
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/total-users");
        const data = await res.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 tracking-wide">
          Dashboard Overview
        </h2>

        {/* ✅ Only this card fetches dynamic data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-green-100 shadow-lg shadow-green-100/50 hover:shadow-2xl hover:shadow-green-200/60 hover:-translate-y-2 hover:border-green-200 transition-all duration-300"
            style={{ height: "200px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>

            {/* 👇 Dynamic number instead of hard-coded 24 */}
            <div className="text-4xl font-bold text-gray-800 mb-1">
              {loading ? "..." : totalUsers}
            </div>

            <p className="text-xs text-gray-500 mb-4">Registered Users</p>
            <div className="h-10 flex items-end gap-1">
              {[40, 50, 45, 60, 55, 70, 65, 80, 75, 85, 90, 95, 88, 92, 98, 100].map((h, i) => (
                <div key={i}
                  className="flex-1 bg-green-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* ✅ Leave all other cards unchanged */}
          {/* Total Bookings, Approved Bookings, etc... */}


          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl p-6 border-2 border-red-100 shadow-lg shadow-red-100/50 hover:shadow-2xl hover:shadow-red-200/60 hover:-translate-y-2 hover:border-red-200 transition-all duration-300"style={{height:"200px"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
               Total Bookings
              </h3>
              <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                +18
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">42</div>
            <p className="text-xs text-gray-500 mb-4">Awaiting review</p>
            <div className="h-10 flex items-end gap-1">
              {[
                60, 65, 62, 70, 68, 75, 72, 78, 76, 82, 80, 85, 83, 88, 86, 90,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-red-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Total Bookings (1) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/60 hover:-translate-y-2 hover:border-blue-200 transition-all duration-300"style={{height:"200px"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
               Approved Bookings
              </h3>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +25%
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">1,248</div>
            <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
            <div className="h-10 flex items-end gap-1">
              {[
                50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Total Bookings (2) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-yellow-100 shadow-lg shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/60 hover:-translate-y-2 hover:border-yellow-200 transition-all duration-300"style={{height:"200px"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Pending Approval
              </h3>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +25%
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">1,248</div>
            <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
            <div className="h-10 flex items-end gap-1">
              {[
                50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" style={{marginTop:"30px"}}>
          {/* Total Guest Houses */}
          <div className="bg-white rounded-2xl p-6 border-2 border-green-100 shadow-lg shadow-green-100/50 hover:shadow-2xl hover:shadow-green-200/60 hover:-translate-y-2 hover:border-green-200 transition-all duration-300"  style={{height:"200px"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
            Rejected Bookings
              </h3>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">24</div>
            <p className="text-xs text-gray-500 mb-4">Active properties</p>
            <div className="h-10 flex items-end gap-1">
              {[
                40, 50, 45, 60, 55, 70, 65, 80, 75, 85, 90, 95, 88, 92, 98, 100,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-green-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl p-6 border-2 border-red-100 shadow-lg shadow-red-100/50 hover:shadow-2xl hover:shadow-red-200/60 hover:-translate-y-2 hover:border-red-200 transition-all duration-300"style={{height:"200px"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
              Active GuestHouse
              </h3>
              <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                +18
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">42</div>
            <p className="text-xs text-gray-500 mb-4">Awaiting review</p>
            <div className="h-10 flex items-end gap-1">
              {[
                60, 65, 62, 70, 68, 75, 72, 78, 76, 82, 80, 85, 83, 88, 86, 90,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-red-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Total Bookings (1) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/60 hover:-translate-y-2 hover:border-blue-200 transition-all duration-300"style={{height:"200px"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Rooms
              </h3>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +25%
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">1,248</div>
            <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
            <div className="h-10 flex items-end gap-1">
              {[
                50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Total Bookings (2) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-yellow-100 shadow-lg shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/60 hover:-translate-y-2 hover:border-yellow-200 transition-all duration-300"style={{height:"200px"}}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
             Occupied Rooms
              </h3>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +25%
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-1">1,248</div>
            <p className="text-xs text-gray-500 mb-4">Last 30 days</p>
            <div className="h-10 flex items-end gap-1">
              {[
                50, 52, 55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 88,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-100 rounded-t"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
