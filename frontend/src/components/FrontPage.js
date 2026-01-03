import React, { useState } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Heart } from "lucide-react";

const FrontPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: "Dashboard",
      path: "/app/dashboard",
      active: location.pathname === "/app/dashboard" || location.pathname === "/app" || location.pathname === "/app/",
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      label: "Make Prediction",
      path: "/app/make-prediction",
      active: location.pathname === "/app/make-prediction",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      label: "Matching Results",
      path: "/app/matching-results",
      active: location.pathname === "/app/matching-results",
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      label: "Reports",
      path: "/app/reports",
      active: location.pathname === "/app/reports",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      label: "Model Transparency",
      path: "/app/model-transparency",
      active: location.pathname === "/app/model-transparency",
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      label: "Admin Profile",
      path: "/app/admin-profile",
      active: location.pathname === "/app/admin-profile",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/app" || currentPath === "/app/" || currentPath === "/app/dashboard") return "Dashboard";
    if (currentPath === "/app/make-prediction") return "Make Prediction";
    if (currentPath === "/app/matching-results") return "Matching Results";
    if (currentPath === "/app/reports") return "Reports";
    if (currentPath === "/app/model-transparency") return "Model Transparency";
    if (currentPath === "/app/admin-profile") return "Admin Profile";
    return "NephroSense";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-medical-700 text-white flex flex-col min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-medical-600">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <Heart className="w-8 h-8 text-medical-600" />
            </div>
            <div>
              <p className="text-white text-lg font-bold">NephroSense</p>
              <p className="text-medical-200 text-xs">Medical AI Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${item.active
                      ? "bg-medical-600 text-white shadow-lg"
                      : "text-medical-100 hover:bg-medical-600 hover:text-white"
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info at Bottom */}
        <div className="p-6 border-t border-medical-600 bg-medical-800">
          <div className="flex items-center space-x-3">
            <div className="bg-medical-600 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-medical-200 text-xs">{user?.role || 'Role'}</p>
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
              <span className="text-sm bg-medical-100 text-medical-700 px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients, reports, or data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none"
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
                    className={`w - 4 h - 4 text - gray - 400 transition - transform ${showProfile ? "transform rotate-180" : ""
                      } `}
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
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || ''}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {user?.role || 'User'}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 mt-2">
                      <button
                        onClick={() => {
                          logout();
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
