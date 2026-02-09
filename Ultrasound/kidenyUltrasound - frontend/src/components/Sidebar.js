import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      active: location.pathname === "/dashboard",
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
      label: "Matching Results",
      path: "/matching-results",
      active: location.pathname === "/matching-results",
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
      path: "/reports",
      active: location.pathname === "/reports",
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
      label: "Admin",
      path: "/admin",
      active: location.pathname === "/admin",
    },
  ];

  return (
    <div className="flex flex-col w-64 min-h-screen text-white bg-green-600">
      {/* Logo */}
       <div className="flex flex-col items-center m-3 space-y-3">
    {/* Logo Image */}
    <img 
      src="/logo.png"
      alt="NephroSense Logo"
      className="object-contain w-30 h-30"
    />
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
        <div className="p-4 bg-green-500 rounded-lg">
          <p className="mb-2 text-sm text-green-100">Support 24/7</p>
          <p className="mb-4 text-xs text-green-200">Contact us anytime</p>
          <button className="px-4 py-2 text-sm font-medium text-green-600 transition-colors bg-white rounded-lg hover:bg-green-50">
            Start
          </button>
        </div>

        {/* Support Character */}
        <div className="flex items-center mt-4 space-x-3">
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop"
            alt="Support"
            className="w-12 h-12 border-2 border-green-400 rounded-full"
          />
          <div>
            <p className="text-sm text-green-100">Medical Assistant</p>
            <p className="text-xs text-green-200">Online now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
