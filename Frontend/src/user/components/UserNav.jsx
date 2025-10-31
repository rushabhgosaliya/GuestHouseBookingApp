// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { MdOutlineHome, MdOutlineInfo } from "react-icons/md";
// import { FiBookOpen } from "react-icons/fi";
// const UserNav = () => {
//   const [userName, setUserName] = useState("User");

//   // helper to extract a friendly name from stored user object/string
//   const extractName = (raw) => {
//     if (!raw) return "User";

//     // if it's already a string (e.g. "Joy")
//     if (typeof raw === "string") {
//       // try parse JSON first (in case it's a JSON string)
//       try {
//         const parsed = JSON.parse(raw);
//         raw = parsed;
//       } catch {
//         return raw; // plain string name
//       }
//     }

//     // now raw should be an object
//     if (typeof raw === "object") {
//       // common fields to try
//       const candidates = [
//         raw.name,
//         raw.fullName,
//         raw.full_name,
//         raw.username,
//         raw.userName,
//         raw.firstName,
//         raw.first_name,
//         raw.email, // fallback: show email if no name
//       ];
//       for (const c of candidates) {
//         if (c && typeof c === "string" && c.trim().length) return c.trim();
//       }
//     }

//     return "User";
//   };

//   const loadUserFromStorage = () => {
//     const storedUser = localStorage.getItem("user");
//     const name = extractName(storedUser);
//     setUserName(name);
//   };

//   useEffect(() => {
//     loadUserFromStorage();

//     // listen to changes in localStorage from other tabs/windows
//     const onStorage = (e) => {
//       if (e.key === "user") loadUserFromStorage();
//     };
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token"); // if you store token
//     setUserName("User");
//     // navigate to login (use router navigation if you prefer)
//     window.location.href = "/login";
//   };

//   const navItems = [
//     { name: "View-Guest-houses", icon: MdOutlineHome, link: "/guesthouses"},
//     { name: "My Bookings", icon: FiBookOpen, link: "/bookings" },
//     { name: "Info", icon: MdOutlineInfo, link: "/info" },
//   ];

//   return (
//     <nav className="w-screen fixed top-0 left-0 bg-white text-gray-800 shadow-md z-50">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <div className="flex items-center space-x-3">
//             <div
//               className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 shadow-sm"
//               style={{ marginLeft: "-15px" }}
//             >
//               <MdOutlineHome className="text-white text-2xl" />
//             </div>
//             <span className="text-2xl font-bold text-gray-800 tracking-wide">
//               Rishabh's Guest-House
//             </span>
//           </div>

//           {/* links */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.link}
//                 className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium"
//               >
//                 <item.icon className="text-lg mr-1" />
//                 <span>{item.name}</span>
//               </Link>
//             ))}
//           </div>

//           {/* user / logout */}
//           <div className="flex items-center space-x-5">
//             <p className="text-base text-gray-700 font-semibold">
//               Hello,&nbsp;
//               <span className="text-blue-700 font-bold capitalize">
//                 {userName}
//               </span>
//             </p>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
//               style={{ marginTop: "2px", marginLeft: "25px" }}
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default UserNav;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineHome, MdOutlineInfo } from "react-icons/md";
import { FiBookOpen } from "react-icons/fi";

const UserNav = () => {
  const [userName, setUserName] = useState("User");
  const location = useLocation(); // ✅ Detect current route

  // Helper to extract a friendly name
  const extractName = (raw) => {
    if (!raw) return "User";
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        raw = parsed;
      } catch {
        return raw;
      }
    }

    if (typeof raw === "object") {
      const candidates = [
        raw.name,
        raw.fullName,
        raw.full_name,
        raw.username,
        raw.userName,
        raw.firstName,
        raw.first_name,
        raw.email,
      ];
      for (const c of candidates) {
        if (c && typeof c === "string" && c.trim().length) return c.trim();
      }
    }

    return "User";
  };

  // Load user info from localStorage
  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    const name = extractName(storedUser);
    setUserName(name);
  };

  useEffect(() => {
    loadUserFromStorage();
    const onStorage = (e) => {
      if (e.key === "user") loadUserFromStorage();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserName("User");
    window.location.href = "/login";
  };

  // Navigation items
  const navItems = [
    { name: "View-Guest-houses", icon: MdOutlineHome, link: "/guesthouses" },
    { name: "My Bookings", icon: FiBookOpen, link: "/bookings" },
    { name: "Info", icon: MdOutlineInfo, link: "/info" },
  ];

  // Helper to check if the menu is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="w-screen fixed top-0 left-0 bg-white text-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 shadow-sm"
              style={{ marginLeft: "-15px" }}
            >
              <MdOutlineHome className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-wide">
              Rishabh's Guest-House
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.link);
              return (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`flex items-center text-base font-medium transition-all duration-200 pb-1 ${
                    active
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="text-lg mr-1" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User / Logout */}
          <div className="flex items-center space-x-5">
            <p className="text-base text-gray-700 font-semibold">
              Hello,&nbsp;
              <span className="text-blue-700 font-bold capitalize">
                {userName}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
              style={{ marginTop: "2px", marginLeft: "25px" }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNav;
