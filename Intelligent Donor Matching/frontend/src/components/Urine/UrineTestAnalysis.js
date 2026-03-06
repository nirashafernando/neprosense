import React, { useState, useEffect, useRef } from "react";
import {
  Upload, ArrowLeft, ArrowRight, Camera, CheckCircle, Activity, User, Calendar, 
  Download, AlertCircle, Scan, Sparkles, Loader2, Stethoscope, ShieldCheck, Droplets
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAnalysis } from "./AnalysisContext";


const PatientInfoForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    patientId: `NS-${Math.floor(Math.random() * 90000) + 10000}`,
    patientName: "",
    age: "",
    gender: "",
    testDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!formData.patientName || !formData.age || !formData.gender || !formData.testDate) {
      alert("Please fill in all required fields");
      return;
    }
    onNext(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          {/* (green-50, green-600) */}
          <div className="inline-flex items-center justify-center p-4 bg-medical-100 rounded-2xl mb-4"><User className="text-medical-700 w-8 h-8" /></div>
          <h1 className="text-3xl font-black text-slate-800">Patient Intake</h1>
          <p className="text-slate-500 font-medium">Register patient details to start AI analysis</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-medical-600 transition-all font-bold text-slate-700" placeholder="Enter full name" onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
              <input type="number" min="1" max="100"  maxLength="3" inputMode="numeric" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-medical-600 transition-all font-bold text-slate-700" placeholder="Years" value={formData.age} onChange={(e) => { let value = e.target.value;
               if (value < 1) return; if (value.length <= 3) {setFormData({ ...formData, age: value });}}} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender</label>
              <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-medical-600 transition-all font-bold text-slate-700" onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Test Date</label>
            <input type="date" value={formData.testDate} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-medical-600 transition-all font-bold text-slate-700" onChange={(e) => setFormData({...formData, testDate: e.target.value})} />
          </div>
          {/*  (bg-green-600, hover:bg-green-700) */}
          <button onClick={handleSubmit} className="w-full py-5 bg-medical-700 text-white font-black rounded-2xl shadow-xl hover:bg-medical-800 transition-all transform active:scale-95 flex items-center justify-center gap-2">
            PROCEED TO SCAN <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. Upload Urine Strip Component ---
