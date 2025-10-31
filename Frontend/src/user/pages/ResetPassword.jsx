import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password,
      });
      setMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMsg("Error resetting password. Please try again!");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] p-4">
      <div className="bg-white w-[60%] max-w-md p-10 rounded-3xl shadow-xl flex flex-col items-center border border-[#D1D5DB]">
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
            className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#4C5C68] hover:from-[#2563EB] hover:to-[#6B7280] text-white rounded-lg font-semibold shadow-md transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
