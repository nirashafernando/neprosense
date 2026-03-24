import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Loader2, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "../lib/axios";

/**
 * LabReportUpload — drag-and-drop multi-file upload component for lab reports.
 *
 * Props:
 *   type:          "donor" | "recipient"
 *   onExtracted:   (extractedFields, notFound) => void
 *   accentColor:   "green" | "purple"   (matches the form theme)
 */

const ACCEPT = ".jpg,.jpeg,.png,.bmp,.tiff,.pdf";
const MAX_SIZE_MB = 10;

const LabReportUpload = ({ type = "donor", onExtracted, accentColor = "green" }) => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);      // { extractedFields, notFound, rawText, confidence }
  const [error, setError] = useState("");
  const [unreadable, setUnreadable] = useState(null); // message string when report is unreadable
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef(null);

  const accent = accentColor === "purple" ? "purple" : "green";
  const accentClasses = {
    green: {
      border: "border-green-300",
      borderActive: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
      ring: "focus:ring-green-500",
      icon: "text-green-400",
    },
    purple: {
      border: "border-purple-300",
      borderActive: "border-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
      ring: "focus:ring-purple-500",
      icon: "text-purple-400",
    },
  }[accent];

  // ── File handling ──────────────────────────────────────────────────────────

  const validateFiles = useCallback((fileList) => {
    const valid = [];
    for (const file of fileList) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`${file.name} exceeds ${MAX_SIZE_MB} MB limit.`);
        return null;
      }
      valid.push(file);
    }
    if (valid.length > 5) {
      setError("Maximum 5 files allowed.");
      return null;
    }
    return valid;
  }, []);

  const handleFileSelect = useCallback(
    (e) => {
      setError("");
      const selected = validateFiles(Array.from(e.target.files || []));
      if (selected) setFiles((prev) => [...prev, ...selected].slice(0, 5));
    },
    [validateFiles]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setError("");
      const dropped = validateFiles(Array.from(e.dataTransfer.files || []));
      if (dropped) setFiles((prev) => [...prev, ...dropped].slice(0, 5));
    },
    [validateFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── Upload & Extract ───────────────────────────────────────────────────────

  const handleExtract = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setError("");
    setUnreadable(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("type", type);
      files.forEach((f) => formData.append("reports", f));

      const res = await api.post("/lab-reports/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 50) / e.total)); // 0-50% = upload
        },
      });

      // Simulate processing progress (50-100%)
      let p = 50;
      const timer = setInterval(() => {
        p += 10;
        if (p >= 100) {
          clearInterval(timer);
          setProgress(100);
        } else {
          setProgress(p);
        }
      }, 200);

      if (res.data.success) {
        setResult(res.data);
        if (onExtracted) {
          onExtracted(res.data.extractedFields, res.data.notFound);
        }
      } else {
        setError(res.data.message || "Extraction failed.");
      }
    } catch (err) {
      console.error("Lab report extraction error:", err);
      // 422 = unreadable / no medical data found
      if (err.response?.status === 422 && err.response?.data?.unreadable) {
        setUnreadable(err.response.data.message);
      } else {
        setError(err.response?.data?.message || "Failed to process report. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError("");
    setUnreadable(null);
    setProgress(0);
    setShowRawText(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const fieldCount = result ? Object.keys(result.extractedFields).length : 0;
  const notFoundCount = result ? result.notFound.length : 0;

  return (
    <div className="mb-6">
      <div className={`border-2 border-dashed rounded-xl p-5 transition-all ${
        files.length > 0 ? accentClasses.borderActive : "border-gray-200 hover:" + accentClasses.border
      } ${accentClasses.bg} bg-opacity-30`}>

        {/* Title */}
        <div className="flex items-center gap-2 mb-3">
          <FileText className={`w-5 h-5 ${accentClasses.text}`} />
          <h3 className="text-sm font-semibold text-gray-700">Upload Lab Report</h3>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
        </div>

        {!result ? (
          <>
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors bg-white bg-opacity-60"
            >
              <Upload className={`w-8 h-8 mx-auto mb-2 ${accentClasses.icon}`} />
              <p className="text-sm text-gray-600 mb-1">
                <span className={`font-medium ${accentClasses.text}`}>Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG • Max 10 MB per file • Up to 5 files</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Selected files list */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{f.name}</span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="text-gray-400 hover:text-rose-500 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Process button */}
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={isProcessing}
                  className={`w-full mt-2 ${accentClasses.button} disabled:bg-gray-400 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing ({progress}%)
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Extract Medical Data from {files.length} Report{files.length > 1 ? "s" : ""}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Progress bar */}
            {isProcessing && (
              <div className="mt-3">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${accent === "purple" ? "bg-purple-500" : "bg-green-500"} rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {progress < 50 ? "Uploading files..." : "Extracting medical parameters..."}
                </p>
              </div>
            )}
          </>
        ) : (
          /* ── Results ──────────────────────────────────────────────────── */
          <div className="space-y-3">
            {/* Summary */}
            <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Extracted {fieldCount} parameter{fieldCount !== 1 ? "s" : ""} from {result.filesProcessed} report{result.filesProcessed > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  OCR confidence: {result.confidence}%
                  {notFoundCount > 0 && ` • ${notFoundCount} field${notFoundCount !== 1 ? "s" : ""} not found`}
                </p>
              </div>
            </div>

            {/* Extracted fields preview */}
            {fieldCount > 0 && (
              <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Extracted Values</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(result.extractedFields)
                    // Hide boolean false — applied to form but not useful in the preview panel
                    .filter(([, val]) => val !== false)
                    .map(([key, val]) => {
                      let display;
                      if (val === true)       display = 'Yes';
                      else if (val === false) display = 'No';
                      else                   display = String(val);
                      return (
                        <div key={key} className="bg-emerald-50 rounded px-2 py-1.5">
                          <span className="text-[10px] text-gray-500 block">{formatFieldName(key)}</span>
                          <span className="text-xs font-medium text-gray-800">{display}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Not-found fields */}
            {notFoundCount > 0 && (
              <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3 border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-700">Not detected in report:</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {result.notFound.map(formatFieldName).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Raw text toggle */}
            <button
              type="button"
              onClick={() => setShowRawText(!showRawText)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showRawText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showRawText ? "Hide" : "Show"} raw OCR text
            </button>

            {showRawText && (
              <pre className="bg-gray-50 rounded-lg p-3 text-[11px] text-gray-600 overflow-auto max-h-48 whitespace-pre-wrap border border-gray-100">
                {result.rawText || "No text extracted."}
              </pre>
            )}

            {/* Upload another */}
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Upload another report
            </button>
          </div>
        )}

        {/* Unreadable report warning */}
        {unreadable && (
          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-700 mb-1">Report Unreadable or Incompatible</p>
                <p className="text-xs text-orange-600">{unreadable}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 text-xs text-orange-600 hover:text-orange-800 underline transition-colors"
            >
              Try a different file
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFieldName(key) {
  const map = {
    bloodGroup: "Blood Group",
    creatinine: "Creatinine",
    gfr: "eGFR",
    hlaTyping: "HLA Typing",
    systolicBP: "Systolic BP",
    diastolicBP: "Diastolic BP",
    bmi: "BMI",
    diabetes: "Diabetes",
    hypertension: "Hypertension",
    pra: "PRA",
    dialysisYears: "Dialysis Years",
    previousTransplants: "Previous Transplants",
    age: "Age",
    gender: "Gender",
    weight: "Weight",
    height: "Height",
  };
  return map[key] || key;
}

export default LabReportUpload;
