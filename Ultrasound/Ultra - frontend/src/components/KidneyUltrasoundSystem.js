import React, { useState, useRef } from "react";
import {
  Upload, ArrowLeft, ArrowRight, UserPlus, Loader2,
  Activity, Download, Calendar
} from "lucide-react"; 
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAnalysis } from "./AnalysisContext";


const PatientDetailsForm = ({ onNext }) => {
  const [formData, setFormData] = useState({ 
    patientName: "", 
    patientId: "", 
    age: "",
    date: new Date().toISOString().split('T')[0] 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.patientName && formData.patientId && formData.age) onNext(formData);
    else alert("Please fill in all details");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-3xl border border-slate-100">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-emerald-600 bg-emerald-100 rounded-2xl rotate-3">
            <UserPlus size={40} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Patient Registration</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
            <input type="text" placeholder="Ex: Kamal Perera" className="w-full p-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" onChange={(e) => setFormData({...formData, patientName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Patient ID</label>
              <input type="text" placeholder="PID-001" className="w-full p-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" onChange={(e) => setFormData({...formData, patientId: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Age</label>
              <input type="number" placeholder="45" className="w-full p-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" onChange={(e) => setFormData({...formData, age: e.target.value})} required />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Analysis Date</label>
            <div className="relative">
              <input type="date" value={formData.date} className="w-full p-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none" onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              <Calendar className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2 transition-all mt-4">
            Next Step <ArrowRight size={20} />
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
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-50">
      <div className="w-full max-w-xl p-10 text-center bg-white shadow-xl rounded-3xl border border-slate-100">
        <button onClick={onBack} className="flex items-center mb-6 transition-colors text-slate-400 hover:text-slate-600">
          <ArrowLeft size={18} className="mr-1"/> Back
        </button>
        <h1 className="mb-6 text-2xl font-black text-slate-800">Upload Ultrasound</h1>
        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 hover:border-blue-400 transition-all cursor-pointer relative">
          <input type="file" id="file" hidden onChange={handleFileSelect} />
          <label htmlFor="file" className="cursor-pointer">
            {previewUrl ? <img src={previewUrl} className="mx-auto shadow-md max-h-64 rounded-2xl" alt="Preview" /> : <div className="py-10 font-bold text-slate-400">Click to Browse or Drag Image</div>}
          </label>
        </div>
        {previewUrl && (
          <button onClick={() => onNext({ image: previewUrl, file: file })} className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all">
            Start AI Analysis
          </button>
        )}
      </div>
    </div>
  );
};


const CKDStagePrediction = ({ testData }) => {
  const reportRef = useRef();
  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Report_${testData.patientId}.pdf`);
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-slate-100 min-h-screen">
      <div ref={reportRef} className="w-full max-w-2xl p-10 mb-8 bg-white border-t-[12px] border-emerald-600 shadow-2xl rounded-sm">
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-800">Kidney Analysis Report</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Clinical AI Diagnostic</p>
          </div>
          <Activity className="text-emerald-600" size={32} />
        </div>
        <div className="grid grid-cols-2 gap-6 p-6 mb-8 border bg-slate-50 rounded-2xl border-slate-100">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</h3>
            <p className="text-sm"><b>Name:</b> {testData.patientName}</p>
            <p className="text-sm"><b>ID:</b> {testData.patientId}</p>
            <p className="text-sm"><b>Age:</b> {testData.age}</p>
            <p className="text-sm"><b>Date:</b> {testData.date}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-white border shadow-sm rounded-xl border-emerald-100">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">AI Diagnosis</h3>
            <div className="text-xl font-black text-emerald-700">{testData.diagnosis}</div>
            <p className="text-[10px] font-bold text-emerald-500">Confidence: {testData.confidence}%</p>
          </div>
        </div>
        <div className="p-4 mb-8 text-center bg-black rounded-2xl">
          <img src={testData.image} className="inline-block max-h-60 rounded-lg border border-white/20" alt="Annotated" />
        </div>
        <div className="space-y-4">
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
              <span className="font-medium text-slate-500">Cortex thickness (Max)</span>
              <span className="font-bold text-slate-800">{testData.maxCortex} mm</span>
           </div>
           <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
              <span className="font-medium text-slate-500">Cortex thickness (Avg)</span>
              <span className="font-bold text-slate-800">{testData.avgCortex} mm</span>
           </div>
           <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl text-[11px] text-amber-800">
              <b>Recommendation:</b> Please consult a specialist for clinical correlation.
           </div>
        </div>
      </div>
      <div className="flex gap-4 pb-10">
        <button onClick={downloadPDF} className="flex items-center gap-2 px-8 py-4 text-xs font-bold text-white transition-all uppercase bg-emerald-600 rounded-2xl hover:bg-emerald-700 shadow-xl">
          <Download size={18} /> Download PDF
        </button>
        <button onClick={() => window.location.reload()} className="px-8 py-4 text-xs font-bold text-white transition-all uppercase bg-slate-800 rounded-2xl hover:bg-slate-900">
          New Entry
        </button>
      </div>
    </div>
  );
};


const KidneyUltrasoundSystem = () => {
  const [step, setStep] = useState("patient");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { addAnalysis } = useAnalysis();

  const handlePredict = async (uploadData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadData.file);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok) {
        const fullResult = {
          patientName: data.patientName,
          patientId: data.patientId,
          age: data.age,
          date: data.date,
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          maxCortex: result.max_cortex,
          avgCortex: result.avg_cortex,
          image: result.segmented_image,
          time: new Date().toLocaleTimeString(),
          id: Date.now(),
          status: "completed" 
        };

        setData(fullResult);
        addAnalysis(fullResult);
        setStep("prediction");
      }
    } catch (err) {
      alert("Backend error connecting. Check if your Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full overflow-y-auto">
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-slate-900/80 backdrop-blur-md">
          <Loader2 className="mb-4 animate-spin" size={60} />
          <p className="text-xl font-black tracking-widest uppercase animate-pulse">Analyzing Kidney Tissue...</p>
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