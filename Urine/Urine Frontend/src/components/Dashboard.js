import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../AnalysisContext";
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

    const completed = analysisHistory.filter(
      (a) => a.status === "completed" || (a.results && a.results.length > 0)
    ).length;

    const pending = Math.max(0, total - completed);

    
    const confidences = analysisHistory
      .map((a) => (typeof a.confidence === "number" ? a.confidence : null))
      .filter((v) => v !== null);

    const avgConfidence =
      confidences.length > 0
        ? (confidences.reduce((s, v) => s + v, 0) / confidences.length).toFixed(2)
        : "0.00";

    const positives = analysisHistory.filter((a) => a.flags?.isAbnormal).length;

    return { total, completed, pending, avgConfidence, positives };
  }, [analysisHistory]);

  const statsCards = [
    {
      title: "TOTAL TESTS",
      value: stats.total,
      icon: Activity,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "COMPLETED",
      value: stats.completed,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "PENDING",
      value: stats.pending,
      icon: AlertCircle,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    {
      title: "AVG CONFIDENCE",
      value: `${stats.avgConfidence}%`,
      icon: TrendingUp,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  const latest = analysisHistory.slice(0, 8);

  const badgeFor = (item) => {
    const abnormal = item.flags?.isAbnormal;
    if (item.status && item.status !== "completed") {
      return {
        text: item.status,
        cls: "bg-yellow-50 text-yellow-700 border-yellow-100",
        dot: "bg-yellow-500",
      };
    }
    if (abnormal) {
      return {
        text: "abnormal",
        cls: "bg-rose-50 text-rose-600 border-rose-100",
        dot: "bg-rose-500",
      };
    }
    return {
      text: "normal",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
      dot: "bg-emerald-500",
    };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 font-sans">
            Welcome to NephroSense Dashboard
          </h1>
          <p className="font-medium text-slate-500">
            AI-powered urine strip pad detection & automated reporting
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]"
            >
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black tracking-tight text-slate-800">
                  {stat.value}
                </h3>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#2167f2] to-[#0792b3] rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl shadow-blue-100">
          <div className="relative z-10 flex flex-col items-center justify-between md:flex-row">
            <div>
              <h2 className="mb-3 text-3xl font-black">Ready to Analyze a Urine Strip?</h2>
              <p className="max-w-lg mb-8 font-medium text-blue-50 opacity-90">
                Upload a strip image. The model detects 10 pads and generates readings
                (Nitrite, Glucose, Protein, pH, etc.).
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/analysis")}
                  className="bg-white text-[#2167f2] px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-50 transition-all shadow-lg active:scale-95 group"
                >
                  <Upload size={20} />
                  Start New Test
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate("/reports")}
                  className="flex items-center gap-3 px-10 py-4 font-black transition-all border bg-white/10 border-white/20 rounded-2xl hover:bg-white/15 active:scale-95"
                >
                  <BarChart3 size={20} />
                  View Reports
                </button>
              </div>
            </div>

            <div className="hidden transform translate-x-10 translate-y-10 md:block opacity-20">
              <Droplet size={280} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
          <div
            onClick={() => navigate("/analysis")}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group cursor-pointer"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white transition-transform bg-blue-500 shadow-lg rounded-2xl group-hover:rotate-6">
              <Upload size={28} />
            </div>
            <h4 className="mb-2 text-xl font-bold text-slate-800">Start New Test</h4>
            <p className="text-sm font-medium text-slate-400">Upload urine strip image & analyze</p>
          </div>

          <div
            onClick={() => navigate("/reports")}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group cursor-pointer"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white transition-transform shadow-lg bg-emerald-500 rounded-2xl group-hover:rotate-6">
              <BarChart3 size={28} />
            </div>
            <h4 className="mb-2 text-xl font-bold text-slate-800">Reports</h4>
            <p className="text-sm font-medium text-slate-400">
              {analysisHistory.length > 0
                ? `${analysisHistory.length} Reports available`
                : "No reports available yet"}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white shadow-lg bg-fuchsia-500 rounded-2xl">
              <TrendingUp size={28} />
            </div>
            <h4 className="mb-2 text-xl font-bold text-slate-800">Model Snapshot</h4>
            <p className="text-sm font-medium text-slate-400">
              Avg Confidence: {stats.avgConfidence}% • Abnormal Flags: {stats.positives}
            </p>
          </div>
        </div>

        {/* Recent tests */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="p-8 text-center border-b border-slate-50">
            <h3 className="text-2xl font-black text-slate-800">Recent Tests</h3>
            <p className="mt-1 text-sm font-bold tracking-widest uppercase text-slate-400">
              Latest urine strip analyses
            </p>
          </div>

          <div className="px-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-slate-400 border-slate-50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                    Patient / Sample
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                    Summary
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                    Date / Time
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {latest.length > 0 ? (
                  latest.map((item) => {
                    const badge = badgeFor(item);
                    return (
                      <tr key={item.id} className="transition-colors hover:bg-slate-50/50 group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 font-bold bg-slate-100 text-slate-500 rounded-xl">
                              <Users size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700">
                                {item.patientId || "N/A"}
                              </span>
                              <span className="text-xs font-semibold text-slate-400">
                                {item.sampleId ? `Sample: ${item.sampleId}` : "Urine strip"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-2">
                            <span className="text-sm font-bold text-slate-700">
                              {item.summary || "Pad readings generated"}
                            </span>

                            {/* optional: show a couple of key pads if stored */}
                            {Array.isArray(item.results) && item.results.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.results.slice(0, 3).map((r, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 rounded-xl text-[10px] font-black uppercase bg-slate-50 text-slate-600 border border-slate-100"
                                  >
                                    {r.pad}: {r.diagnosis}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-8 py-5 text-sm font-bold text-slate-500">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {item.date || ""} {item.time || ""}
                          </div>
                        </td>

                        <td className="px-8 py-5">
                          <span
                            className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1 rounded-full border w-fit ${badge.cls}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${badge.dot}`} />
                            {badge.text}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => navigate(`/report/${item.id}`)}
                            className="p-2 transition-all bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl"
                            title="View report"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Activity size={48} className="text-slate-200" />
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                          No test records found
                        </p>
                        <button
                          onClick={() => navigate("/analysis")}
                          className="text-sm font-black text-blue-500 hover:underline"
                        >
                          START YOUR FIRST TEST →
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

export default UrineDashboard;