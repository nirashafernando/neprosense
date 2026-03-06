import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Activity, BarChart3, FileText, UserCog, Lightbulb, Heart } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      icon: Heart,
      label: "Make Prediction",
      path: "/make-prediction",
      active: location.pathname === "/make-prediction",
    },
    {
      icon: BarChart3,
      label: "Matching Results",
      path: "/matching-results",
      active: location.pathname === "/matching-results",
    },
    {
      icon: FileText,
      label: "Reports",
      path: "/reports",
      active: location.pathname === "/reports",
    },
    {
      icon: UserCog,
      label: "Admin Profile",
      path: "/admin",
      active: location.pathname === "/admin",
    },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-medical-800 via-medical-700 to-medical-900 text-white min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-0 w-40 h-40 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-0 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
      </div>
      
      {/* Logo Section */}
      <div className="p-6 relative">
        <button onClick={() => navigate("/home")} className="w-full cursor-pointer">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-400 to-emerald-500 p-2.5 rounded-xl shadow-lg">
                <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">NephroSense</h1>
                <p className="text-xs text-white/70 font-medium">Donor Matching System</p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-2 relative">
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${ 
                    item.active
                      ? "bg-white shadow-lg"
                      : "hover:bg-white/10 hover:pl-5"
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 transition-all ${ 
                      item.active 
                        ? "text-medical-700" 
                        : "text-white/80 group-hover:text-white group-hover:scale-110"
                    }`} 
                    strokeWidth={2.5} 
                  />
                  <span className={`font-semibold text-sm transition-colors ${ 
                    item.active 
                      ? "text-medical-900" 
                      : "text-white/90 group-hover:text-white"
                  }`}>
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-medical-600 animate-pulse"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Support Section */}
      <div className="p-4 relative">
        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-400 p-2 rounded-lg shadow-md">
              <Lightbulb className="w-4 h-4 text-amber-900" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-bold text-xs">Need Help?</p>
              <p className="text-white/60 text-xs">We're here 24/7</p>
            </div>
          </div>
          <button className="w-full bg-white hover:bg-teal-50 text-medical-800 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Get Support
          </button>
        </div>

        {/* System Status */}
        <div className="mt-3 flex items-center justify-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-emerald-400/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></div>
          <p className="text-emerald-200 text-xs font-semibold">System Online</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
