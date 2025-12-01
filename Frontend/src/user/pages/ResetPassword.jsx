import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LandingNavbar from "../components/LandingNavbar ";
import Footer from "../components/Footer";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password,
      });

      if (res.data) {
        //  Toast on success (same style as login/register)
        toast.success("Password reset successful!", {
          position: "top-center",
          autoClose: 2500,
          pauseOnHover: false,
          theme: "colored",
        });

        setMsg("Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      //  Toast on error (same design)
      toast.error("Error resetting password. Please try again!", {
        position: "top-center",
        autoClose: 2500,
        pauseOnHover: false,
        theme: "colored",
      });

      setMsg("Error resetting password. Please try again!");
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer />

      {/* Navbar */}
      <LandingNavbar />

      {/* Main Section */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] px-4">
        <div className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-xl border border-[#D1D5DB]">

          <h2 className="text-3xl sm:text-4xl font-bold text-[#4C5C68] mb-4 text-center">
            Reset Password
          </h2>

          {msg && <p className="text-green-600 text-center mb-4">{msg}</p>}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-black rounded-lg outline-none text-[#1F2937] border-[#D1D5DB]/40 focus:ring-2 focus:ring-[#3B82F6]"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
