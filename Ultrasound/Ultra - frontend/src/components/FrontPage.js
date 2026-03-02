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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: "Dashboard",
      path: "/dashboard",
     
      active: location.pathname === "/" || location.pathname === "/dashboard",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V5a2 2 0 012-2h2a2 2 0 012 2v0M9 5a2 2 0 012-2h2a2 2 0 012 2v0m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5" />
        </svg>
      ),
      label: "Kidney Ultrasound Analysis",
      path: "/analysis",
      active: location.pathname === "/analysis",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/" || currentPath === "/dashboard") return "Dashboard";
    if (currentPath === "/analysis") return "Kidney Ultrasound Analysis"; 
    if (currentPath === "/matching-results") return "Matching Results"
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
      <div className="flex flex-col w-64 min-h-screen text-white bg-green-600">
        <div className="flex flex-col items-center m-3 space-y-3">
          <img src="/logo.png" alt="NephroSense Logo" className="object-contain w-30 h-30" />
          <div className="text-center">
            <p className="text-lg font-bold text-white">UltrasoundImage Analysis</p>
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
                      ? "bg-green-500 text-white shadow-inner"
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
          <div className="p-4 bg-green-500 rounded-lg">
            <p className="mb-2 text-sm text-green-100">Support 24/7</p>
            <p className="mb-4 text-xs text-green-200">Contact us anytime</p>
          </div>
          <div className="flex items-center mt-4 space-x-3">
            <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop" alt="Support" className="w-12 h-12 border-2 border-green-400 rounded-full" />
            <div>
              <p className="text-sm text-green-100">Nephrosense</p>
              <p className="text-xs text-green-200">Web</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden"> 
        {/* Header */}
        <div className="px-6 py-4 bg-white shadow-sm z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {getCurrentPageTitle()}
              </h1>
              <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">
                Active
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center p-1 space-x-2 rounded-full hover:bg-gray-100">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="Profile" className="w-8 h-8 border-2 border-gray-300 rounded-full" />
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showProfile ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showProfile && (
                <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">Dr. John Doe</p>
                    <p className="text-xs text-gray-500">hello@nephrosense.com</p>
                  </div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>

      
        <div className="flex-1 overflow-y-auto p-0"> 
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default FrontPage;