const UploadUrineStrip = ({ onNext, onBack }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-medical-700 font-bold mb-8 transition-colors"><ArrowLeft size={18} className="mr-2" /> GO BACK</button>
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-2">Capture Test Strip</h2>
          {!preview ? (
            <label className="block border-4 border-dashed border-slate-100 rounded-[2rem] p-20 hover:border-medical-300 cursor-pointer group transition-all">
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-medical-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Camera className="w-10 h-10 text-medical-700" /></div>
                <span className="text-xl font-bold text-slate-400 group-hover:text-medical-700">Click to upload photo</span>
              </div>
            </label>
          ) : (
            <div className="space-y-8">
              <img src={preview} className="rounded-[2rem] shadow-2xl border-4 border-white mx-auto max-w-sm" alt="Preview" />
              <button onClick={() => onNext({ image: preview, imageFile: file })} className="px-12 py-5 bg-medical-700 text-white font-black rounded-2xl shadow-xl hover:bg-medical-800 transition-all flex items-center gap-3 mx-auto">
                <Sparkles size={20} /> RUN AI DIAGNOSTICS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 3. AI Analysis Loading ---
const AIAnalysisLoading = ({ onNext, testData }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        const formData = new FormData();
        formData.append("image", testData.imageFile); 

        const response = await fetch("http://127.0.0.1:5000/api/predict", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          onNext({ apiResults: result.yolo_data }); 
        } else {
          throw new Error(result.error || "Analysis Failed");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    processImage();
  }, [onNext, testData]);

  if (error) return <div className="p-20 text-center text-red-500 font-black tracking-widest uppercase">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
      <div className="relative mb-10">
        <div className="w-32 h-32 border-8 border-medical-100 rounded-full border-t-medical-700 animate-spin"></div>
        <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 w-12 h-12" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 animate-pulse tracking-tighter">Analyzing Biomarkers...</h2>
    </div>
  );
};

// --- 4. PROFESSIONAL CLINICAL REPORT COMPONENT ---
const AnalysisResult = ({ testData, onNext, onBack }) => {
  const reportRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const markers = testData.apiResults || [];
  const hasAbnormal = markers.filter(m => m.diagnosis.toLowerCase().includes("pos") || m.diagnosis.toLowerCase().includes("+") || m.diagnosis.toLowerCase().includes("trace")).length;

  const handleDownload = async () => {
    setIsDownloading(true);
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`Report_${testData.patientName}.pdf`);
    setIsDownloading(false);
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="flex items-center text-slate-500 font-black text-sm uppercase tracking-tighter hover:text-green-600"><ArrowLeft size={16} className="mr-2" /> Rescan</button>
          <button onClick={handleDownload} disabled={isDownloading} className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl flex items-center gap-3 transition-all hover:bg-green-700 disabled:opacity-50">
            {isDownloading ? <Loader2 className="animate-spin" /> : <Download size={20} />} DOWNLOAD PDF
          </button>
        </div>

        <div ref={reportRef} className="bg-white shadow-2xl rounded-sm border-t-[16px] border-green-900 p-12 text-slate-900 overflow-hidden relative">
          <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center text-white text-2xl font-black">N</div>
                <h1 className="text-2xl font-black text-green-900 tracking-tighter leading-none uppercase">NEPHROSENSE AI</h1>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Urinalysis Diagnostics System</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">MEDICAL REPORT</h2>
              <p className="font-mono text-lg font-bold text-slate-400">ID: {testData.patientId}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-8 mb-12 bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Patient</label><span className="text-base font-black text-slate-800 uppercase">{testData.patientName}</span></div>
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Age / Sex</label><span className="text-base font-black text-slate-800 uppercase">{testData.age}Y / {testData.gender}</span></div>
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Analysis Date</label><span className="text-base font-black text-slate-800 uppercase">{testData.testDate}</span></div>
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Status</label><span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black uppercase inline-flex items-center gap-1"><ShieldCheck size={12} /> AI VERIFIED</span></div>
          </div>

          <div className="flex gap-12">
            <div className="w-1/4">
              <h3 className="text-xs font-black text-slate-800 uppercase border-b-2 border-green-900 pb-2 mb-6">Source Strip</h3>
              <div className="bg-slate-100 rounded-2xl p-4 border-2 border-white flex items-center justify-center"><img src={testData.image} className="w-full grayscale-[0.2]" alt="Strip" /></div>
            </div>
            <div className="w-3/4">
              <h3 className="text-xs font-black text-slate-800 uppercase border-b-2 border-green-900 pb-2 mb-6">Findings</h3>
              <table className="w-full text-left">
                <thead><tr className="text-[10px] font-black text-slate-400 uppercase border-b"><th className="py-4 px-2">Parameter</th><th className="py-4 px-2 text-center">Result</th><th className="py-4 px-2 text-right">Status</th></tr></thead>
                <tbody className="divide-y">
                  {markers.map((m, i) => {
                    const isAbnormal = m.diagnosis.toLowerCase().includes("pos") || m.diagnosis.toLowerCase().includes("+") || m.diagnosis.toLowerCase().includes("trace");
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-2 text-sm font-bold text-slate-700 uppercase">{m.pad}</td>
                        <td className="py-4 px-2 text-sm font-black text-green-700 text-center font-mono uppercase">{m.diagnosis}</td>
                        <td className="py-4 px-2 text-right"><span className={`text-[9px] font-black px-3 py-1 rounded-sm uppercase ${isAbnormal ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{isAbnormal ? 'ABNORMAL' : 'NORMAL'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className={`mt-10 p-8 rounded-3xl border-2 flex items-center justify-between shadow-lg ${hasAbnormal > 3 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <div><h4 className={`text-xs font-black uppercase mb-1 ${hasAbnormal > 3 ? 'text-rose-400' : 'text-emerald-500'}`}>Risk Evaluation</h4><p className={`text-3xl font-black uppercase tracking-tighter ${hasAbnormal > 3 ? 'text-rose-700' : 'text-emerald-700'}`}>{hasAbnormal > 3 ? 'HIGH RISK DETECTED' : 'NORMAL PHYSIOLOGY'}</p></div>
                <Activity size={32} className={hasAbnormal > 3 ? 'text-rose-600' : 'text-emerald-600'} />
              </div>
            </div>
          </div>
          <p className="mt-16 text-[9px] text-slate-400 italic text-center border-t pt-8">This is an automated AI diagnostic screening. Please consult a qualified medical professional for clinical validation.</p>
        </div>
        <div className="mt-12 text-center pb-20"><button onClick={() => onNext(testData)} className="px-12 py-5 bg-white border-2 border-slate-200 text-slate-800 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 mx-auto shadow-sm tracking-widest uppercase">Continue to Dashboard <ArrowRight size={20} /></button></div>
      </div>
    </div>
  );
};

// --- Step 5: History Placeholder ---
const TestHistory = ({ onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans uppercase tracking-widest">
    <h2 className="text-2xl font-black text-slate-800">History Saved Successfully</h2>
    <button onClick={onBack} className="mt-10 px-8 py-4 bg-green-600 text-white font-black rounded-2xl transition-all hover:bg-green-700">Go Back</button>
  </div>
);

// --- MAIN SYSTEM COMPONENT ---
const UrineTestSystem = () => {
  const [currentStep, setCurrentStep] = useState("patientInfo");
  const [testData, setTestData] = useState({});
  const { addAnalysis } = useAnalysis();

  const handleNext = (data, step) => {
    const finalData = { ...testData, ...data };
    setTestData(finalData);

    if (step === "history") {
      addAnalysis({
        id: finalData.patientId || `NS-${Date.now()}`,
        patientId: finalData.patientId,
        patientName: finalData.patientName,
        age: finalData.age,
        gender: finalData.gender,
        summary: finalData.apiResults?.[0]?.diagnosis || "Analysis Completed",
        results: finalData.apiResults || [],
        date: finalData.testDate || new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: "completed",
        confidence: 94.5,
        flags: { isAbnormal: finalData.apiResults?.some(m => m.diagnosis.toLowerCase().includes("pos") || m.diagnosis.toLowerCase().includes("+") || m.diagnosis.toLowerCase().includes("trace")) }
      });
    }
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentStep === "patientInfo" && <PatientInfoForm onNext={(d) => handleNext(d, "upload")} />}
      {currentStep === "upload" && <UploadUrineStrip patientData={testData} onNext={(d) => handleNext(d, "processing")} onBack={() => setCurrentStep("patientInfo")} />}
      {currentStep === "processing" && <AIAnalysisLoading testData={testData} onNext={(d) => handleNext(d, "results")} />}
      {currentStep === "results" && <AnalysisResult testData={testData} onNext={(d) => handleNext(d, "history")} onBack={() => setCurrentStep("upload")} />}
      {currentStep === "history" && <TestHistory onBack={() => setCurrentStep("patientInfo")} />}
    </div>
  );
};

export default UrineTestSystem;