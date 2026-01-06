import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const FrontPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      label: "Dashboard",
      path: "/dashboard",
      active: location.pathname === "/" || location.pathname === "/dashboard",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V5a2 2 0 012-2h2a2 2 0 012 2v0M9 5a2 2 0 012-2h2a2 2 0 012 2v0m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5"
          />
        </svg>
      ),
      label: "Urine Test Analysis",
      path: "/analysis",
      active: location.pathname === "/analysis",
    },
    
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/" || currentPath === "/dashboard") return "Dashboard";
    if (currentPath === "/matching-results") return "Matching Results";
    if (currentPath === "/reports") return "Reports";
    if (currentPath === "/admin") return "Admin";
    return "NephroSense";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-600 text-white min-h-screen flex flex-col">
        {/* Logo */}
        <div className="flex flex-col items-center m-3 space-y-3">
    {/* Logo Image */}
    <img 
      src="/logo.png"
      alt="NephroSense Logo"
      className="object-contain w-30 h-30"
    />
    <div className="text-center">
      <p className="text-lg font-bold text-white">UrineTest Analysis</p>
    </div>
  </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "bg-green-500 text-white"
                      : "text-green-100 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Support Section */}
        <div className="p-6 border-t border-green-500">
          <div className="bg-green-500 rounded-lg p-4">
            <p className="text-green-100 text-sm mb-2">Support 24/7</p>
            <p className="text-green-200 text-xs mb-4">Contact us anytime</p>
          </div>

          {/* Support Character */}
          <div className="mt-4 flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop"
              alt="Support"
              className="w-12 h-12 rounded-full border-2 border-green-400"
            />
            <div>
              <p className="text-green-100 text-sm">Nephrosense</p>
              <p className="text-green-200 text-xs">Web</p>
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
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Active
              </span>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
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
                        hello@nephrosense.com
                      </p>
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account Settings
                    </a>
                    <div className="border-t border-gray-200 mt-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </a>
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
