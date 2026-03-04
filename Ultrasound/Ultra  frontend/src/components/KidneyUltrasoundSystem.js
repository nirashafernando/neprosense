import React, { useState, useRef } from "react";
import {
  Upload, ArrowLeft, ArrowRight, UserPlus, Loader2,
  Activity, Download, Calendar, ShieldCheck
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


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
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-100">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl border border-slate-200">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-600 bg-blue-50 rounded-2xl">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Registration</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Patient Full Name</label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Patient ID</label>
              <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Age</label>
              <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Examination Date</label>
            <input type="date" value={formData.date} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 transition-all mt-4">
            Proceed to Analysis <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 2. Image Upload ---
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
        <button onClick={onBack} className="flex items-center mb-6 text-slate-500 hover:text-blue-600 font-medium transition-all">
          <ArrowLeft size={18} className="mr-1" /> Back to Registration
        </button>
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Upload Ultrasound Scan</h1>
        <p className="mb-8 text-slate-500">Provide a high-quality ultrasound image for kidney tissue analysis</p>
        <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 hover:border-blue-500 bg-slate-50 transition-all cursor-pointer relative group">
          <input type="file" id="file" hidden onChange={handleFileSelect} />
          <label htmlFor="file" className="cursor-pointer">
            {previewUrl ? <img src={previewUrl} className="mx-auto shadow-md max-h-64 rounded-xl border-4 border-white" alt="Preview" /> : <div className="py-10 flex flex-col items-center gap-4">
              <Upload size={48} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              <span className="font-bold text-slate-400">Select Image to Upload</span>
            </div>}
          </label>
        </div>
        {previewUrl && (
          <button onClick={() => onNext({ file: file })} className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-xl hover:bg-blue-700 transition-all">
            Generate Medical Report
          </button>
        )}
      </div>
    </div>
  );
};

// --- 3. PROFESSIONAL REPORT ---
const CKDStagePrediction = ({ testData }) => {
  const reportRef = useRef();

  const getSeverityColor = (diag) => {
    if (diag?.includes("Healthy")) return "#059669"; // Green
    if (diag?.includes("Mild")) return "#d97706";    // Orange
    return "#dc2626";                                // Red
  };

  const getReferenceRange = (diag) => {
    if (diag?.includes("Healthy")) return "Normal / Physiological";
    return "Clinical Abnormality";
  };

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`CKD_Analysis_Report_${testData.patientId}.pdf`);
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-200 min-h-screen">
      <div ref={reportRef} className="w-[210mm] min-h-[297mm] p-16 bg-white shadow-2xl font-sans text-slate-900 flex flex-col">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-start border-b-4 border-blue-600 pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-black text-blue-900 tracking-tighter">KIDNEY SCAN AI</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Autonomous Diagnostic Laboratory</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase">Analysis ID: #{testData.id}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Date: {testData.date}</p>
          </div>
        </div>

        {/* PATIENT INFO BOX */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-sm"><b>PATIENT NAME:</b> <span className="text-slate-600 ml-2">{testData.patientName}</span></p>
          <p className="text-sm"><b>PATIENT ID:</b> <span className="text-slate-600 ml-2">{testData.patientId}</span></p>
          <p className="text-sm"><b>AGE / GENDER:</b> <span className="text-slate-600 ml-2">{testData.age} Years</span></p>
          <p className="text-sm"><b>STUDY TYPE:</b> <span className="text-slate-600 ml-2">Kidney Tissue Segmentation</span></p>
        </div>

        {/* IMAGE ANALYSIS SECTION */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-blue-600" />
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">I. RADIOLOGICAL SEGMENTATION RESULT</h2>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl text-center shadow-inner">
            <img src={testData.image} className="inline-block max-h-80 rounded-lg border border-slate-700" alt="Segmented Result" />
            <p className="text-[10px] text-slate-500 mt-4 italic font-medium">Visualization of cortical thickness and density mapping as identified by the AI system.</p>
          </div>
        </div>

        {/* FINDINGS TABLE */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-blue-600" />
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
                <td className="p-4 text-slate-400"> > 7.0 mm</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="p-4 font-bold text-slate-700">AI Diagnostic Interpretation</td>
                <td className="p-4 font-black uppercase" style={{ color: getSeverityColor(testData.diagnosis) }}>
                  {testData.diagnosis}
                </td>
                <td className="p-4 font-bold" style={{ color: testData.diagnosis === "Healthy" ? "#059669" : "#dc2626" }}>
                  {getReferenceRange(testData.diagnosis)}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700">Segmentation Confidence</td>
                <td className="p-4">{testData.confidence}</td>
                <td className="p-4 text-slate-400"> > 90% (High)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* IMPRESSION SECTION */}
        <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 mb-12">
          <h3 className="text-xs font-black text-blue-900 uppercase mb-3">III. CLINICAL IMPRESSION</h3>
          <p className="text-sm leading-relaxed text-slate-700">
            Automated analysis indicates findings consistent with <b>{testData.diagnosis}</b>. 
            The segmentation reveals a maximum cortical thickness of {testData.maxCortex} and a severity score based on tissue density mapping. 
            Final clinical correlation by a nephrologist is recommended for definitive care planning.
          </p>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="mt-auto pt-10 flex justify-between items-end border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
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

      {/* FOOTER BUTTONS */}
      <div className="flex gap-4 mt-10 pb-20">
        <button onClick={downloadPDF} className="flex items-center gap-2 px-10 py-5 text-sm font-bold text-white uppercase bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-2xl transition-all">
          <Download size={20} /> Export Medical PDF
        </button>
        <button onClick={() => window.location.reload()} className="px-10 py-5 text-sm font-bold text-slate-900 border-2 border-slate-200 uppercase rounded-2xl hover:bg-white shadow-lg transition-all">
          New Case Study
        </button>
      </div>
    </div>
  );
};

// --- 4. Main System ---
const KidneyUltrasoundSystem = () => {
  const [step, setStep] = useState("patient");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePredict = async (uploadData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadData.file);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok) {
        setData(prev => ({
          ...prev,
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          maxCortex: result.max_thickness,
          minCortex: result.min_thickness,
          image: result.segmented_image,
          id: Math.floor(100000 + Math.random() * 900000)
        }));
        setStep("prediction");
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
          <Loader2 className="mb-6 animate-spin text-blue-500" size={64} />
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