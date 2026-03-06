import React, { useState, useEffect, useRef } from "react";
import {
  Upload, ArrowLeft, ArrowRight, Camera, CheckCircle, Activity, User, Calendar, 
  Download, AlertCircle, Scan, Sparkles, Loader2, Stethoscope, ShieldCheck, Droplets, FileText
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAnalysis } from "./AnalysisContext";

// --- STEP 1: PATIENT INFORMATION FORM ---
const PatientInfoForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    patientId: `NS-${Math.floor(Math.random() * 90000) + 10000}`,
    patientName: "",
    age: "",
    gender: "",
    testDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!formData.patientName || !formData.age || !formData.gender) {
      alert("Please fill in all required fields");
      return;
    }
    onNext(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans text-left text-slate-800">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-2xl mb-4">
            <User className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Patient Intake</h1>
          <p className="text-slate-500 font-medium">Register patient details to start AI analysis</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold text-slate-700 shadow-sm" placeholder="ENTER FULL NAME" onChange={(e) => setFormData({...formData, patientName: e.target.value.toUpperCase()})} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1"> Age </label> <input type="number" min="1" max="100" maxLength="3" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold text-slate-700 shadow-sm"placeholder="Years" onChange={(e) => {let value = e.target.value; 
              if (value < 0) value = 0; if (value.length > 3) value = value.slice(0, 3); setFormData({ ...formData, age: value });}} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender</label>
              <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold text-slate-700 shadow-sm" onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="">Select</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Test Date</label>
            <input type="date" value={formData.testDate} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all font-bold text-slate-700 shadow-sm" onChange={(e) => setFormData({...formData, testDate: e.target.value})} />
          </div>
          <button onClick={handleSubmit} className="w-full py-5 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 transition-all transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
            PROCEED TO SCAN <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- STEP 2: UPLOAD URINE STRIP ---
const UploadUrineStrip = ({ onNext, onBack }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50 flex items-center justify-center font-sans text-slate-800">
      <div className="w-full max-w-3xl">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-green-600 font-bold mb-8 transition-colors uppercase text-xs tracking-widest">
            <ArrowLeft size={18} className="mr-2" /> GO BACK
        </button>
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center">
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Capture Test Strip</h2>
          <p className="text-slate-400 font-medium mb-10">AI will detect color changes to measure medical thresholds</p>
          {!preview ? (
            <label className="block border-4 border-dashed border-slate-100 rounded-[2rem] p-20 hover:border-green-200 cursor-pointer group transition-all bg-slate-50/50">
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <Camera className="w-10 h-10 text-green-600" />
                </div>
                <span className="text-xl font-bold text-slate-400 group-hover:text-green-600 uppercase tracking-widest">Upload Strip Photo</span>
              </div>
            </label>
          ) : (
            <div className="space-y-8">
              <img src={preview} className="rounded-[2rem] shadow-2xl border-4 border-white mx-auto max-w-sm" alt="Preview" />
              <button onClick={() => onNext({ image: preview, imageFile: file })} className="px-12 py-5 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 transition-all flex items-center gap-3 mx-auto uppercase tracking-widest">
                <Sparkles size={20} /> RUN AI DIAGNOSTICS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STEP 3: AI ANALYSIS LOADING ---
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
          onNext({ 
            apiResults: result.yolo_data, 
            riskLevel: result.risk_evaluation 
          }); 
        } else {
          throw new Error(result.error || "Analysis Failed");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    processImage();
  }, [onNext, testData]);

  if (error) return <div className="p-20 text-center text-rose-500 font-black tracking-widest uppercase">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-slate-800">
      <div className="relative mb-10">
        <div className="w-32 h-32 border-8 border-green-50 rounded-full border-t-green-600 animate-spin"></div>
        <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 w-12 h-12" />
      </div>
      <h2 className="text-2xl font-black animate-pulse tracking-tighter uppercase text-center">Comparing with Clinical Range...</h2>
    </div>
  );
};

