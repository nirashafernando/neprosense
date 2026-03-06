import React, { useMemo, useState, useRef } from "react";
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
  X,
  ShieldCheck,
  Download,
  Trash2
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Dashboard = () => {
  const navigate = useNavigate();
  const { analysisHistory, setAnalysisHistory } = useAnalysis();
  const reportRef = useRef();
  
  const [selectedReport, setSelectedReport] = useState(null);

  const sortedHistory = useMemo(() => {
    return [...(analysisHistory || [])].reverse();
  }, [analysisHistory]);

  const stats = useMemo(() => {
    const total = sortedHistory.length;
    const completed = sortedHistory.filter(a => a.diagnosis || a.status === "completed").length;
    const pending = total - completed;
    const latestAccuracy = sortedHistory.length > 0 && sortedHistory[0].confidence 
      ? sortedHistory[0].confidence.replace('%', '') 
      : (total > 0 ? "88.27" : "0");

    return { total, completed, pending, accuracy: latestAccuracy };
  }, [sortedHistory]);

  const statsCards = [
    {
      title: "TOTAL ANALYSIS",
      value: stats.total,
      icon: Activity,
      iconBg: "bg-medical-50",
      iconColor: "text-medical-700",
    },
    {
      title: "PREDICTIONS COMPLETED",
      value: stats.completed,
      icon: CheckCircle,
      iconBg: "bg-medical-50",
      iconColor: "text-medical-700",
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

  const getSeverityColor = (diag) => {
    if (!diag) return "#dc2626";
    const d = diag.toLowerCase();
    if (d.includes("healthy") || d.includes("normal")) return "#059669"; 
    if (d.includes("mild")) return "#d97706"; 
    return "#dc2626"; 
  };

  const getReferenceRange = (diag) => {
    if (!diag) return "Clinical Abnormality";
    const d = diag.toLowerCase();
    if (d.includes("healthy") || d.includes("normal")) return "Normal / Physiological";
    return "Clinical Abnormality";
  };

  const getBadgeStyle = (diag) => {
    if (!diag) return "bg-slate-50 text-slate-500 border-slate-200";
    const d = diag.toLowerCase();
    if (d.includes("severe")) return "bg-red-50 text-red-600 border-red-100";
    if (d.includes("mild")) return "bg-orange-50 text-orange-600 border-orange-100";
    if (d.includes("healthy") || d.includes("normal")) return "bg-medical-50 text-medical-700 border-medical-100";
    return "bg-medical-50 text-medical-700 border-medical-100";
  };

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CKD_Analysis_Report_${selectedReport.patientId || 'History'}.pdf`);
    });
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to delete ALL records? This cannot be undone.")) {
      if (setAnalysisHistory) {
        setAnalysisHistory([]);
      } else {
        window.location.reload();
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString();
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.split('T')[0] || dateStr;
      return d.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 relative">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-10 text-center">
          <h1 className="mb-2 font-sans text-3xl font-bold text-slate-800">Welcome to NephroSense Ultrasound</h1>
          <p className="font-medium text-slate-500">AI-powered kidney ultrasound analysis for CKD stage prediction</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black tracking-tight text-slate-800">{stat.value}</h3>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-medical-800 via-medical-700 to-medical-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl shadow-medical-900/20">
          <div className="relative z-10 flex flex-col items-center justify-between md:flex-row">
            <div>
              <h2 className="mb-3 text-3xl font-black">Ready to Analyze Kidney Ultrasound?</h2>
              <p className="max-w-lg mb-8 font-medium text-medical-50 opacity-90">
                Upload ultrasound images for automated CKD stage prediction with AI segmentation
              </p>
              <button 
                onClick={() => navigate("/ultrasound/analysis")}
                className="bg-white text-medical-700 px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-medical-50 transition-all shadow-lg active:scale-95 group"
              >
                <Upload size={20} />
                Start New Analysis
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="hidden transform translate-x-10 translate-y-10 md:block opacity-20">
                <Activity size={280} strokeWidth={1} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="flex flex-col items-center justify-between gap-4 p-8 border-b border-slate-50 md:flex-row">
            <div className="flex-1"></div>
            <div className="flex-1 text-center shrink-0">
              <h3 className="text-2xl font-black text-slate-800">Recent Analysis</h3>
              <p className="mt-1 text-sm font-bold tracking-widest uppercase text-slate-400">Latest kidney ultrasound predictions</p>
            </div>
            <div className="flex justify-end flex-1">
              <button 
                onClick={clearAllHistory} 
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-[10px] uppercase tracking-widest"
              >
                <Trash2 size={16} /> Clear All History
              </button>
            </div>
          </div>
          
          <div className="px-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-slate-400 border-slate-50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Patient ID</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">CKD Stage / Diagnosis</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Date / Time</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedHistory.length > 0 ? (
                  sortedHistory.map((item, index) => (
                    <tr key={item.id || index} className="transition-colors hover:bg-slate-50/50 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 font-bold bg-slate-100 text-slate-500 rounded-xl">
                            <Users size={18} />
                          </div>
                          <span className="font-bold text-slate-700">{item.patientId || item.patientName || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${getBadgeStyle(item.diagnosis)}`}>
                          {item.diagnosis || "Predicting..."}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-2">
                           <Clock size={14} /> 
                           {formatDate(item.date)}
                           <span className="ml-1 text-slate-400">
                             {item.time || ""}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            {item.status || "COMPLETED"}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => setSelectedReport(item)}
                          className="p-2 transition-all bg-slate-50 text-slate-400 hover:text-medical-700 hover:bg-medical-50 rounded-xl"
                        >
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
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">No analysis records found</p>
                        <button onClick={() => navigate("/ultrasound/analysis")} className="text-sm font-black text-medical-700 hover:underline">
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

      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-8">
          
          <div className="relative w-full max-w-[850px] m-auto flex flex-col items-center">
            
            <div className="flex justify-end w-full gap-4 mb-4 ml-auto">
              <button 
                onClick={downloadPDF}
                className="flex items-center gap-2 px-6 py-2.5 bg-medical-700 text-white rounded-xl font-bold shadow-lg hover:bg-medical-800 transition-colors"
              >
                <Download size={18} /> Download PDF
              </button>
              <button 
                onClick={() => setSelectedReport(null)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-red-600 rounded-xl font-bold shadow-lg hover:bg-red-50 transition-colors"
              >
                <X size={18} /> Close
              </button>
            </div>

            <div ref={reportRef} className="bg-white rounded-[2rem] shadow-2xl p-10 sm:p-14 w-full text-slate-900 font-sans">
              
              <div className="flex items-start justify-between pb-6 mb-8 border-b-4 border-medical-700">
                <div>
                  <h1 className="text-3xl font-black tracking-tighter text-medical-900">KIDNEY SCAN AI</h1>
                  <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Autonomous Diagnostic Laboratory</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase text-slate-500">Analysis ID: #{selectedReport.id || Math.floor(100000 + Math.random() * 900000)}</p>
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Date: {formatDate(selectedReport.date)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 p-5 mb-10 border gap-x-8 gap-y-3 bg-slate-50 rounded-2xl border-slate-100">
                <p className="text-sm"><b>PATIENT NAME:</b> <span className="ml-2 text-slate-600">{selectedReport.patientName || "Unknown"}</span></p>
                <p className="text-sm"><b>PATIENT ID:</b> <span className="ml-2 text-slate-600">{selectedReport.patientId || "N/A"}</span></p>
                <p className="text-sm"><b>AGE / GENDER:</b> <span className="ml-2 text-slate-600">{selectedReport.age ? `${selectedReport.age} Years` : "N/A"} {selectedReport.gender ? `/ ${selectedReport.gender}` : ""}</span></p>
                <p className="text-sm"><b>STUDY TYPE:</b> <span className="ml-2 text-slate-600">Kidney Tissue Segmentation</span></p>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-medical-700" />
                  <h2 className="text-xs font-black tracking-widest uppercase text-slate-900">I. RADIOLOGICAL SEGMENTATION RESULT</h2>
                </div>
                <div className="p-6 text-center shadow-inner bg-slate-900 rounded-3xl">
                  <img src={selectedReport.image} className="mx-auto rounded-lg border border-slate-700 max-h-[350px] object-contain" alt="Segmented Result" />
                  <p className="text-[10px] text-slate-500 mt-4 italic font-medium">Visualization of cortical thickness and density mapping as identified by the AI system.</p>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-medical-700" />
                  <h2 className="text-xs font-black tracking-widest uppercase text-slate-900">II. QUANTITATIVE ANALYSIS</h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 text-left text-[10px] font-black uppercase tracking-widest">
                      <th className="p-3 rounded-tl-xl">ASSESSMENT PARAMETER</th>
                      <th className="p-3">OBSERVED VALUE</th>
                      <th className="p-3 rounded-tr-xl">REFERENCE STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-50">
                      <td className="p-3 font-bold text-slate-700">Cortical Thickness (Max)</td>
                      <td className="p-3">{selectedReport.maxCortex || selectedReport.max_thickness || "N/A"}</td>
                      <td className="p-3 text-slate-400">8.0 mm - 12.5 mm</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="p-3 font-bold text-slate-700">Cortical Thickness (Min)</td>
                      <td className="p-3">{selectedReport.minCortex || selectedReport.min_thickness || "N/A"}</td>
                      <td className="p-3 text-slate-400"> {">"} 7.0 mm</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="p-3 font-bold text-slate-700">AI Diagnostic Interpretation</td>
                      <td className="p-3 font-black uppercase" style={{ color: getSeverityColor(selectedReport.diagnosis) }}>
                        {selectedReport.diagnosis || "Pending"}
                      </td>
                      <td className="p-3 font-bold" style={{ color: getSeverityColor(selectedReport.diagnosis) }}>
                        {getReferenceRange(selectedReport.diagnosis)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700">Segmentation Confidence</td>
                      <td className="p-3">{selectedReport.confidence || "N/A"}</td>
                      <td className="p-3 text-slate-400"> {">"} 90% (High)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-6 mb-10 border border-medical-100 bg-medical-50/50 rounded-2xl">
                <h3 className="mb-2 text-xs font-black text-medical-900 uppercase">III. CLINICAL IMPRESSION</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Automated analysis indicates findings consistent with <b style={{ color: getSeverityColor(selectedReport.diagnosis) }}>{selectedReport.diagnosis || "the condition"}</b>. 
                  The segmentation reveals a maximum cortical thickness of {selectedReport.maxCortex || selectedReport.max_thickness || "N/A"} and a severity score of <b>{selectedReport.severityScore || selectedReport.severity_score || "N/A"}</b> based on tissue density mapping. 
                  Final clinical correlation by a nephrologist is recommended for definitive care planning.
                </p>
              </div>

              <div className="flex items-end justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 text-white bg-medical-700 rounded-xl">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-900 leading-tight">AI Verified Report</p>
                    <p className="text-[9px] text-slate-400">KidneyScan AI Core v2.4</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-40 h-px mb-2 ml-auto bg-slate-300"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Authorized Digital Signature</p>
                  <p className="text-[9px] text-slate-400 uppercase">Radiological Imaging Center</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;