import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Home, Edit3, ArrowLeft } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("User not logged in");
      navigate("/login");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setUpdatedUser(userData);
  }, [navigate]);

  const handleInputChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/user/${user._id}`,
        updatedUser
      );

      if (response.data && response.data.user) {
        const updatedData = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedData));
        setUser(updatedData);
        setIsEditing(false);
        alert("Profile updated successfully");
        navigate("/dashboard");
      } else {
        console.error("Invalid response structure:", response.data);
        throw new Error("Unexpected response format from server");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200 py-12 flex justify-center items-center">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-2xl p-10 border border-gray-200 relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] overflow-hidden">
        {/* --- Header --- */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing
              ? "Update your personal information below"
              : "Your account details are displayed below"}
          </p>
        </div>

        {/* --- Profile Content --- */}
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 mb-4">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 mb-1 font-semibold">
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <input
                    type="text"
                    name="firstName"
                    value={updatedUser.firstName || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 mb-1 font-semibold">
                  Last Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={updatedUser.lastName || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 mb-1 font-semibold">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 mb-1 font-semibold">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phoneNo"
                    value={updatedUser.phoneNo || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 mb-1 font-semibold">
                  Address
                </label>
                <div className="relative">
                  <Home
                    className="absolute left-3 top-3 text-indigo-500"
                    size={18}
                  />
                  <textarea
                    name="address"
                    value={
                      typeof updatedUser.address === "object"
                        ? updatedUser.address.line1 || ""
                        : updatedUser.address || ""
                    }
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* --- Buttons --- */}
            <div className="flex justify-center gap-6 pt-4 border-t mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <>
            {/* --- Professional inline “Label: Value” style layout --- */}
            <div className="space-y-4 text-gray-800 text-base mb-8 leading-relaxed">
              {[
                {
                  icon: <User className="text-indigo-600" size={18} />,
                  label: "First Name",
                  value: user.firstName || "N/A",
                },
                {
                  icon: <User className="text-indigo-600" size={18} />,
                  label: "Last Name",
                  value: user.lastName || "N/A",
                },
                {
                  icon: <Mail className="text-indigo-600" size={18} />,
                  label: "Email",
                  value: user.email || "N/A",
                },
                {
                  icon: <Phone className="text-indigo-600" size={18} />,
                  label: "Mobile",
                  value: user.phoneNo || "N/A",
                },
                {
                  icon: <Home className="text-indigo-600" size={18} />,
                  label: "Address",
                  value:
                    typeof user.address === "object"
                      ? user.address.line1 || "N/A"
                      : user.address || "N/A",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 bg-gray-50 rounded-lg px-5 py-3 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
                >
                  {item.icon}
                  <p className="text-gray-700 font-semibold">
                    {item.label}:{" "}
                    <span className="text-gray-900 font-medium">
                      {item.value}
                    </span>
                  </p>
                </div>
              ))}

              {/* ✅ Account Status */}
              <div className="text-center border border-green-200 bg-green-50 rounded-lg py-3 mt-6 font-semibold text-green-700 shadow-sm">
                ✅ Account Status: Active
              </div>
            </div>

            {/* --- Buttons --- */}
            <div className="flex justify-center gap-6 border-t pt-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
