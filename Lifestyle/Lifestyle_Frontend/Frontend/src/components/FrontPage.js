import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Activity, TrendingUp, Droplets, Moon } from "lucide-react";
import logo from "./logo.png";

const FrontPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Dashboard",
      path: "/",
      active: location.pathname === "/" || location.pathname === "/dashboard",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Lifestyle Data Summary",
      path: "/lifestyle-data-summary",
      active: location.pathname === "/lifestyle-data-summary",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Lifestyle Tracker",
      path: "/lifestyle-tracker",
      active: location.pathname === "/lifestyle-tracker",
    },
    {
      icon: <Moon className="w-5 h-5" />,
      label: "Lifestyle Insights",
      path: "/lifestyle-insights",
      active: location.pathname === "/lifestyle-insights",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Risk Prediction Results",
      path: "/lifestyle-risk-prediction",
      active: location.pathname === "/lifestyle-risk-prediction",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/" || currentPath === "/dashboard") return "Dashboard";
    if (currentPath === "/lifestyle-data-summary") return "Lifestyle Data Summary";
    if (currentPath === "/lifestyle-tracker") return "Lifestyle Tracker";
    if (currentPath === "/lifestyle-insights") return "Lifestyle Insights";
    if (currentPath === "/lifestyle-risk-prediction") return "Risk Prediction Results";
    return "NephroSense Lifestyle";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-700 to-teal-700 text-white flex flex-col min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-green-600">
  <div className="flex flex-col items-center space-y-3">
    {/* Logo Image */}
    <img 
      src={logo} // CHANGED TO USE IMPORTED LOGO
      alt="NephroSense Logo"
      className="w-30 h-30 object-contain"
    />
    <div className="text-center">
      <p className="text-white text-lg font-bold">Lifestyle Management</p>
    </div>
  </div>
</div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? "bg-green-600 text-white shadow-lg"
                      : "text-green-100 hover:bg-green-600 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info at Bottom */}
        <div className="p-6 border-t border-green-600 bg-green-800">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Dr. John Doe</p>
              <p className="text-green-200 text-xs">Nephrologist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Title */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {getCurrentPageTitle()}
              </h1>
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                Active Session
              </span>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients, entries, or insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </form>
            </div>

            {/* Right side - Actions and Profile */}
            <div className="flex items-center space-x-4">
              {/* Profile Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                  />
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      showProfile ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-800">
                        Dr. John Doe
                      </p>
                      <p className="text-xs text-gray-500">
                        nephrologist@nephrosense.com
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Medical Professional
                      </p>
                    </div>
                    <div className="border-t border-gray-200 mt-2">
                      <button
                        onClick={() => {
                          // Handle logout
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FrontPage;