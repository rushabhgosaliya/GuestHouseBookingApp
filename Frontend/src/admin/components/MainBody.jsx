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

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  const [approvedBookings, setApprovedBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [rejectedBookings, setRejectedBookings] = useState(0);
  const [guestHouses, setGuestHouses] = useState(0);
  const [todaysBookings, setTodaysBookings] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0); // ⭐ NEW

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await fetch(
        "http://localhost:5000/api/admin/total-users"
      );
      setTotalUsers((await usersRes.json()).totalUsers);

      const bookingsRes = await fetch(
        "http://localhost:5000/api/admin/total-bookings"
      );
      setTotalBookings((await bookingsRes.json()).totalBookings);

      const approvedRes = await fetch(
        "http://localhost:5000/api/admin/total-approved"
      );
      setApprovedBookings((await approvedRes.json()).totalApproved);

      const pendingRes = await fetch(
        "http://localhost:5000/api/admin/total-pending"
      );
      setPendingBookings((await pendingRes.json()).totalPending);

      const rejectedRes = await fetch(
        "http://localhost:5000/api/admin/total-rejected"
      );
      setRejectedBookings((await rejectedRes.json()).totalRejected);

      const guestRes = await fetch(
        "http://localhost:5000/api/admin/total-guesthouses"
      );
      setGuestHouses((await guestRes.json()).totalGuestHouses);

      const todayRes = await fetch(
        "http://localhost:5000/api/admin/total-todays-bookings"
      );
      setTodaysBookings((await todayRes.json()).todaysBookings);

      // ⭐ NEW — Fetch occupancy rate
      const occRes = await fetch(
        "http://localhost:5000/api/admin/occupancy-rate"
      );
      setOccupancyRate((await occRes.json()).occupancyRate);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener("dashboardRefresh", handleRefresh);
    return () => window.removeEventListener("dashboardRefresh", handleRefresh);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-gray-900">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          <Card title="Total Users" value={totalUsers} icon={Users} />
          <Card title="Total Bookings" value={totalBookings} icon={BookOpen} />
          <Card
            title="Approved Bookings"
            value={approvedBookings}
            icon={CheckCircle}
          />
          <Card title="Pending Approval" value={pendingBookings} icon={Clock} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <Card
            title="Rejected Bookings"
            value={rejectedBookings}
            icon={XCircle}
          />
          <Card
            title="Total GuestHouses"
            value={guestHouses}
            icon={Building2}
          />

          {/* ⭐ Now Dynamic */}
          <Card
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            icon={Building2}
          />

          <Card title="Today's Booking" value={todaysBookings} icon={Bed} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
