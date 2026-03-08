import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Activity, TrendingUp, Droplets, Moon, Sparkles } from "lucide-react";
import logo from "./logo.png";

const FrontPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(null);
  const [greeting, setGreeting] = useState("");

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const menuItems = [
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Dashboard",
      path: "/lifestyle/dashboard",
      active: location.pathname === "/lifestyle/dashboard",
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Lifestyle Data Summary",
      path: "/lifestyle/summary",
      active: location.pathname === "/lifestyle/summary",
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
    },
    {
      icon: <Droplets className="w-5 h-5" />,
      label: "Lifestyle Tracker",
      path: "/lifestyle/tracker",
      active: location.pathname === "/lifestyle/tracker",
      color: "from-cyan-500 to-teal-500",
      bgLight: "bg-cyan-50",
    },
    {
      icon: <Moon className="w-5 h-5" />,
      label: "Lifestyle Insights",
      path: "/lifestyle/insights",
      active: location.pathname === "/lifestyle/insights",
      color: "from-indigo-500 to-purple-500",
      bgLight: "bg-indigo-50",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Risk Prediction Results",
      path: "/lifestyle/risk-prediction",
      active: location.pathname === "/lifestyle/risk-prediction",
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-medical-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-medical-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slowest"></div>
      </div>

      {/* Sidebar with enhanced animations */}
      <div className="w-72 bg-gradient-to-b from-medical-700 via-medical-600 to-teal-700 text-white flex flex-col min-h-screen relative overflow-hidden shadow-2xl">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none animate-gradient"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Logo with hover animation */}
        <div className="p-6 border-b border-medical-600/50 relative">
          <button 
            onClick={() => navigate("/home")} 
            className="w-full cursor-pointer group"
          >
            <div className="flex flex-col items-center space-y-3 transform transition-all duration-300 group-hover:scale-105">
              <div className="relative">
                <img
                  src={logo}
                  alt="NephroSense Lifestyle Logo"
                  className="w-30 h-30 object-contain relative z-10 drop-shadow-lg animate-float-subtle"
                />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse-glow"></div>
              </div>
              <div className="text-center transform transition-all duration-300 group-hover:translate-y-[-2px]">
                <p className="text-white text-lg font-bold relative">
                  Lifestyle Management
                  <Sparkles className="absolute -right-6 top-0 w-4 h-4 text-yellow-300 animate-sparkle" />
                </p>
                <p className="text-medical-200 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Track • Analyze • Improve
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Menu with enhanced hover effects */}
        <nav className="flex-1 px-4 py-6 relative z-10">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li 
                key={index}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
                style={{
                  animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                    item.active
                      ? "bg-medical-600 text-white shadow-lg shadow-medical-600/30"
                      : "text-medical-100 hover:bg-medical-600/50 hover:text-white hover:shadow-md"
                  }`}
                >
                  {/* Animated background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Icon with animation */}
                  <span className={`relative z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    isHovered === index ? 'animate-bounce-subtle' : ''
                  }`}>
                    {item.icon}
                  </span>
                  
                  {/* Label with slide animation */}
                  <span className="relative z-10 flex-1 text-left transform transition-all duration-300 group-hover:translate-x-1">
                    {item.label}
                  </span>
                  
                  {/* Active indicator with pulse */}
                  {item.active && (
                    <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  )}
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Decorative bottom gradient */}
        <div className="h-32 bg-gradient-to-t from-medical-800/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header with enhanced animations */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-medical-100 sticky top-0 z-40 animate-slideDown">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Left side - Title with animation */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <h1 className="text-2xl font-semibold text-gray-800 animate-fadeIn">
                    {getCurrentPageTitle()}
                  </h1>
                  <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-medical-500 to-teal-500 rounded-full animate-expandWidth"></div>
                </div>
                <span className="text-sm bg-medical-100 text-medical-700 px-3 py-1 rounded-full font-medium animate-pulse-subtle flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-medical-500 rounded-full animate-pulse"></span>
                  Active Session
                </span>
              </div>

              {/* Center - Search Bar with focus animation */}
              <div className="flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patients, reports, or data..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-medical-300 group-hover:bg-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-medical-500 transition-colors duration-300"
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
                  
                  {/* Search suggestions (optional enhancement) */}
                  {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-medical-100 overflow-hidden animate-slideDown z-50">
                      <div className="p-2 text-sm text-gray-600 hover:bg-medical-50 cursor-pointer transition-colors">
                        Search for "{searchQuery}"...
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Right side - Profile with enhanced animations */}
              <div className="flex items-center space-x-4">
                {/* Greeting (new addition) */}
                <div className="hidden md:block text-sm text-gray-600 animate-fadeIn">
                  <span className="font-medium text-medical-600">{greeting},</span> {user?.name?.split(' ')[0] || 'User'}
                </div>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-medical-50 transition-all duration-300 group relative"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-600 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-500 transition-all duration-300 group-hover:text-medical-600 ${
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

                  {/* Profile Dropdown with enhanced animation */}
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-medical-100 overflow-hidden z-50 animate-slideDown">
                      <div className="p-4 bg-gradient-to-r from-medical-600 to-teal-600 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border-2 border-white/50">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold">{user?.name || 'User'}</p>
                            <p className="text-xs text-medical-100">{user?.email || ''}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-medical-50 border-b border-medical-100">
                        <span className="inline-block text-xs font-medium text-medical-700 bg-white px-3 py-1 rounded-full shadow-sm">
                          {user?.role || 'Healthcare Professional'}
                        </span>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => { logout(); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg font-medium text-sm transition-all duration-300 group"
                        >
                          <div className="p-1 bg-rose-100 rounded-md group-hover:bg-rose-200 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <span className="flex-1 text-left">Sign Out</span>
                          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area with fade animation */}
        <div className="flex-1 animate-fadeIn">
          <Outlet />
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 3rem;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) translateX(-5px);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.4;
          }
        }

        @keyframes float-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slowest {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.15);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2) rotate(10deg);
          }
        }

        @keyframes gradient {
          0% {
            opacity: 0.1;
            transform: translateX(-100%);
          }
          50% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.1;
            transform: translateX(100%);
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-expandWidth {
          animation: expandWidth 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-subtle {
          animation: float-subtle 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-pulse-slowest {
          animation: pulse-slowest 8s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 0.3s ease-in-out;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 6s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default FrontPage;