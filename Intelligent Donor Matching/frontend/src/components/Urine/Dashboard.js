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
  Clock,
  Droplet,
} from "lucide-react";

const UrineDashboard = () => {
  const navigate = useNavigate();
  const { analysisHistory } = useAnalysis();

  const stats = useMemo(() => {
    const total = analysisHistory.length;
    const completed = analysisHistory.filter((a) => a.status === "completed" || (a.results && a.results.length > 0)).length;
    const pending = Math.max(0, total - completed);

    const confidences = analysisHistory
      .map((a) => (typeof a.confidence === "number" ? a.confidence : null))
      .filter((v) => v !== null);

    const avgConfidence = confidences.length > 0
        ? (confidences.reduce((s, v) => s + v, 0) / confidences.length).toFixed(2)
        : "0.00";

    const positives = analysisHistory.filter((a) => a.hasWarning || a.flags?.isAbnormal).length;

    return { total, completed, pending, avgConfidence, positives };
  }, [analysisHistory]);

  const statsCards = [
    { title: "TOTAL TESTS", value: stats.total, icon: Activity, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
    { title: "COMPLETED", value: stats.completed, icon: CheckCircle, iconBg: "bg-green-50", iconColor: "text-green-500" },
    { title: "PENDING", value: stats.pending, icon: AlertCircle, iconBg: "bg-yellow-50", iconColor: "text-yellow-500" },
    { title: "RISK DETECTED", value: stats.positives, icon: TrendingUp, iconBg: "bg-rose-50", iconColor: "text-rose-500" },
  ];

  const latest = analysisHistory.slice(0, 8);

  const badgeFor = (item) => {
    const risk = item.summary || "";
    const hasAbnormal = item.hasWarning || item.flags?.isAbnormal;

    if (risk.includes("HIGH")) {
      return { text: "CRITICAL", cls: "bg-rose-100 text-rose-700 border-rose-200", dot: "bg-rose-600" };
    }
    if (risk.includes("MODERATE") || risk.includes("MILD")) {
      return { text: "OBSERVE", cls: "bg-orange-50 text-orange-700 border-orange-100", dot: "bg-orange-500" };
    }
    if (hasAbnormal) {
      return { text: "ABNORMAL", cls: "bg-rose-50 text-rose-600 border-rose-100", dot: "bg-rose-500" };
    }
    return { text: "NORMAL", cls: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter uppercase">NEPHROSENSE AI DASHBOARD</h1>
          <p className="text-slate-500 font-medium">Monitoring Patient Biomarkers & CKD Risk Levels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-xl`}><stat.icon className={`w-6 h-6 ${stat.iconColor}`} /></div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-green-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black mb-3">New Patient Urinalysis</h2>
              <p className="text-green-100 mb-8 font-medium opacity-80">
                Perform a high-accuracy AI scan to detect 10 biomarkers and evaluate CKD Risk Levels (Normal to High).
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate("/urine/urineanalysis")} className="bg-white text-green-900 px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-green-50 transition-all shadow-lg active:scale-95 group">
                  <Upload size={20} /> START ANALYSIS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="hidden md:block opacity-10 transform translate-x-10 translate-y-10"><Droplet size={280} strokeWidth={1} /></div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Diagnostic History</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Latest Clinical Findings</p>
            </div>
            <button onClick={() => navigate("/reports")} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All Records</button>
          </div>

          <div className="overflow-x-auto px-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Patient Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">AI Risk Evaluation</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {latest.length > 0 ? (
                  latest.map((item) => {
                    const badge = badgeFor(item);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${badge.text === 'CRITICAL' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-500'} rounded-xl flex items-center justify-center font-bold`}><Users size={18} /></div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-700 uppercase text-sm">{item.patientName || "Anonymous"}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{item.patientId} • {item.age}Y / {item.gender}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-sm font-black ${badge.text === 'CRITICAL' ? 'text-rose-600' : 'text-slate-700'} uppercase tracking-tighter`}>
                            {item.summary}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-500">
                          <div className="flex items-center gap-2"><Clock size={14} /> {item.date}</div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1 rounded-full border w-fit ${badge.cls}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => navigate(`/report/${item.id}`)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Eye size={20} /></button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                        <Activity size={48} className="text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No records found</p>
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

export default UrineDashboard;