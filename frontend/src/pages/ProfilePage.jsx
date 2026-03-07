import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AdminProfile from "../components/AdminProfile";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-medical-600 hover:bg-medical-50 transition-all text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
             
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <img
              src="/logo.png"
              alt="NephroSense"
              className="h-12 object-contain cursor-pointer"
              onClick={() => navigate("/home")}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(38%) sepia(97%) saturate(500%) hue-rotate(127deg) brightness(80%)",
              }}
            />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Profile Content */}
      <AdminProfile />
    </div>
  );
}
