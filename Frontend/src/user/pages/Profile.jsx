import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-10 px-4 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-10 border-2 border-gray-300">
        {/* --- Heading --- */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 border-b pb-3">
          My Profile
        </h1>

        {/* --- Profile Content --- */}
        {isEditing ? (
          <>
            {/* ✅ Fixed height form container with scroll */}
            <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={updatedUser.firstName || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={updatedUser.lastName || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={updatedUser.phone || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Address
                </label>
                <textarea
                  name="address"
                  value={
                    typeof updatedUser.address === "object"
                      ? updatedUser.address.line1 || ""
                      : updatedUser.address || ""
                  }
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* --- Buttons Row --- */}
            <div className="flex justify-center gap-6 pt-8 border-t mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-5 text-gray-700">
              <p>
                <strong>First Name:</strong> {user.firstName || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {user.lastName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user.email || "N/A"}
              </p>
              <p>
                <strong>Mobile Number:</strong> {user.phoneNo || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {typeof user.address === "object"
                  ? user.address.line1 || "N/A"
                  : user.address || "N/A"}
              </p>
              <p>
                <strong>Account Status:</strong>{" "}
                <span className="font-semibold text-green-600">Active</span>
              </p>
            </div>

            {/* --- Buttons Row --- */}
            <div className="flex justify-center gap-6 pt-8 border-t mt-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
