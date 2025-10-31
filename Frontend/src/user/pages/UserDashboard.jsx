import React from "react";
import Navbar from "../../user/components/UserNav";
import GuestHouseCard from "../../user/components/GuestHouseCard";
import BookingForm from "../../user/components/BookingForm";

export default function UserDashboard() {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #f5f5f5, #d5dbdb, #e5e7eb)",
        minHeight: "100vh",
      }}
    >
      {/* Fixed Navbar */}
      <Navbar/>

      {/* Page Content */}
      <div style={{ paddingTop: "100px", padding: "20px" }}>
        <GuestHouseCard />

        {/* Optional Booking Form below cards */}
        {/* <div style={{ marginTop: "60px" }}>
          <BookingForm />
        </div> */}
      </div>
    </div>
  );
}
