import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Activity, TrendingUp, Droplets, Moon } from "lucide-react";
import logo from "./logo.png";

const FrontPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Dashboard",
      path: "/lifestyle/dashboard",
      active: location.pathname === "/lifestyle/dashboard",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Lifestyle Data Summary",
      path: "/lifestyle/summary",
      active: location.pathname === "/lifestyle/summary",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Lifestyle Tracker",
      path: "/lifestyle/tracker",
      active: location.pathname === "/lifestyle/tracker",
    },
    {
      icon: <Moon className="w-5 h-5" />,
      label: "Lifestyle Insights",
      path: "/lifestyle/insights",
      active: location.pathname === "/lifestyle/insights",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Risk Prediction Results",
      path: "/lifestyle/risk-prediction",
      active: location.pathname === "/lifestyle/risk-prediction",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/lifestyle/dashboard") return "Dashboard";
    if (currentPath === "/lifestyle/summary") return "Lifestyle Data Summary";
    if (currentPath === "/lifestyle/tracker") return "Lifestyle Tracker";
    if (currentPath === "/lifestyle/insights") return "Lifestyle Insights";
    if (currentPath === "/lifestyle/risk-prediction") return "Risk Prediction Results";
    return "NephroSense Lifestyle";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-medical-700 text-white flex flex-col min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-medical-600">
          <button onClick={() => navigate("/home")} className="w-full cursor-pointer">
            <div className="flex flex-col items-center space-y-3 hover:opacity-80 transition-opacity">
              <img
                src={logo}
                alt="NephroSense Lifestyle Logo"
                className="w-30 h-30 object-contain"
              />
              <div className="text-center">
                <p className="text-white text-lg font-bold">Lifestyle Management</p>
              </div>
            </div>
          </button>
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
                      ? "bg-medical-600 text-white shadow-lg"
                      : "text-medical-100 hover:bg-medical-600 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
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

            {/* Right side - Profile */}
            <div className="flex items-center space-x-4">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-medical-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      showProfile ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-800">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {user?.email || ''}
                      </p>
                      <span className="inline-block mt-1.5 text-xs font-medium text-medical-600 bg-medical-50 px-2 py-0.5 rounded">
                        {user?.role || 'Clinician'}
                      </span>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => { logout(); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-md font-medium text-sm transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
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