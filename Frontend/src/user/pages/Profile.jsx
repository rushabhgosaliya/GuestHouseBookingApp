// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { User, Mail, Phone, Home, Edit3, ArrowLeft } from "lucide-react";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [updatedUser, setUpdatedUser] = useState({});

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) {
//       alert("User not logged in");
//       navigate("/login");
//       return;
//     }
//     const userData = JSON.parse(storedUser);
//     setUser(userData);
//     setUpdatedUser(userData);
//   }, [navigate]);

//   const handleInputChange = (e) => {
//     setUpdatedUser({
//       ...updatedUser,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/user/${user._id}`,
//         updatedUser
//       );

//       if (response.data && response.data.user) {
//         const updatedData = response.data.user;
//         localStorage.setItem("user", JSON.stringify(updatedData));
//         setUser(updatedData);
//         setIsEditing(false);
//         alert("Profile updated successfully");
//         navigate("/dashboard");
//       } else {
//         console.error("Invalid response structure:", response.data);
//         throw new Error("Unexpected response format from server");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert(
//         error.response?.data?.message ||
//           "Failed to update profile. Please try again."
//       );
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200 py-12 flex justify-center items-center">
//       <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-2xl p-10 border border-gray-200 relative transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] overflow-hidden">
//         {/* --- Header --- */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">
//             {isEditing ? "Edit Profile" : "My Profile"}
//           </h1>
//           <p className="text-gray-500 mt-1">
//             {isEditing
//               ? "Update your personal information below"
//               : "Your account details are displayed below"}
//           </p>
//         </div>

//         {/* --- Profile Content --- */}
//         {isEditing ? (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 mb-4">
//               {/* First Name */}
//               <div>
//                 <label className="block text-gray-700 mb-1 font-semibold">
//                   First Name
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={updatedUser.firstName || ""}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Last Name */}
//               <div>
//                 <label className="block text-gray-700 mb-1 font-semibold">
//                   Last Name
//                 </label>
//                 <div className="relative">
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={updatedUser.lastName || ""}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="sm:col-span-2">
//                 <label className="block text-gray-700 mb-1 font-semibold">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     name="email"
//                     value={updatedUser.email || ""}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Mobile Number */}
//               <div className="sm:col-span-2">
//                 <label className="block text-gray-700 mb-1 font-semibold">
//                   Mobile Number
//                 </label>
//                 <div className="relative">
//                   <Phone
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
//                     size={18}
//                   />
//                   <input
//                     type="tel"
//                     name="phoneNo"
//                     value={updatedUser.phoneNo || ""}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Address */}
//               <div className="sm:col-span-2">
//                 <label className="block text-gray-700 mb-1 font-semibold">
//                   Address
//                 </label>
//                 <div className="relative">
//                   <Home
//                     className="absolute left-3 top-3 text-indigo-500"
//                     size={18}
//                   />
//                   <textarea
//                     name="address"
//                     value={
//                       typeof updatedUser.address === "object"
//                         ? updatedUser.address.line1 || ""
//                         : updatedUser.address || ""
//                     }
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
//                     rows="3"
//                   ></textarea>
//                 </div>
//               </div>
//             </div>

//             {/* --- Buttons --- */}
//             <div className="flex justify-center gap-6 pt-4 border-t mt-2">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="px-4 py-2 flex bg-blue-800 text-white rounded-lg font-semibold shadow-md 
// hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* --- Professional inline “Label: Value” style layout --- */}
//             <div className="space-y-4 text-gray-800 text-base mb-8 leading-relaxed">
//               {[
//                 {
//                   icon: <User className="text-indigo-600" size={18} />,
//                   label: "First Name",
//                   value: user.firstName || "N/A",
//                 },
//                 {
//                   icon: <User className="text-indigo-600" size={18} />,
//                   label: "Last Name",
//                   value: user.lastName || "N/A",
//                 },
//                 {
//                   icon: <Mail className="text-indigo-600" size={18} />,
//                   label: "Email",
//                   value: user.email || "N/A",
//                 },
//                 {
//                   icon: <Phone className="text-indigo-600" size={18} />,
//                   label: "Mobile",
//                   value: user.phoneNo || "N/A",
//                 },
//                 {
//                   icon: <Home className="text-indigo-600" size={18} />,
//                   label: "Address",
//                   value:
//                     typeof user.address === "object"
//                       ? user.address.line1 || "N/A"
//                       : user.address || "N/A",
//                 },
//               ].map((item, index) => (
//                 <div
//                   key={index}
//                   className="border border-gray-200 bg-gray-50 rounded-lg px-5 py-3 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
//                 >
//                   {item.icon}
//                   <p className="text-gray-700 font-semibold">
//                     {item.label}:{" "}
//                     <span className="text-gray-900 font-medium">
//                       {item.value}
//                     </span>
//                   </p>
//                 </div>
//               ))}

//               {/* ✅ Account Status */}
//               <div className="text-center border border-green-200 bg-green-50 rounded-lg py-3 mt-6 font-semibold text-green-700 shadow-sm">
//                 ✅ Account Status: Active
//               </div>
//             </div>

//             {/* --- Buttons --- */}
//             <div className="flex justify-center gap-6 border-t pt-6">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all"
//               >
//                 <ArrowLeft size={18} /> Back
//               </button>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-4 py-2 flex bg-blue-800 text-white rounded-lg font-semibold shadow-md 
//               hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
//               >
//                 <Edit3 size={18} /> Edit Profile
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

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
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [updatedUser, setUpdatedUser] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

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
        alert("Profile updated successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      alert("Please enter both fields");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/change-password/${user._id}`,
        passwordData
      );

      alert(res.data.message || "Password changed successfully");
      setShowPasswordSection(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200 py-12 flex justify-center items-center">
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
              <div>
                <label className="font-semibold">Old Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
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
            {/* Edit Profile Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 mb-4">

              {/* First Name */}
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

              {/* Last Name */}
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

              {/* Email */}
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

              {/* Phone */}
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

              {/* Address */}
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

            {/* Buttons */}
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
            {/* View Profile */}
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
