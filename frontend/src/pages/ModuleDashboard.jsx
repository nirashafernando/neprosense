import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Microscope,
  Image,
  TrendingUp,
  Heart,
  Activity,
  ArrowRight,
  CheckCircle,
  LogOut,
  User,
  ChevronRight,
  Droplet,
  Sparkles,
  Brain,
  Shield,
  Zap,
} from "lucide-react";

const modules = [
  {
    number: 1,
    title: "Urine Test Analysis",
    subtitle: "Early Detection",
    description:
      "CNN-based automated analysis of urine dipstick images for early detection of CKD biomarkers and risk indicators.",
    icon: Microscope,
    color: "from-blue-500 to-indigo-600",
    lightColor: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-700",
    features: ["Image Recognition", "CNN Analysis", "Biomarker Detection"],
    route: "/urine",
    accentRing: "hover:ring-blue-200",
  },
  {
    number: 2,
    title: "Clinical Image Analysis",
    subtitle: "Diagnostic Support",
    description:
      "AI-assisted interpretation of ultrasound and medical imaging to support nephrologists in diagnostic decision-making.",
    icon: Image,
    color: "from-purple-500 to-pink-600",
    lightColor: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700",
    features: ["Ultrasound Analysis", "Image Enhancement", "AI Diagnosis"],
    route: "/ultrasound",
    accentRing: "hover:ring-purple-200",
  },
  {
    number: 3,
    title: "Lifestyle Prediction",
    subtitle: "Progression Tracking",
    description:
      "Machine learning-based prediction of CKD progression with personalized lifestyle and treatment recommendations.",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
    lightColor: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700",
    features: ["Progression Forecast", "Personalized Advice", "Risk Tracking"],
    route: "/lifestyle",
    accentRing: "hover:ring-amber-200",
  },
  {
    number: 4,
    title: "Intelligent Donor Matching",
    subtitle: "Transplant Decision",
    description:
      "Advanced ML-driven donor-recipient compatibility analysis with risk-based ranking and SHAP explainability.",
    icon: Heart,
    color: "from-medical-500 to-teal-600",
    lightColor: "from-medical-50 to-teal-50",
    borderColor: "border-medical-200 hover:border-medical-400",
    iconBg: "bg-medical-100",
    iconColor: "text-medical-600",
    badgeColor: "bg-medical-100 text-medical-700",
    features: ["Risk Categorization", "AI Explainability", "Multi-Donor Ranking"],
    route: "/app/dashboard",
    accentRing: "hover:ring-medical-200",
  },
];

const stats = [
  { label: "Active Modules", value: "4", icon: Sparkles, color: "text-medical-600" },
  { label: "AI Algorithms", value: "12+", icon: Brain, color: "text-purple-600" },
  { label: "Clinical Accuracy", value: "High", icon: Shield, color: "text-emerald-600" },
  { label: "Real-Time Analysis", value: "Live", icon: Zap, color: "text-amber-600" },
];

export default function ModuleDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hoveredModule, setHoveredModule] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-medical-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="NephroSense" className="h-12 object-contain cursor-pointer" onClick={() => navigate("/home")} style={{ filter: "brightness(0) saturate(100%) invert(38%) sepia(97%) saturate(500%) hue-rotate(127deg) brightness(80%)" }} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-medical-600 hover:bg-medical-50 transition-all text-sm font-semibold"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-medical-600 via-medical-700 to-teal-600 rounded-2xl p-8 mb-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-medical-200 font-semibold mb-1 text-sm">Welcome back,</p>
              <h2 className="text-3xl lg:text-4xl font-black mb-2">
                {user?.name || user?.email?.split("@")[0] || "Clinician"} 👋
              </h2>
              <p className="text-medical-100 max-w-xl">
                Select a module below to begin your clinical analysis. All four NephroSense AI systems are active and ready.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/20">
                <div className="text-2xl font-black">4</div>
                <div className="text-xs text-medical-200 font-semibold">Active Modules</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/20">
                <div className="flex items-center gap-1 justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-2xl font-black">Live</span>
                </div>
                <div className="text-xs text-medical-200 font-semibold">System Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-md border border-slate-100 flex items-center gap-4">
                <div className="bg-slate-50 rounded-xl p-3 shrink-0">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-semibold">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800">Clinical Modules</h2>
          <p className="text-slate-500 text-sm mt-1">Choose a module to launch the corresponding AI analysis system</p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            const isHovered = hoveredModule === idx;
            return (
              <div
                key={mod.number}
                className={`group relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${mod.borderColor} hover:ring-4 ${mod.accentRing}`}
                onMouseEnter={() => setHoveredModule(idx)}
                onMouseLeave={() => setHoveredModule(null)}
                onClick={() => navigate(mod.route)}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.lightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>

                <div className="relative p-7">
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className={`${mod.iconBg} p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className={`w-8 h-8 ${mod.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-slate-400">MODULE {mod.number}</span>
                        <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          ACTIVE
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-0.5">{mod.title}</h3>
                      <p className={`text-sm font-semibold mb-3 bg-gradient-to-r ${mod.color} bg-clip-text text-transparent`}>{mod.subtitle}</p>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{mod.description}</p>

                      {/* Feature tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {mod.features.map((f, i) => (
                          <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full ${mod.badgeColor}`}>
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Launch button */}
                      <button
                        className={`w-full bg-gradient-to-r ${mod.color} text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg group-hover:shadow-xl flex items-center justify-center gap-2`}
                        onClick={(e) => { e.stopPropagation(); navigate(mod.route); }}
                      >
                        <Activity className="w-4 h-4" />
                        Launch Module
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active indicator dot */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Workflow */}
        <div className="bg-gradient-to-br from-medical-600 via-medical-700 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 rounded-xl p-2">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black">Clinical Workflow Pathway</h3>
              <p className="text-medical-100 text-xs">Integrated care continuum — from screening to transplant</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div key={idx} className="relative">
                  <button
                    onClick={() => navigate(mod.route)}
                    className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-white/40 transition-all text-left group"
                  >
                    <div className={`${mod.iconBg} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${mod.iconColor}`} />
                    </div>
                    <div className="text-xs font-black text-medical-100 mb-1">STAGE {idx + 1}</div>
                    <div className="text-sm font-bold text-white mb-1">{mod.subtitle}</div>
                    <div className="text-xs text-medical-200 mb-3">{mod.title}</div>
                    <div className="flex items-center gap-1 text-xs text-teal-200 font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      Live
                      <ChevronRight className="w-3 h-3 ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  {idx < modules.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2 z-10 -translate-y-1/2">
                      <div className="bg-white/30 rounded-full p-1">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-6 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-400 text-xs">© 2026 NephroSense — AI-Powered CKD Management System</p>
          <p className="text-slate-400 text-xs">Medical AI Decision Support</p>
        </div>
      </footer>
    </div>
  );
}
