// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import UserDashboard from "./user/pages/UserDashboard";
import ForgotPassword from "./user/pages/ForgotPassword";
import ResetPassword from "./user/pages/ResetPassword";
import BookingForm from "./user/components/BookingForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Index from "./user/pages/Index";
import Profile from "./user/pages/Profile";


export default function App() {
  return (
    <Routes>
      Public Routes
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/Home" element={<Index />} />
      <Route path="/profile" element={<Profile />} />

      


      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookingform"
        element={
          <ProtectedRoute>
            <BookingForm />
          </ProtectedRoute>
        }
      />

    
     <Route path="/admin/*" element={<AdminDashboard />} />


    </Routes>
  );
}
