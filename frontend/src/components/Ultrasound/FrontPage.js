import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const FrontPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
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
      path: "/ultrasound",

      active:
        location.pathname === "/ultrasound" ||
        location.pathname === "/ultrasound/dashboard",
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
      label: "Kidney US Analysis",
      path: "/ultrasound/analysis",
      active: location.pathname === "/ultrasound/analysis",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (
      currentPath === "/ultrasound" ||
      currentPath === "/ultrasound/dashboard"
    )
      return "Dashboard";
    if (currentPath === "/ultrasound/analysis")
      return "Kidney Ultrasound Analysis";
    return "NephroSense";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 min-h-screen text-white bg-gradient-to-b from-medical-800 via-medical-700 to-medical-900">
        <div className="flex flex-col items-center m-3 space-y-3">
          <button onClick={() => navigate("/home")} className="cursor-pointer">
            <img
              src="/logo.png"
              alt="NephroSense Logo"
              className="object-contain w-30 h-30"
            />
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              UltrasoundImage Analysis
            </p>
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
                      ? "bg-medical-700 text-white shadow-inner"
                      : "text-medical-200 hover:bg-medical-700 hover:text-white"
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
      <div className="flex flex-col flex-1 overflow-hidden">
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

        <div className="flex-1 p-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
