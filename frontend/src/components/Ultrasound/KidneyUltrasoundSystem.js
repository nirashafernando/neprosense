import React, { useState, useRef } from "react";
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Loader2,
  Activity,
  Download,
  Calendar,
  ShieldCheck,
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
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.patientName && formData.patientId && formData.age)
      onNext(formData);
    else alert("Please fill in all details");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-100">
      <div className="w-full max-w-md p-8 bg-white border shadow-2xl rounded-3xl border-slate-200">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-medical-700 bg-medical-50 rounded-2xl">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Patient Registration
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="ml-1 text-xs font-bold uppercase text-slate-500">
              Patient Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-700"
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <label className="ml-1 text-xs font-bold uppercase text-slate-500">
              Patient ID
            </label>
            <input
              type="text"
              className="w-full p-3 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-700"
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="ml-1 text-xs font-bold uppercase text-slate-500">
                Age
              </label>
              <input
                type="number"
                className="w-full p-3 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-700"
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="ml-1 text-xs font-bold uppercase text-slate-500">
                Gender
              </label>
              <select
                className="w-full p-3 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-700"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="ml-1 text-xs font-bold uppercase text-slate-500">
              Examination Date
            </label>
            <input
              type="date"
              value={formData.date}
              className="w-full p-3 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-700"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-full gap-2 py-4 mt-4 font-bold text-white transition-all bg-medical-700 shadow-lg rounded-xl hover:bg-medical-800"
          >
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
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-100">
      <div className="w-full max-w-xl p-10 text-center bg-white border shadow-2xl rounded-3xl border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center mb-6 font-medium transition-all text-slate-500 hover:text-medical-700"
        >
          <ArrowLeft size={18} className="mr-1" /> Back to Registration
        </button>
        <h1 className="mb-2 text-2xl font-bold text-slate-800">
          Upload Ultrasound Scan
        </h1>
        <p className="mb-8 text-slate-500">
          Provide a high-quality ultrasound image for kidney tissue analysis
        </p>
        <div className="relative p-12 transition-all border-2 border-dashed cursor-pointer border-slate-300 rounded-3xl hover:border-medical-700 bg-slate-50 group">
          <input type="file" id="file" hidden onChange={handleFileSelect} />
          <label htmlFor="file" className="cursor-pointer">
            {previewUrl ? (
              <img
                src={previewUrl}
                className="mx-auto border-4 border-white shadow-md max-h-64 rounded-xl"
                alt="Preview"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 py-10">
                <Upload
                  size={48}
                  className="transition-colors text-slate-300 group-hover:text-medical-600"
                />
                <span className="font-bold text-slate-400">
                  Select Image to Upload
                </span>
              </div>
            )}
          </label>
        </div>
        {previewUrl && (
          <button
            onClick={() => onNext({ file: file })}
            className="w-full py-4 mt-8 font-bold text-white transition-all bg-medical-700 shadow-xl rounded-xl hover:bg-medical-800"
          >
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
    if (d.includes("healthy") || d.includes("normal")) return "#059669";
    if (d.includes("mild")) return "#d97706";
    return "#dc2626";
  };

  const getReferenceRange = (diag) => {
    if (!diag) return "Clinical Abnormality";
    const d = diag.toLowerCase();
    if (d.includes("healthy") || d.includes("normal"))
      return "Normal / Physiological";
    return "Clinical Abnormality";
  };

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        210,
        (canvas.height * 210) / canvas.width,
      );
      pdf.save(`Kidney_Analysis_Report_${testData.patientId}.pdf`);
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-slate-200">
      <div
        ref={reportRef}
        className="w-[210mm] min-h-[297mm] p-16 bg-white shadow-2xl font-sans text-slate-900 flex flex-col"
      >
        <div className="flex items-start justify-between pb-8 mb-10 border-b-4 border-medical-700">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-medical-900">
              KIDNEY SCAN AI
            </h1>
            <p className="text-sm font-bold tracking-widest uppercase text-slate-400">
              Autonomous Diagnostic Laboratory
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase text-slate-500">
              Analysis ID: #{testData.id}
            </p>
            <p className="text-xs font-bold uppercase text-slate-500">
              Date: {testData.date}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 p-6 mb-12 border gap-x-12 gap-y-3 bg-slate-50 rounded-2xl border-slate-100">
          <p className="text-sm">
            <b>PATIENT NAME:</b>{" "}
            <span className="ml-2 text-slate-600">{testData.patientName}</span>
          </p>
          <p className="text-sm">
            <b>PATIENT ID:</b>{" "}
            <span className="ml-2 text-slate-600">{testData.patientId}</span>
          </p>
          <p className="text-sm">
            <b>AGE:</b>{" "}
            <span className="ml-2 text-slate-600">{testData.age} Years</span>
          </p>
          <p className="text-sm">
            <b>GENDER:</b>{" "}
            <span className="ml-2 text-slate-600">{testData.gender}</span>
          </p>
          <p className="text-sm">
            <b>STUDY TYPE:</b>{" "}
            <span className="ml-2 text-slate-600">
              Kidney Tissue Segmentation
            </span>
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-medical-700" />
            <h2 className="text-xs font-black tracking-widest uppercase text-slate-900">
              I. RADIOLOGICAL SEGMENTATION RESULT
            </h2>
          </div>
          <div className="p-6 text-center shadow-inner bg-slate-900 rounded-3xl">
            {testData.image ? (
              <>
                <img
                  src={testData.image}
                  className="inline-block border rounded-lg max-h-80 border-slate-700"
                  alt="Segmented Result"
                  onError={(e) => {
                    console.error("❌ Image failed to load:", testData.image?.substring(0, 50) + "...");
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none' }} className="p-8 text-red-400">
                  ⚠️ Image failed to load
                </div>
              </>
            ) : (
              <div className="p-8 text-yellow-400">
                ⚠️ No image data received from backend
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-4 italic font-medium">
              Visualization of cortical thickness and density mapping as
              identified by the AI system.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-medical-700" />
            <h2 className="text-xs font-black tracking-widest uppercase text-slate-900">
              II. QUANTITATIVE ANALYSIS
            </h2>
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
                <td className="p-4 font-bold text-slate-700">
                  Cortical Thickness (Max)
                </td>
                <td className="p-4">{testData.maxCortex}</td>
                <td className="p-4 text-slate-400">8.0 mm - 12.5 mm</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="p-4 font-bold text-slate-700">
                  Cortical Thickness (Min)
                </td>
                <td className="p-4">{testData.minCortex}</td>
                <td className="p-4 text-slate-400"> {">"} 7.0 mm</td>
              </tr>
              <tr className="border-b border-slate-50">
                <td className="p-4 font-bold text-slate-700">
                  AI Diagnostic Interpretation
                </td>
                <td
                  className="p-4 font-black uppercase"
                  style={{ color: getSeverityColor(testData.diagnosis) }}
                >
                  {testData.diagnosis || "Pending"}
                </td>
                <td
                  className="p-4 font-bold"
                  style={{ color: getSeverityColor(testData.diagnosis) }}
                >
                  {getReferenceRange(testData.diagnosis)}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-700">
                  Segmentation Confidence
                </td>
                <td className="p-4">{testData.confidence}</td>
                <td className="p-4 text-slate-400"> {">"} 90% (High)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-8 mb-12 border border-medical-100 bg-medical-50/50 rounded-3xl">
          <h3 className="mb-3 text-xs font-black text-medical-900 uppercase">
            III. CLINICAL IMPRESSION
          </h3>
          <p className="text-sm leading-relaxed text-slate-700">
            Automated analysis indicates findings consistent with{" "}
            <b style={{ color: getSeverityColor(testData.diagnosis) }}>
              {testData.diagnosis || "the condition"}
            </b>
            . The segmentation reveals a maximum cortical thickness of{" "}
            {testData.maxCortex} and a severity score of{" "}
            <b>{testData.severityScore || "N/A"}</b> based on tissue density
            mapping. Final clinical correlation by a nephrologist is recommended
            for definitive care planning.
          </p>
        </div>

        <div className="flex items-end justify-between pt-10 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 text-white bg-medical-700 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-900 leading-tight">
                AI Verified Report
              </p>
              <p className="text-[9px] text-slate-400">
                KidneyScan AI Core v2.4
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-48 h-px mb-3 ml-auto bg-slate-300"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
              Authorized Digital Signature
            </p>
            <p className="text-[9px] text-slate-400 uppercase">
              Radiological Imaging Center / Autonomous
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pb-20 mt-10">
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-10 py-5 text-sm font-bold text-white uppercase transition-all bg-medical-700 shadow-2xl rounded-2xl hover:bg-medical-800"
        >
          <Download size={20} /> Export Medical PDF
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-10 py-5 text-sm font-bold uppercase transition-all border-2 shadow-lg text-slate-900 border-slate-200 rounded-2xl hover:bg-white"
        >
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
    formDataPayload.append("file", uploadData.file);

    try {
      const response = await fetch("http://localhost:8080/api/ultrasound/api/predict", {
        method: "POST",
        body: formDataPayload,
      });
      const result = await response.json();

      if (response.ok) {
        console.log("✅ Prediction response:", result);
        
        const newReport = {
          id: Math.floor(100000 + Math.random() * 900000),
          patientId: data.patientId,
          patientName: data.patientName,
          age: data.age,
          gender: data.gender,
          date: data.date,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          maxCortex: result.max_thickness,
          minCortex: result.min_thickness,
          severityScore: result.severity_score,
          image: result.segmented_image,
          status: "completed",
        };

        console.log("📊 New report data:", { ...newReport, image: newReport.image ? "✓ Image data present" : "✗ No image data" });
        
        setData(newReport);
        setStep("prediction");

        if (addAnalysis) {
          addAnalysis(newReport);
        } else if (setAnalysisHistory) {
          setAnalysisHistory((prev) => [newReport, ...(prev || [])]);
        }
      } else {
        console.error("❌ Backend error:", result);
        alert(`Error: ${result.error || "Prediction failed"}`);
      }
    } catch (err) {
      alert("System Offline: Ensure Flask is running on port 5003.");
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-slate-900/95 backdrop-blur-xl">
          <Loader2 className="mb-6 text-blue-500 animate-spin" size={64} />
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">
            Analyzing Kidney Tissue...
          </h2>
          <p className="mt-3 font-medium text-slate-500">
            Measuring cortical metrics and performing segmentation
          </p>
        </div>
      )}
      <div className="w-full">
        {step === "patient" && (
          <PatientDetailsForm
            onNext={(d) => {
              setData(d);
              setStep("upload");
            }}
          />
        )}
        {step === "upload" && (
          <UploadKidneyImage
            onNext={handlePredict}
            onBack={() => setStep("patient")}
          />
        )}
        {step === "prediction" && <CKDStagePrediction testData={data} />}
      </div>
    </div>
  );
};

export default KidneyUltrasoundSystem;
