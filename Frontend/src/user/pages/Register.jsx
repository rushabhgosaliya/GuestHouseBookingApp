import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNo: data.phoneNo,
      address: { line1: data.address },
    };

    try {
      await axios.post("http://localhost:5000/api/auth/register", payload);
      toast.success("Registration successful!", { position: "top-center" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200">
      <div className="w-1/2 min-w-[300px] p-8 flex justify-center">
        <div className="w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-300 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[#4C5C68] mb-2 text-center">
            Create Your Account
          </h2>
          <p className="text-gray-500 mb-6 text-center text-base">
            Sign up to get started
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            {/* Name Fields */}
            <div className="flex flex-row gap-4 max-sm:flex-col">
              <div className="flex-1 flex flex-col">
                <label className="text-[#4C5C68] font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: "First name is required" })}
                  className="w-full px-4 py-3 border border-black rounded-xl outline-none text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                />
                {errors.firstName && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-[#4C5C68] font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: "Last name is required" })}
                  className="w-full px-4 py-3 border border-black rounded-xl outline-none text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                />
                {errors.lastName && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="flex flex-row gap-4 max-sm:flex-col">
              <div className="flex-1 flex flex-col">
                <label className="text-[#4C5C68] font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 border border-black rounded-xl outline-none text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                />
                {errors.email && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-[#4C5C68] font-medium mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  {...register("phoneNo", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                  className="w-full px-4 py-3 border border-black rounded-xl outline-none text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                />
                {errors.phoneNo && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.phoneNo.message}
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-[#4C5C68] font-medium mb-1">Address</label>
              <textarea
                placeholder="Address"
                {...register("address")}
                rows={2}
                className="w-full px-4 py-3 border border-black rounded-xl outline-none text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Password & Confirm */}
            <div className="flex flex-row gap-4 max-sm:flex-col">
              <div className="flex-1 flex flex-col">
                <label className="text-[#4C5C68] font-medium mb-1">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 chars" },
                    })}
                    className="w-full px-4 py-3 pr-10 border border-black rounded-xl outline-none text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg hover:text-blue-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-[#4C5C68] font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm your password",
                    })}
                    className="w-full px-4 py-3 pr-10 border border-black rounded-xl outline-none text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg hover:text-blue-500"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 font-semibold text-white bg-gradient-to-r from-blue-500 to-[#4C5C68] rounded-xl border-none cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-gray-500 hover:-translate-y-[1px]"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
