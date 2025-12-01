import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Bed,
} from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  const [approvedBookings, setApprovedBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [rejectedBookings, setRejectedBookings] = useState(0);
  const [guestHouses, setGuestHouses] = useState(0);
  const [todaysBookings, setTodaysBookings] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);

  const [monthlyChart, setMonthlyChart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await fetch("http://localhost:5000/api/admin/total-users");
      setTotalUsers((await usersRes.json()).totalUsers);

      const bookingsRes = await fetch("http://localhost:5000/api/admin/total-bookings");
      setTotalBookings((await bookingsRes.json()).totalBookings);

      const approvedRes = await fetch("http://localhost:5000/api/admin/total-approved");
      setApprovedBookings((await approvedRes.json()).totalApproved);

      const pendingRes = await fetch("http://localhost:5000/api/admin/total-pending");
      setPendingBookings((await pendingRes.json()).totalPending);

      const rejectedRes = await fetch("http://localhost:5000/api/admin/total-rejected");
      setRejectedBookings((await rejectedRes.json()).totalRejected);

      const guestRes = await fetch("http://localhost:5000/api/admin/total-guesthouses");
      setGuestHouses((await guestRes.json()).totalGuestHouses);

      const todayRes = await fetch("http://localhost:5000/api/admin/total-todays-bookings");
      setTodaysBookings((await todayRes.json()).todaysBookings);

      const occRes = await fetch("http://localhost:5000/api/admin/occupancy-rate");
      setOccupancyRate((await occRes.json()).occupancyRate);

      //  Fetch chart data
      const chartRes = await fetch("http://localhost:5000/api/admin/monthly-bookings");
      setMonthlyChart((await chartRes.json()).data);

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const Card = ({ title, value, icon: Icon }) => (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
      style={{
        height: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderLeft: "4px solid #1d4ed8",
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Icon size={20} />
        </div>
      </div>

      <div className="text-3xl font-semibold text-gray-900">
        {loading ? "..." : value}
      </div>
    </div>
  );

  // Pie Chart Data
  const pieData = [
    { name: "Approved", value: approvedBookings },
    { name: "Pending", value: pendingBookings },
    { name: "Rejected", value: rejectedBookings }
  ];

  const COLORS = ["#4ade80", "#60a5fa", "#f87171"]; // professional colors

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-gray-900">Dashboard Overview</h2>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          <Card title="Total Users" value={totalUsers} icon={Users} />
          <Card title="Total Bookings" value={totalBookings} icon={BookOpen} />
          <Card title="Approved Bookings" value={approvedBookings} icon={CheckCircle} />
          <Card title="Pending Approval" value={pendingBookings} icon={Clock} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <Card title="Rejected Bookings" value={rejectedBookings} icon={XCircle} />
          <Card title="Total GuestHouses" value={guestHouses} icon={Building2} />
          <Card title="Occupancy Rate" value={`${occupancyRate}%`} icon={Building2} />
          <Card title="Today's Booking" value={todaysBookings} icon={Bed} />
        </div>

        {/*  CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-14">

          {/* LINE CHART */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Bookings Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChart}>
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Booking Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
