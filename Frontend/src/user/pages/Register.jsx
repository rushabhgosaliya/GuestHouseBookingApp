import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../../assets/styles/Register.css"; // you can keep or change to Register.css
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
      toast.success("🎉 Registration successful!", { position: "top-center" });
      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2>Create Your Account</h2>
          <p>Sign up to get started</p>

          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            {/* Name Fields */}
            <div className="flex flex-row">
              <div className="flex-1">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && (
                  <span className="text-red">{errors.firstName.message}</span>
                )}
              </div>

              <div className="flex-1">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && (
                  <span className="text-red">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="flex flex-row">
              <div className="flex-1">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <span className="text-red">{errors.email.message}</span>
                )}
              </div>

              <div className="flex-1">
                <label>Phone</label>
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
                />
                {errors.phoneNo && (
                  <span className="text-red">{errors.phoneNo.message}</span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label>Address</label>
              <textarea placeholder="Address" {...register("address")} rows={2} />
            </div>

            {/* Password & Confirm */}
            <div className="flex flex-row">
              <div className="flex-1">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 chars" },
                    })}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <span className="text-red">{errors.password.message}</span>
                )}
              </div>

              <div className="flex-1">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm your password",
                    })}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <button type="submit">Register</button>
          </form>

          <p className="register-login">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
