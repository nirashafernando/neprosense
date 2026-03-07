import React, { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "./AnalysisContext";
import {
  Upload,
  Activity,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Droplet,
  X,
  Download,
  Loader2,
  ShieldCheck,
  FileText,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const UrineDashboard = () => {
  const navigate = useNavigate();
  const { analysisHistory } = useAnalysis();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  const stats = useMemo(() => {
    const total = analysisHistory.length;
    const completed = analysisHistory.filter(
      (a) => a.status === "completed" || (a.results && a.results.length > 0),
    ).length;
    const pending = Math.max(0, total - completed);
    const positives = analysisHistory.filter(
      (a) =>
        a.results?.some((m) => m.status === "ABNORMAL") ||
        a.summary?.includes("RISK"),
    ).length;

    return { total, completed, pending, positives };
  }, [analysisHistory]);

  const handleDownload = async () => {
    if (!selectedReport) return;
    setIsDownloading(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        210,
        (canvas.height * 210) / canvas.width,
      );
      pdf.save(`NephroSense_Report_${selectedReport.patientName}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
    setIsDownloading(false);
  };

  const badgeFor = (item) => {
    const risk = item.summary || "";
    const abnormalCount =
      item.results?.filter((m) => m.status === "ABNORMAL").length || 0;

    if (risk.includes("HIGH") || abnormalCount >= 5) {
      return {
        text: "CRITICAL",
        cls: "bg-rose-100 text-rose-700 border-rose-200",
        dot: "bg-rose-600",
      };
    }

    if (
      risk.includes("MODERATE") ||
      risk.includes("MILD") ||
      (abnormalCount >= 1 && abnormalCount <= 4)
    ) {
      return {
        text: "MILD RISK",
        cls: "bg-orange-50 text-orange-700 border-orange-100",
        dot: "bg-orange-500",
      };
    }

    return {
      text: "NORMAL",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
      dot: "bg-emerald-500",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Welcome Header */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-medical-600 to-medical-700 p-3 rounded-xl shadow-lg">
                    <Activity
                      className="w-7 h-7 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      Urine Test Analysis Dashboard
                    </h1>
                    <p className="text-slate-600 mt-0.5 text-sm">
                      Clinical Urinalysis History & Risk Monitoring
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Tests",
                value: stats.total,
                icon: Activity,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                title: "Completed",
                value: stats.completed,
                icon: CheckCircle,
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                title: "Pending",
                value: stats.pending,
                icon: AlertCircle,
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                title: "Risk Detected",
                value: stats.positives,
                icon: TrendingUp,
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-medical-600 via-medical-700 to-teal-600 rounded-xl shadow-xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  New Urinalysis Screening
                </h2>
                <p className="text-medical-100 mb-6 text-sm md:text-base">
                  Compare 10 biomarkers against clinical thresholds to evaluate
                  kidney health status.
                </p>
                <button
                  onClick={() => navigate("/urine/urineanalysis")}
                  className="bg-white text-medical-700 px-6 py-3 rounded-lg font-bold hover:bg-medical-50 transition-all shadow-lg flex items-center gap-2 text-base group"
                >
                  <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Start Analysis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                  <Droplet className="w-20 h-20 text-white opacity-80" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Diagnostic Registry
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Clinical urinalysis history &amp; risk monitoring
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                    <th className="px-8 py-5">Patient Profile</th>
                    <th className="px-8 py-5 text-center">
                      AI Risk Assessment
                    </th>
                    <th className="px-8 py-5 text-center">Last Updated</th>
                    <th className="px-8 py-5 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {analysisHistory.length > 0 ? (
                    analysisHistory.map((item) => {
                      const badge = badgeFor(item);
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${badge.text === "CRITICAL" ? "bg-rose-50 text-rose-500" : "bg-slate-100 text-slate-500"}`}
                              >
                                {item.patientName?.[0]}
                              </div>
                              <div>
                                <p className="font-black text-slate-800 uppercase text-sm tracking-tighter mb-1 leading-none">
                                  {item.patientName}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                  {item.age}Y / {item.gender} • {item.patientId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span
                              className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-full border ${badge.cls} uppercase tracking-widest`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                              />
                              {badge.text}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-center text-slate-500 text-xs font-bold uppercase tracking-tighter">
                            <div className="flex flex-col items-center">
                              <span className="flex items-center gap-1 text-slate-600 mb-1 leading-none">
                                <Clock size={12} /> {item.date}
                              </span>
                              <span className="opacity-50 text-[10px]">
                                {item.time}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => setSelectedReport(item)}
                              className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                            >
                              <Eye size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-24 text-center text-slate-300 font-black uppercase tracking-widest text-xs"
                      >
                        No clinical records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[3rem] shadow-2xl relative border border-white/20">
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-10 py-5 border-b flex justify-between items-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg hover:bg-green-700 transition-all"
              >
                {isDownloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}{" "}
                Download PDF
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-3 bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div
              ref={reportRef}
              className="p-16 text-left text-slate-900 bg-white relative"
            >
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-12 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-black tracking-tighter uppercase">
                      N
                    </div>
                    <h1 className="text-2xl font-black text-green-900 tracking-tighter leading-none uppercase">
                      NEPROSENSE AI
                    </h1>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    Colorimetric Diagnostics System
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
                    CLINICAL REPORT
                  </h2>
                  <p className="font-mono text-lg font-bold text-slate-400 uppercase tracking-tighter">
                    REF: {selectedReport.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-8 mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                    Patient Profile
                  </label>
                  <span className="text-base font-black text-slate-800 uppercase tracking-tighter leading-none">
                    {selectedReport.patientName}
                  </span>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                    Age / Sex
                  </label>
                  <span className="text-base font-black text-slate-800 uppercase tracking-tighter leading-none">
                    {selectedReport.age}Y / {selectedReport.gender}
                  </span>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                    Test Date
                  </label>
                  <span className="text-base font-black text-slate-800 uppercase tracking-tighter leading-none">
                    {selectedReport.date}
                  </span>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                    Verification
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black uppercase inline-flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={12} /> AI VERIFIED
                  </span>
                </div>
              </div>

              <h3 className="text-xs font-black text-slate-800 uppercase border-b-2 border-slate-900 pb-2 mb-8 flex items-center gap-2">
                <FileText size={16} /> Diagnostic Biomarker Findings
              </h3>
              <table className="w-full text-left mb-12 border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase border-b">
                    <th className="py-4 px-2">Biomarker Parameter</th>
                    <th className="py-4 px-2 text-center">Observation</th>
                    <th className="py-4 px-2 text-center">
                      Normal Range (Ref)
                    </th>
                    <th className="py-4 px-2 text-right">Clinical Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-left">
                  {selectedReport.results?.map((m, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-2 text-sm font-bold text-slate-700 uppercase tracking-tighter leading-none">
                        {m.pad}
                      </td>
                      <td
                        className={`py-4 px-2 text-sm font-black text-center font-mono uppercase tracking-tighter leading-none ${m.status === "ABNORMAL" ? "text-rose-600" : "text-blue-700"}`}
                      >
                        {m.diagnosis}
                      </td>
                      <td className="py-4 px-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">
                        {m.normal_range || "Negative"}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span
                          className={`text-[9px] font-black px-3 py-1 rounded-sm uppercase tracking-tighter leading-none ${m.status === "ABNORMAL" ? "bg-rose-600 text-white shadow-md" : "bg-emerald-100 text-emerald-700"}`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                className={`p-10 rounded-[2.5rem] border-2 flex items-center justify-between shadow-xl transition-all ${selectedReport.summary?.includes("HIGH") ? "bg-rose-50 border-rose-100 scale-[1.01]" : "bg-emerald-50 border-emerald-100"}`}
              >
                <div>
                  <h4
                    className={`text-xs font-black uppercase mb-1 tracking-tighter ${selectedReport.summary?.includes("HIGH") ? "text-rose-400" : "text-emerald-500"}`}
                  >
                    AI Critical Risk Assessment
                  </h4>
                  <p
                    className={`text-4xl font-black uppercase tracking-tighter leading-none ${selectedReport.summary?.includes("HIGH") ? "text-rose-700" : "text-emerald-700"}`}
                  >
                    {selectedReport.summary || "NORMAL PHYSIOLOGY"}
                  </p>
                </div>
                <Activity
                  size={48}
                  className={
                    selectedReport.summary?.includes("HIGH")
                      ? "text-rose-600 animate-pulse"
                      : "text-emerald-600"
                  }
                />
              </div>

              <footer className="mt-16 border-t pt-8 text-left text-slate-800">
                <p className="text-[10px] font-black uppercase mb-2 tracking-tighter leading-none">
                  Clinical Interpretation Note:
                </p>
                <p className="text-[9px] text-slate-400 italic leading-relaxed max-w-3xl">
                  A "Negative" result indicates that the biomarker level is
                  below the clinical detection threshold (Reference Range)
                  established for healthy individuals. Final medical diagnosis
                  must be confirmed by a healthcare professional.
                </p>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrineDashboard;
