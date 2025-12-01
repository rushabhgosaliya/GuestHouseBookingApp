// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import UserDashboard from "./user/pages/UserDashboard";
import ForgotPassword from "./user/pages/ForgotPassword";
import ResetPassword from "./user/pages/ResetPassword";
import BookingForm from "./user/pages/BookingForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Profile from "./user/pages/Profile";
import MyBookings from "./user/pages/MyBookings";
import LandingPage from "./user/pages/Index";

export default function App() {
  return (
    <Routes>
      Public Routes
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/index" element={<LandingPage />} />
      
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
      <Route
        path="/mybookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
       <Route
        path="/reset-password/:token"
        element={
          <ProtectedRoute>
            <ResetPassword/>
          </ProtectedRoute>
        }
      />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}