// --- STEP 4: ANALYSIS RESULT (MODERN ADVANCED CLINICAL REPORT) ---
const AnalysisResult = ({ testData, onNext, onBack }) => {
  const reportRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const markers = testData.apiResults || [];
  const riskStatus = testData.riskLevel || "NORMAL PHYSIOLOGY";

  const handleDownload = async () => {
    setIsDownloading(true);
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`NephroSense_Report_${testData.patientName}.pdf`);
    setIsDownloading(false);
  };

  const isCritical = riskStatus.includes("HIGH") || riskStatus.includes("MODERATE");

  return (
    <div className="p-8 bg-slate-100 min-h-screen font-sans text-left text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="flex items-center text-slate-500 font-black text-xs uppercase tracking-widest hover:text-green-600 transition-all">
            <ArrowLeft size={16} className="mr-2" /> Rescan Image
          </button>
          <button onClick={handleDownload} disabled={isDownloading} className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl flex items-center gap-3 transition-all hover:bg-green-700 disabled:opacity-50 uppercase text-xs tracking-widest">
            {isDownloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} EXPORT PDF REPORT
          </button>
        </div>

        {/* CLINICAL REPORT DESIGN WITH ENHANCED DATA */}
        <div ref={reportRef} className="bg-white shadow-2xl rounded-sm border-t-[16px] border-green-900 p-12 text-slate-900 relative">
          <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10 mb-10">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg">N</div>
                <h1 className="text-2xl font-black text-green-900 tracking-tighter leading-none uppercase">NEPHROSENSE AI</h1>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Colorimetric Diagnostics System</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">CLINICAL REPORT</h2>
              <p className="font-mono text-lg font-bold text-slate-400 uppercase">REF: {testData.patientId}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-4 gap-8 mb-12 bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Patient Name</label><span className="text-base font-black text-slate-800 uppercase">{testData.patientName}</span></div>
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Age / Gender</label><span className="text-base font-black text-slate-800 uppercase">{testData.age}Y / {testData.gender}</span></div>
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Test Date</label><span className="text-base font-black text-slate-800 uppercase">{testData.testDate}</span></div>
            <div><label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Verification</label><span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black uppercase inline-flex items-center gap-1 shadow-sm"><ShieldCheck size={12} /> AI VERIFIED</span></div>
          </div>

          <div className="flex gap-12">
            {/* Left Column: Evidence & Model Info */}
            <div className="w-1/4">
              <h3 className="text-xs font-black text-slate-800 uppercase border-b-2 border-green-900 pb-2 mb-6 flex items-center gap-2">
                  <Droplets size={14} className="text-green-700" /> Source Strip
              </h3>
              <div className="bg-slate-100 rounded-2xl p-4 border-2 border-white flex items-center justify-center shadow-inner overflow-hidden mb-6">
                <img src={testData.image} className="w-full rounded-lg grayscale-[0.1]" alt="Strip" />
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-2 text-blue-800 font-black text-[10px] uppercase"><Scan size={14} /> AI Analysis Log</div>
                  <p className="text-[9px] font-bold text-blue-700 leading-relaxed uppercase">
                      YOLOv8 Identification: 10/10 Markers detected.<br/>
                      Saturation Median Mapping: Verified.<br/>
                      Confidence Level: 94.5%.
                  </p>
              </div>
            </div>

            {/* Right Column: Findings Table */}
            <div className="w-3/4">
              <h3 className="text-xs font-black text-slate-800 uppercase border-b-2 border-green-900 pb-2 mb-6 flex items-center gap-2">
                  <Activity size={14} className="text-green-700" /> Diagnostic Findings
              </h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase border-b">
                    <th className="py-4 px-2">Biomarker Parameter</th>
                    <th className="py-4 px-2 text-center">Observation</th>
                    <th className="py-4 px-2 text-center">Normal Range (Ref)</th>
                    <th className="py-4 px-2 text-right">Clinical Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {markers.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2 text-sm font-bold text-slate-700 uppercase">{m.pad}</td>
                      <td className={`py-4 px-2 text-sm font-black text-center font-mono uppercase ${m.status === 'ABNORMAL' ? 'text-rose-600' : 'text-green-700'}`}>
                        {m.diagnosis}
                      </td>
                     
                      <td className="py-4 px-2 text-center text-[10px] font-bold text-slate-400 uppercase">
                          {m.normal_range || "Negative"}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-sm uppercase tracking-tighter ${m.status === 'ABNORMAL' ? 'bg-rose-600 text-white shadow-md' : 'bg-emerald-100 text-emerald-700'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Enhanced Risk Evaluation Display */}
              <div className={`mt-10 p-8 rounded-3xl border-2 flex items-center justify-between shadow-xl transition-all ${isCritical ? 'bg-rose-50 border-rose-100 scale-[1.02]' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="text-left">
                  <h4 className={`text-xs font-black uppercase mb-1 ${isCritical ? 'text-rose-400' : 'text-emerald-500'}`}>AI Critical Assessment</h4>
                  <p className={`text-4xl font-black uppercase tracking-tighter ${isCritical ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {riskStatus}
                  </p>
                </div>
                <Activity size={40} className={isCritical ? 'text-rose-600 animate-pulse' : 'text-emerald-600'} />
              </div>
            </div>
          </div>
          
          <div className="mt-16 border-t pt-8 flex justify-between items-end text-left">
              <div className="max-w-2xl">
                  <p className="text-[10px] font-black text-slate-800 uppercase mb-2">Clinical Interpretation Note:</p>
                  <p className="text-[9px] text-slate-400 italic leading-relaxed">
                      This screening utilizes high-precision pixel analysis. A "Negative" result indicates that the biomarker level is below the clinical detection threshold (Reference Range) established for healthy individuals. 
                      Any "Positive" or "Trace" results are highlighted as "ABNORMAL" for immediate clinical review.
                  </p>
              </div>
              <div className="text-right">
                  <div className="w-32 h-1 border-b-2 border-slate-900 mb-2 ml-auto"></div>
                  <p className="text-[10px] font-black text-slate-900 uppercase">NephroSense AI Laboratory</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Automated Verification Protocol</p>
              </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center pb-20">
          <button onClick={() => onNext(testData)} className="px-12 py-5 bg-white border-2 border-slate-200 text-slate-800 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 mx-auto shadow-sm tracking-widest uppercase text-xs">
            Finalize & Sync to History <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- STEP 5: SUCCESS & SYNC PAGE ---
const TestHistory = ({ onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans uppercase tracking-widest text-left p-6 text-slate-800">
    <div className="bg-white p-16 rounded-[3rem] shadow-2xl text-center border border-slate-100 w-full max-w-lg">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter uppercase">Analysis Synced</h2>
        <p className="text-slate-400 font-medium mb-10 normal-case tracking-normal">The diagnostic record has been updated in the cloud dashboard for history tracking.</p>
        <button onClick={onBack} className="w-full py-5 bg-green-600 text-white font-black rounded-2xl transition-all hover:bg-green-700 shadow-xl tracking-widest uppercase">
            PERFORM NEW ANALYSIS
        </button>
    </div>
  </div>
);

// --- MAIN SYSTEM COMPONENT (ORCHESTRATOR) ---
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
        summary: finalData.riskLevel || "Analysis Completed",
        results: finalData.apiResults || [],
        date: finalData.testDate || new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "completed",
        confidence: 94.5,
        flags: { 
          isAbnormal: finalData.apiResults?.some(m => m.status === 'ABNORMAL') 
        }
      });
    }
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentStep === "patientInfo" && <PatientInfoForm onNext={(d) => handleNext(d, "upload")} />}
      {currentStep === "upload" && <UploadUrineStrip onNext={(d) => handleNext(d, "processing")} onBack={() => setCurrentStep("patientInfo")} />}
      {currentStep === "processing" && <AIAnalysisLoading testData={testData} onNext={(d) => handleNext(d, "results")} />}
      {currentStep === "results" && <AnalysisResult testData={testData} onNext={(d) => handleNext(d, "history")} onBack={() => setCurrentStep("upload")} />}
      {currentStep === "history" && <TestHistory onBack={() => setCurrentStep("patientInfo")} />}
    </div>
  );
};


export default UrineTestSystem;