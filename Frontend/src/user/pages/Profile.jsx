import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Home,
  Edit3,
  ArrowLeft,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [updatedUser, setUpdatedUser] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("User not logged in");
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

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
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
        toast.success("Profile updated successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    //  VALIDATION
    if (!passwordData.oldPassword.trim()) {
      toast.warning("Old password is required");
      return;
    }
    if (!passwordData.newPassword.trim()) {
      toast.warning("New password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.warning("New password must be at least 6 characters");
      return;
    }
    if (passwordData.oldPassword === passwordData.newPassword) {
      toast.warning("New password cannot be same as old password");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/change-password/${user._id}`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }
      );

      toast.success(res.data.message || "Password changed successfully");
      setShowPasswordSection(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200 py-12 flex justify-center items-center">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-2xl p-10 border border-gray-200 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing
              ? "Edit Profile"
              : showPasswordSection
              ? "Change Password"
              : "My Profile"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing
              ? "Update your personal information below"
              : showPasswordSection
              ? "Update password securely"
              : "Your account details are displayed below"}
          </p>
        </div>

        {/* Change Password Section */}
        {showPasswordSection ? (
          <>
            <div className="space-y-6 text-gray-700 mb-6">
              {/* OLD PASSWORD */}
              <div>
                <label className="font-semibold">Old Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />

                  <input
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />

                  {/* EYE ICON */}
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <Eye size={20} /> : <EyeOff size={20} />}
                  </span>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="font-semibold">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />

                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />

                  {/* EYE ICON */}
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <Eye size={20} /> : <EyeOff size={20} />} 
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setShowPasswordSection(false)}
                className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Password
              </button>
            </div>
          </>
        ) : isEditing ? (
          <>
            {/* Normal Edit Profile Code (unchanged) */}
            {/* ONLY password section updated — rest remains same */}
            {/* -------------------------- */}
            {/* Your editing UI remains untouched */}
            {/* -------------------------- */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 mb-4">
              <div>
                <label className="font-semibold">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                  <input
                    type="text"
                    name="firstName"
                    value={updatedUser.firstName || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                  <input
                    type="text"
                    name="lastName"
                    value={updatedUser.lastName || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                  <input
                    type="email"
                    name="email"
                    value={updatedUser.email || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold">Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                  <input
                    type="tel"
                    name="phoneNo"
                    value={updatedUser.phoneNo || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold">Address</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 text-indigo-600" />
                  <textarea
                    name="address"
                    value={
                      typeof updatedUser.address === "object"
                        ? updatedUser.address.line1
                        : updatedUser.address
                    }
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 pt-4 border-t">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <>
            {/* View Profile Section – unchanged */}
            <div className="space-y-4 text-gray-700 mb-6">
              {[
                {
                  icon: <User className="text-indigo-600" />,
                  label: "First Name",
                  value: user.firstName,
                },
                {
                  icon: <User className="text-indigo-600" />,
                  label: "Last Name",
                  value: user.lastName,
                },
                {
                  icon: <Mail className="text-indigo-600" />,
                  label: "Email",
                  value: user.email,
                },
                {
                  icon: <Phone className="text-indigo-600" />,
                  label: "Mobile",
                  value: user.phoneNo,
                },
                {
                  icon: <Home className="text-indigo-600" />,
                  label: "Address",
                  value:
                    typeof user.address === "object"
                      ? user.address.line1
                      : user.address,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-200 bg-gray-50 rounded-lg px-5 py-3 flex items-center gap-3 shadow-sm"
                >
                  {item.icon}
                  <p className="font-semibold">
                    {item.label}:{" "}
                    <span className="font-medium text-gray-900">
                      {item.value}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 border-t pt-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                <ArrowLeft /> Back
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit3 /> Edit Profile
              </button>

              <button
                onClick={() => setShowPasswordSection(true)}
                className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
              >
                <Lock /> Change Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
