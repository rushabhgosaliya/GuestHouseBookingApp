import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import UserDashboard from "./user/pages/UserDashboard";
import ForgotPassword from "./user/pages/ForgotPassword";
import ResetPassword from "./user/pages/ResetPassword";
import BookingForm from "./user/components/BookingForm";

export default function App() {
  return (
    <Routes>
      {/* Default route goes to login */}
      <Route path="/" element={<Login />} />              
      <Route path="/login" element={<Login />} />       
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/reset-password" element={<ResetPassword />} />  
      <Route path="/dashboard" element={<UserDashboard />} /> 
      <Route path="/bookingform" element={<BookingForm />} /> 

    </Routes>
  );
}
