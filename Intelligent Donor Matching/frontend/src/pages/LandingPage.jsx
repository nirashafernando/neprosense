import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Activity, 
  Users, 
  Shield, 
  ArrowRight,
  Microscope,
  Scan,
  FileText,
  Stethoscope
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClinicalImageAnalysisClick = () => {
    navigate("/login", { state: { from: "ultrasound" } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-medical-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-medical-200 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute delay-1000 bg-teal-200 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        </div>

        <nav className="relative z-10 px-6 py-4">
          <div className="flex items-center justify-between mx-auto max-w-7xl">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-medical-600" />
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-medical-700 to-teal-700 bg-clip-text">
                NephroSense
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 font-medium transition-colors text-medical-700 hover:text-medical-800"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 bg-gradient-to-r from-medical-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Register
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 px-6 py-16 mx-auto max-w-7xl md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-5xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-medical-800 to-teal-800 bg-clip-text">
              AI-Powered Kidney Care Platform
            </h1>
            <p className="max-w-2xl mx-auto mb-10 text-xl text-slate-600">
              Advanced decision support system for nephrologists with ultrasound analysis and donor-recipient matching
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleClinicalImageAnalysisClick}
                className="flex items-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all bg-gradient-to-r from-medical-600 to-teal-600 rounded-2xl hover:shadow-2xl hover:-translate-y-1"
              >
                <Scan size={24} />
                Clinical Image Analysis
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate("/component-1")}
                className="flex items-center gap-3 px-8 py-4 text-lg font-bold transition-all bg-white border-2 text-medical-700 rounded-2xl border-medical-200 hover:border-medical-400 hover:-translate-y-1"
              >
                <Users size={24} />
                Donor-Recipient Matching
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-20 mx-auto max-w-7xl">
        <h2 className="mb-12 text-3xl font-bold text-center text-slate-800">
          Comprehensive Kidney Care Solutions
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Clinical Image Analysis Card */}
          <div 
            onClick={handleClinicalImageAnalysisClick}
            className="p-6 transition-all bg-white border shadow-lg cursor-pointer rounded-2xl border-slate-100 hover:shadow-2xl hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-center mb-4 transition-colors w-14 h-14 bg-medical-100 rounded-xl group-hover:bg-medical-200">
              <Scan className="w-7 h-7 text-medical-700" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">Clinical Image Analysis</h3>
            <p className="mb-4 text-sm text-slate-600">
              AI-powered kidney ultrasound analysis with automated CKD stage prediction
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold transition-all text-medical-600 group-hover:gap-2">
              Start Analysis <ArrowRight size={16} />
            </span>
          </div>

          {/* Donor Matching Card */}
          <div 
            onClick={() => navigate("/component-1")}
            className="p-6 transition-all bg-white border shadow-lg cursor-pointer rounded-2xl border-slate-100 hover:shadow-2xl hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-center mb-4 transition-colors bg-teal-100 w-14 h-14 rounded-xl group-hover:bg-teal-200">
              <Users className="text-teal-700 w-7 h-7" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">Donor Matching</h3>
            <p className="mb-4 text-sm text-slate-600">
              Intelligent donor-recipient pairing with HLA typing and compatibility scoring
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold text-teal-600 transition-all group-hover:gap-2">
              Find Matches <ArrowRight size={16} />
            </span>
          </div>

          {/* Research Dashboard Card */}
          <div 
            onClick={() => navigate("/component-2")}
            className="p-6 transition-all bg-white border shadow-lg cursor-pointer rounded-2xl border-slate-100 hover:shadow-2xl hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-center mb-4 transition-colors bg-purple-100 w-14 h-14 rounded-xl group-hover:bg-purple-200">
              <Activity className="text-purple-700 w-7 h-7" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">Research Dashboard</h3>
            <p className="mb-4 text-sm text-slate-600">
              Comprehensive analytics and visualization for clinical research
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition-all group-hover:gap-2">
              View Dashboard <ArrowRight size={16} />
            </span>
          </div>

          {/* Clinical Reports Card */}
          <div 
            onClick={() => navigate("/component-3")}
            className="p-6 transition-all bg-white border shadow-lg cursor-pointer rounded-2xl border-slate-100 hover:shadow-2xl hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-center mb-4 transition-colors w-14 h-14 bg-amber-100 rounded-xl group-hover:bg-amber-200">
              <FileText className="w-7 h-7 text-amber-700" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">Clinical Reports</h3>
            <p className="mb-4 text-sm text-slate-600">
              Generate and manage comprehensive patient reports and analyses
            </p>
            <span className="flex items-center gap-1 text-sm font-semibold transition-all text-amber-600 group-hover:gap-2">
              View Reports <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 text-white bg-medical-900">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-4xl font-bold">10K+</div>
              <div className="text-medical-300">Ultrasound Analyses</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">5K+</div>
              <div className="text-medical-300">Successful Matches</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">500+</div>
              <div className="text-medical-300">Active Hospitals</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">98%</div>
              <div className="text-medical-300">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <Heart className="w-6 h-6 text-medical-600" />
                <span className="font-bold text-slate-800">NephroSense</span>
              </div>
              <p className="text-sm text-slate-600">
                AI-powered kidney care platform for healthcare professionals
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-800">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button onClick={() => navigate("/login")} className="hover:text-medical-600">Login</button></li>
                <li><button onClick={() => navigate("/register")} className="hover:text-medical-600">Register</button></li>
                <li><button onClick={() => navigate("/component-1")} className="hover:text-medical-600">Donor Matching</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-800">Features</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Ultrasound Analysis</li>
                <li>Donor Matching</li>
                <li>Clinical Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-slate-800">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>support@nephrosense.com</li>
                <li>1-800-NEPHRO</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-sm text-center border-t border-slate-200 text-slate-600">
            © 2024 NephroSense. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;