import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "./AnalysisContext";
import {
  Upload,
  BarChart3,
  Activity,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { analysisHistory } = useAnalysis();

  const stats = useMemo(() => {
    const total = analysisHistory.length;
    const completed = analysisHistory.filter(a => a.diagnosis || a.status === "completed").length;
    const pending = total - completed;
    const latestAccuracy = analysisHistory.length > 0 && analysisHistory[0].confidence 
      ? analysisHistory[0].confidence 
      : (total > 0 ? "88.27" : "0");

    return { total, completed, pending, accuracy: latestAccuracy };
  }, [analysisHistory]);

  const statsCards = [
    {
      title: "TOTAL ANALYSIS",
      value: stats.total,
      icon: Activity,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "PREDICTIONS COMPLETED",
      value: stats.completed,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "PENDING VALIDATION",
      value: stats.pending,
      icon: AlertCircle,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    {
      title: "ACCURACY RATE",
      value: `${stats.accuracy}%`,
      icon: TrendingUp,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 font-sans">Welcome to NephroSense Ultrasound</h1>
          <p className="text-slate-500 font-medium">AI-powered kidney ultrasound analysis for CKD stage prediction</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#2167f2] to-[#0792b3] rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl shadow-blue-100">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-3xl font-black mb-3">Ready to Analyze Kidney Ultrasound?</h2>
              <p className="text-blue-50 mb-8 max-w-lg font-medium opacity-90">
                Upload ultrasound images for automated CKD stage prediction with AI segmentation
              </p>
              <button 
                onClick={() => navigate("/analysis")}
                className="bg-white text-[#2167f2] px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-50 transition-all shadow-lg active:scale-95 group"
              >
                <Upload size={20} />
                Start New Analysis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="hidden md:block opacity-20 transform translate-x-10 translate-y-10">
                <Activity size={280} strokeWidth={1} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div 
              onClick={() => navigate("/analysis")}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group cursor-pointer"
            >
                <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:rotate-6 transition-transform">
                    <Upload size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-800 mb-2">Start New Analysis</h4>
                <p className="text-sm text-slate-400 font-medium">Upload kidney ultrasound for CKD staging</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group cursor-pointer">
                <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:rotate-6 transition-transform">
                    <BarChart3 size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-800 mb-2">View Reports</h4>
                <p className="text-sm text-slate-400 font-medium">
                  {analysisHistory.length > 0 ? `${analysisHistory.length} Reports available` : "No reports available yet"}
                </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group cursor-pointer">
                <div className="bg-fuchsia-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:rotate-6 transition-transform">
                    <TrendingUp size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-800 mb-2">Model Performance</h4>
                <p className="text-sm text-slate-400 font-medium">
                  Current Accuracy: {stats.accuracy}%
                </p>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="p-8 border-b border-slate-50 text-center">
            <h3 className="text-2xl font-black text-slate-800">Recent Analysis</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Latest kidney ultrasound predictions</p>
          </div>
          
          <div className="overflow-x-auto px-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Patient ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">CKD Stage / Diagnosis</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Date / Time</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analysisHistory.length > 0 ? (
                  analysisHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-bold">
                            <Users size={18} />
                          </div>
                          <span className="font-bold text-slate-700">{item.patientId || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${
                          item.diagnosis?.includes("Normal") 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}>
                          {item.diagnosis || "Predicting..."}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-2">
                           <Clock size={14} /> {item.date || ""} {item.time || ""}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            {item.status || "completed"}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Activity size={48} className="text-slate-200" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No analysis records found</p>
                        <button onClick={() => navigate("/analysis")} className="text-blue-500 font-black text-sm hover:underline">
                            START YOUR FIRST ANALYSIS →
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;