import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineHome } from "react-icons/md";
import { FiBookOpen } from "react-icons/fi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";

const UserNav = () => {
  const [userName, setUserName] = useState("User");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const location = useLocation();
  const navigate = useNavigate();

  //  Extract name helper
  const extractName = (raw) => {
    if (!raw) return "User";
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        return raw;
      }
    }
    if (typeof raw === "object") {
      const candidates = [raw.name, raw.firstName, raw.username, raw.email];
      for (const c of candidates) if (c && c.trim()) return c.trim();
    }
    return "User";
  };

  //  Load user info from localStorage
  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(extractName(parsed));
        if (parsed.role) setUserRole(parsed.role);
      } catch {
        setUserName(extractName(storedUser));
      }
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    const onStorage = (e) => e.key === "user" && loadUserFromStorage();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserName("User");
    navigate("/login");
  };

  //  Navigation items
  const navItems = [
    { name: "View Guest Houses", icon: MdOutlineHome, link: "/dashboard" },
    { name: "My Bookings", icon: FiBookOpen, link: "/mybookings" },
    { name: "Profile", icon: FaUserCircle, link: "/profile" },
  ];

  //  Active detection
  const isActiveTab = (item) => location.pathname.startsWith(item.link);

  //  Handle menu click
  const handleNavClick = (e, item) => {
    e.preventDefault();
    navigate(item.link);
    setIsMenuOpen(false);
  };

  //  Filter for admin (optional)
  const filteredNavItems =
    userRole === "admin"
      ? navItems.filter((item) => item.name === "Profile")
      : navItems;

  return (
    <nav className="w-screen fixed top-0 left-0 bg-white text-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-6">
          {/*  Logo */}

          {/* 1st container */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r">
              <img src="/logo.jpeg" width={"45px"} alt="Logo" />
            </div>
            <span className="text-2xl font-bold text-blue-900 tracking-wide">
              Rishabh's Guest-House
            </span>
          </div>

          {/*  Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-3xl text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>

          {/*  Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveTab(item);
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center text-base font-medium transition-all duration-200 pb-1 border-b-2 ${
                    active
                      ? "text-blue-800 border-blue-800"
                      : "text-gray-700 border-transparent hover:text-blue-800 hover:border-blue-800"
                  }`}
                >
                  <Icon className="text-lg mr-1" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/*  User & Logout */}
          <div className="hidden md:flex items-center space-x-5">
            <p className="text-base text-gray-700 font-semibold">
              Hello,&nbsp;
              <span className="text-blue-800 font-bold capitalize">
                {userName}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/*  Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 pb-4">
            <div className="flex flex-col items-start px-4 space-y-4 mt-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveTab(item);
                return (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`flex items-center text-base font-medium transition-all duration-200 ${
                      active
                        ? "text-blue-800"
                        : "text-gray-700 hover:text-blue-800"
                    }`}
                  >
                    <Icon className="text-lg mr-2" />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              {/* Last Container */}
              <div className="border-t border-gray-300 w-full my-2"></div>

              <p className="text-gray-700 font-semibold">
                Hello,&nbsp;
                <span className="text-blue-800 font-bold capitalize">
                  {userName}
                </span>
              </p>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNav;





