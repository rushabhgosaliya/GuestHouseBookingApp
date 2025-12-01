import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import LandingNavbar from "../components/LandingNavbar ";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!", { position: "top-center" });

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!", {
        position: "top-center",
      });
    }
  };

  return (
    // Prevent horizontal scrolling site-wide for this page
    <div className="overflow-x-hidden">
    <LandingNavbar/>

      {/* Page container: column so footer stays at bottom */}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200">
        {/* Center area grows to fill available space */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-lg border border-gray-300 transition-transform duration-300 hover:scale-[1.02] mt-20">
            <h2 className="text-2xl font-bold text-[#4C5C68] text-center mb-2">
              Sign In
            </h2>
            <p className="text-center text-gray-500 mb-8">Welcome back, please login</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-[#4C5C68]">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  className={`px-4 py-3 border border-gray-300 shadow-sm rounded-lg outline-none text-gray-800 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.25)]"
                      : "border-black focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.25)]"
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col relative">
                <label className="mb-1 font-medium text-[#4C5C68]">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className={`px-4 py-3 border border-gray-300 shadow-sm rounded-lg outline-none text-gray-800 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.25)]"
                      : "border-black focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.25)]"
                  }`}
                />
                <span
                  className="absolute right-4 inset-y-0 flex items-center text-gray-500 cursor-pointer text-lg hover:text-blue-500"
                  style={{ marginTop: "30px" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>

                {errors.password && (
                  <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-blue-800 font-medium text-sm hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button (kept same behavior/class) */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-gray-500 mt-6 text-sm">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-800 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </main>

        <Footer />
      </div>

      <ToastContainer autoClose={2000} hideProgressBar={false} />
    </div>
  );
}
