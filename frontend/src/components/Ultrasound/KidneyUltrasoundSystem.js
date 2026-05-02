import React, { useState, useRef, useEffect } from "react";
import {
  Upload, ArrowLeft, ArrowRight, UserPlus, Loader2,
  Activity, Download, Calendar, ShieldCheck
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAnalysis } from "./AnalysisContext";

const PatientDetailsForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    age: "",
    gender: "Male",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    try {
      localStorage.removeItem('nephrosense_history');
    } catch (e) {
      console.error("Storage clear error", e);
    }

    const autoId = "PAT-" + Math.floor(10000 + Math.random() * 90000);
    setFormData(prev => ({ ...prev, patientId: autoId }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.patientName && formData.patientId && formData.age) onNext(formData);
    else alert("Please fill in all details");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-100">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl border border-slate-200">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl" style={{ color: '#0F6F5C', backgroundColor: '#E0F2ED' }}>
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Registration</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Patient Full Name</label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} style={{ focusRing: `2px solid #0F6F5C` }} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Patient ID (Auto-Generated)</label>
            <input type="text" className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl outline-none font-mono font-bold" style={{ color: '#0F6F5C' }} value={formData.patientId} readOnly />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Age</label>
              <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" onChange={(e) => setFormData({ ...formData, age: e.target.value })} style={{ focusRing: `2px solid #0F6F5C` }} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" style={{ focusRing: `2px solid #0F6F5C` }} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Examination Date</label>
            <input type="date" value={formData.date} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" style={{ focusRing: `2px solid #0F6F5C` }} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <button type="submit" className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all mt-4" style={{ backgroundColor: '#0F6F5C' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#085A4A'} onMouseLeave={(e) => e.target.style.backgroundColor = '#0F6F5C'}>
            Proceed to Analysis <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

const UploadKidneyImage = ({ onNext, onBack }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreviewUrl(URL.createObjectURL(f)); }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-100">
      <div className="w-full max-w-xl p-10 text-center bg-white shadow-2xl rounded-3xl border border-slate-200">
        <button onClick={onBack} className="flex items-center mb-6 font-medium transition-all" style={{ color: '#6B7280' }} onMouseEnter={(e) => e.target.style.color = '#0F6F5C'} onMouseLeave={(e) => e.target.style.color = '#6B7280'}>
          <ArrowLeft size={18} className="mr-1" /> Back to Registration
        </button>
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Upload Ultrasound Scan</h1>
        <p className="mb-8 text-slate-500">Provide a high-quality ultrasound image for kidney tissue analysis</p>
        <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 bg-slate-50 transition-all cursor-pointer relative group" style={{ borderColor: 'rgb(209, 213, 219)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0F6F5C'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgb(209, 213, 219)'}>
          <input type="file" id="file" hidden onChange={handleFileSelect} />
          <label htmlFor="file" className="cursor-pointer">
            {previewUrl ? <img src={previewUrl} className="mx-auto shadow-md max-h-64 rounded-xl border-4 border-white" alt="Preview" /> : <div className="py-10 flex flex-col items-center gap-4">
              <Upload size={48} className="transition-colors" style={{ color: 'rgb(209, 213, 219)' }} onMouseEnter={(e) => e.target.style.color = '#0F6F5C'} onMouseLeave={(e) => e.target.style.color = 'rgb(209, 213, 219)'} />
              <span className="font-bold text-slate-400">Select Image to Upload</span>
            </div>}
          </label>
        </div>
        {previewUrl && (
          <button onClick={() => onNext({ file: file })} className="w-full mt-8 text-white py-4 rounded-xl font-bold shadow-xl transition-all" style={{ backgroundColor: '#0F6F5C' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#085A4A'} onMouseLeave={(e) => e.target.style.backgroundColor = '#0F6F5C'}>
            Generate Medical Report
          </button>
        )}
      </div>
    </div>
  );
};

const CKDStagePrediction = ({ testData }) => {
  const reportRef = useRef();

  const getSeverityColor = (diag) => {
    if (!diag) return "#dc2626";
    const d = diag.toLowerCase();
    if (d.includes("healthy") || d.includes("normal")) return "#0F6F5C";
    if (d.includes("mild")) return "#d97706";
    return "#dc2626";
  };

  const getReferenceRange = (diag) => {
    if (!diag) return "Clinical Abnormality";
    const d = diag.toLowerCase();
    if (d.includes("healthy") || d.includes("normal")) return "Normal / Physiological";
    return "Clinical Abnormality";
  };

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Kidney_Analysis_Report_${testData.patientId}.pdf`);
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-200 min-h-screen">
      <div ref={reportRef} className="w-[210mm] min-h-[297mm] p-16 bg-white shadow-2xl font-sans text-slate-900 flex flex-col">

        <div className="flex justify-between items-start pb-8 mb-10" style={{ borderBottom: `4px solid #0F6F5C` }}>
          <div>
            <h1 className="text-4xl font-black tracking-tighter" style={{ color: '#0F6F5C' }}>KIDNEY SCAN AI</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Autonomous Diagnostic Laboratory</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase">Analysis ID: #{testData.id}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Date: {testData.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-sm"><b>PATIENT NAME:</b> <span className="text-slate-600 ml-2">{testData.patientName}</span></p>
          <p className="text-sm"><b>PATIENT ID:</b> <span className="text-slate-600 ml-2">{testData.patientId}</span></p>
          <p className="text-sm"><b>AGE:</b> <span className="text-slate-600 ml-2">{testData.age} Years</span></p>
          <p className="text-sm"><b>GENDER:</b> <span className="text-slate-600 ml-2">{testData.gender}</span></p>
          <p className="text-sm"><b>STUDY TYPE:</b> <span className="text-slate-600 ml-2">Kidney Tissue Segmentation</span></p>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} style={{ color: '#0F6F5C' }} />
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">I. RADIOLOGICAL SEGMENTATION RESULT</h2>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl text-center shadow-inner">
            <img src={testData.image} className="inline-block max-h-80 rounded-lg border border-slate-700" alt="Segmented Result" />
            <p className="text-[10px] text-slate-500 mt-4 italic font-medium">Visualization of cortical thickness and density mapping as identified by the AI system.</p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} style={{ color: '#0F6F5C' }} />
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">II. QUANTITATIVE ANALYSIS</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 text-slate-500 text-left text-[10px] font-black uppercase tracking-widest">
                <th className="p-4 rounded-tl-xl">ASSESSMENT PARAMETER</th>
                <th className="p-4">OBSERVED VALUE</th>
                <th className="p-4 rounded-tr-xl">REFERENCE STATUS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-50">
                <td className="p-4 font-bold text-slate-700">Cortical Thickness (Max)</td>
                <td className="p-4">{testData.maxCortex}</td>
                <td className="p-4 text-slate-400">8.0 mm - 12.5 mm</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="p-4 font-bold text-slate-700">Cortical Thickness (Min)</td>
                <td className="p-4">{testData.minCortex}</td>
                <td className="p-4 text-slate-400"> {">"} 7.0 mm</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="p-4 font-bold text-slate-700">AI Diagnostic Interpretation</td>
                <td className="p-4 font-black uppercase" style={{ color: getSeverityColor(testData.diagnosis) }}>
                  {testData.diagnosis || "Pending"}
                </td>
                <td className="p-4 font-bold" style={{ color: getSeverityColor(testData.diagnosis) }}>
                  {getReferenceRange(testData.diagnosis)}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700">Segmentation Confidence</td>
                <td className="p-4">{testData.confidence}</td>
                <td className="p-4 text-slate-400"> {">"} 90% (High)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-8 rounded-3xl mb-12" style={{ backgroundColor: 'rgba(15, 111, 92, 0.05)', borderColor: 'rgba(15, 111, 92, 0.2)', borderWidth: '1px' }}>
          <h3 className="text-xs font-black uppercase mb-3" style={{ color: '#0F6F5C' }}>III. CLINICAL IMPRESSION</h3>
          <p className="text-sm leading-relaxed text-slate-700">
            Automated analysis indicates findings consistent with <b style={{ color: getSeverityColor(testData.diagnosis) }}>{testData.diagnosis || "the condition"}</b>.
            The segmentation reveals a maximum cortical thickness of {testData.maxCortex} and a severity score of <b>{testData.severityScore || "N/A"}</b> based on tissue density mapping.
            Final clinical correlation by a nephrologist is recommended for definitive care planning.
          </p>
        </div>

        <div className="mt-auto pt-10 flex justify-between items-end border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: '#0F6F5C' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-900 leading-tight">AI Verified Report</p>
              <p className="text-[9px] text-slate-400">KidneyScan AI Core v2.4</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-48 h-px bg-slate-300 mb-3 ml-auto"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Authorized Digital Signature</p>
            <p className="text-[9px] text-slate-400 uppercase">Radiological Imaging Center / Autonomous</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10 pb-20">
        <button onClick={downloadPDF} className="flex items-center gap-2 px-10 py-5 text-sm font-bold text-white uppercase rounded-2xl shadow-2xl transition-all" style={{ backgroundColor: '#0F6F5C' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#085A4A'} onMouseLeave={(e) => e.target.style.backgroundColor = '#0F6F5C'}>
          <Download size={20} /> Export Medical PDF
        </button>
        <button onClick={() => window.location.reload()} className="px-10 py-5 text-sm font-bold text-slate-900 border-2 border-slate-200 uppercase rounded-2xl hover:bg-white shadow-lg transition-all">
          New Case Study
        </button>
      </div>
    </div>
  );
};

const KidneyUltrasoundSystem = () => {
  const [step, setStep] = useState("patient");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAnalysisHistory, addAnalysis } = useAnalysis();

  const handlePredict = async (uploadData) => {
    setLoading(true);
    const formDataPayload = new FormData();
    formDataPayload.append('file', uploadData.file);

    try {
      const response = await fetch('http://localhost:8080/api/ultrasound/api/predict', { method: 'POST', body: formDataPayload });
      const result = await response.json();

      if (response.ok) {
        const newReport = {
          id: Math.floor(100000 + Math.random() * 900000),
          patientId: data.patientId,
          patientName: data.patientName,
          age: data.age,
          gender: data.gender,
          date: data.date,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          maxCortex: result.max_thickness,
          minCortex: result.min_thickness,
          severityScore: result.severity_score,
          image: result.segmented_image,
          status: "completed"
        };

        setData(newReport);
        setStep("prediction");

        if (addAnalysis) {
          addAnalysis(newReport);
        } else if (setAnalysisHistory) {
          setAnalysisHistory(prev => [newReport, ...(prev || [])]);
        }
      }
    } catch (err) {
      alert("System Offline: Ensure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-slate-900/95 backdrop-blur-xl">
          <Loader2 className="mb-6 animate-spin" size={64} style={{ color: '#0F6F5C' }} />
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Analyzing Kidney Tissue...</h2>
          <p className="text-slate-500 mt-3 font-medium">Measuring cortical metrics and performing segmentation</p>
        </div>
      )}
      <div className="w-full">
        {step === "patient" && <PatientDetailsForm onNext={(d) => { setData(d); setStep("upload"); }} />}
        {step === "upload" && <UploadKidneyImage onNext={handlePredict} onBack={() => setStep("patient")} />}
        {step === "prediction" && <CKDStagePrediction testData={data} />}
      </div>
    </div>
  );
};

export default KidneyUltrasoundSystem;