import React, { useState } from "react";
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  FileText,
  Camera,
  CheckCircle,
  Activity,
  User,
  Calendar,
  Clock,
  Download,
  Eye,
  AlertCircle,
  Search,
} from "lucide-react";

const UploadUrineStrip = ({ onNext }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Camera className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Upload Urine Strip Image
                </h1>
                <p className="text-gray-600">
                  Upload a clear image of the urine test strip for analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors"
          >
            {!previewUrl ? (
              <div>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop image here or click to upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: JPG, PNG, JPEG (Max 5MB)
                </p>
                <label className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Select Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600 mb-4">
                  {selectedFile.name}
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  onNext({ image: previewUrl, fileName: selectedFile.name })
                }
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddTestDetails = ({ uploadedData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    lightingCondition: "",
    timeOfDay: "",
    phoneModel: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onNext({ ...uploadedData, ...formData });
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Add Test Details
                </h1>

                <p className="text-gray-600">
                  Enter image capture details and metadata
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {" "}
            {/* Left side - Show uploaded image */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded Image
              </label>
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <img
                  src={uploadedData.image}
                  alt="Uploaded"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {uploadedData.fileName}
                </p>
              </div>
            </div>
            {/* Right side - New fields */}
            <div className="md:col-span-1 space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time of day
                </label>
                <input
                  type="text"
                  name="time of day"
                  value={formData["time of day"]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter time of day"
                />
              </div>

             
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageProcessingPreview = ({ testData, onNext, onBack }) => {
  const [processing, setProcessing] = useState(true);
  const [autoCorrection, setAutoCorrection] = useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProcessing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Image Processing Preview
                </h1>
                <p className="text-gray-600">Analyzing urine strip image</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg shadow-sm p-8">
          {" "}
          <div className="mb-6">
            <img
              src={testData.image}
              alt="Urine Strip"
              className="max-h-96 mx-auto rounded-lg border-2 border-gray-200"
            />
          </div>
          {processing ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">
                Processing image and analyzing parameters...
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Original Image */}
                <div>
                  <h3 className="text-center text-sm font-medium text-gray-600 mb-3">
                    Original Image
                  </h3>
                  <div className="border-2 border-gray-700 rounded-lg p-4 bg-black">
                    <img
                      src={testData.image}
                      alt="Original"
                      className="w-full h-64 object-contain rounded"
                    />
                  </div>
                </div>

                {/* Corrected Image */}
                <div>
                  <h3 className="text-center text-sm font-medium text-gray-600 mb-3">
                    Corrected Image
                  </h3>
                  <div className="border-2 border-gray-700 rounded-lg p-4 bg-black">
                    <img
                      src={testData.image}
                      alt="Corrected"
                      className="w-full h-64 object-contain rounded"
                      style={{
                        filter: autoCorrection
                          ? "brightness(1.1) contrast(1.1)"
                          : "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Auto Lighting Correction Checkbox */}
              <div className="flex items-center space-x-2 mb-6">
                <input
                  type="checkbox"
                  id="autoCorrection"
                  checked={autoCorrection}
                  onChange={(e) => setAutoCorrection(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label
                  htmlFor="autoCorrection"
                  className="text-sm text-gray-600"
                >
                  Apply auto lighting correction
                </label>
              </div>

              <div className="flex justify-center mb-6">
                <button
                  onClick={() => onNext(testData)}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors "
                >
                  Proceed to Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalysisResult = ({ testData, onNext, onBack }) => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-gray-200 rounded-lg shadow-sm p-6 border-t-4 border-gray-200">
            {" "}
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-600">
                  Analysis Results
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Test Image */}
            <div className="flex flex-col items-center">
              <div className="border-2 border-gray-700 rounded-lg p-3 bg-black mb-3">
                <img
                  src={testData.image}
                  alt="Test Strip"
                  className="w-full h-64 object-contain"
                />
              </div>
              <p className="text-gray-600 text-sm">Test Img</p>
            </div>

            {/* Right side - Detected Biomarkers */}
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold text-gray-600 mb-6 text-center">
                Detected Biomarkers
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Glucose</span>
                  <span className="text-black font-medium">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">pH</span>
                  <span className="text-black font-medium">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Blood</span>
                  <span className="text-black font-medium">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">protein</span>
                  <span className="text-black font-medium">High</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">CKD Risk</span>
                  <span className="text-gray-600 font-medium">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors "
          >
            Download Report
          </button>
          <button
            onClick={() => onNext(testData)}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const FullTestReport = ({ testData, onNext, onBack }) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-gray-200 rounded-lg shadow-sm p-6 border-t-4 border-gray-200">
            <h1 className="text-2xl font-bold text-gray-700 text-center">
              Full Test Report
            </h1>
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Patient Info and Biomarker */}
            <div className="space-y-8">
              {/* Patient Info Section */}
              <div className="bg-green-500 rounded-lg p-6">
                <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                  Patient Info
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-gray-800 w-20">Name:</span>
                    <span className="text-white">
                      {testData.patientName || "N/A"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-800 w-20">Age:</span>
                    <span className="text-white">{testData.age || "N/A"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-800 w-20">Date:</span>
                    <span className="text-white">
                      {testData.testDate || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Biomarker Value Section */}
              <div className="bg-green-500 rounded-lg p-6 ">
                <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                  Biomarker Value
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-800">Protein</span>
                    <span className="text-white font-medium">+2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">pH</span>
                    <span className="text-white font-medium">7.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">Glucose</span>
                    <span className="text-white font-medium">Negative</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">Blood</span>
                    <span className="text-white font-medium">Negative</span>
                  </div>
    
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-300 text-sm">
                      Possible kidney issue
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Urine Strip and Color Chart */}
            <div className="space-y-8">
              {/* Urine Strip */}
              <div className="flex flex-col items-center">
                <div className="border-2 border-gray-700 rounded-lg p-4 bg-black mb-3 w-48 h-80">
                  <img
                    src={testData.image}
                    alt="Urine Strip"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-400 text-sm">Urine Strip</p>
              </div>

              {/* Color Chart */}
              <div className="flex flex-col items-center">
                <div className=" rounded-lg bg-green-500 p-4">
                  <div className="grid grid-cols-2 gap-2 w-48">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-16 bg-green-800  rounded" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-3">Colour chart</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-800 transition-colors "
          >
            Download As PDF
          </button>
          <button
            onClick={() => onNext(testData)}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-800 transition-colors "
          >
            Share with Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

const TestHistory = ({ onViewDetails, onValidation, onBack }) => {
  const [dateRange, setDateRange] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const historyData = [
    {
      date: "25/05/2025",
      riskLevel: "HIGH",
    },
    {
      date: "25/05/2025",
      riskLevel: "HIGH",
    },
    {
      date: "25/05/2025",
      riskLevel: "HIGH",
    },
    {
      date: "25/05/2025",
      riskLevel: "HIGH",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Test History
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-500 text-sm mb-2">
                Date Range
              </label>
              <input
                type="text"
                placeholder="Select date range"
                className="w-full px-4 py-2 bg-white  rounded-lg text-black focus:ring-2 focus:ring-green-600 "
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Risk Level
              </label>
              <select className="w-full px-4 py-2 bg-white  rounded-lg text-black focus:ring-2 focus:ring-green-600 focus:border-green-600">
                <option value="">All Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-green-900 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-200 ">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Result Summary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    CKD Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-800">
                {[1, 2, 3, 4].map((item) => (
                  <tr
                    key={item}
                    className="hover:bg-green-500 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      25/05/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onViewDetails({})}
                        className="px-6 py-1 bg-transparent text-gray-600 rounded border border-gray-600 hover:bg-white transition-colors text-sm"
                      >
                        view
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      HIGH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValidationAgainstLab = ({ testData, onComplete, onBack }) => {
  const [labResults, setLabResults] = useState({
    glucose: "",
    protein: "",
    pH: "",
    blood: "",
    ketones: "",
    bilirubin: "",
    urobilinogen: "",
    nitrite: "",
    leukocytes: "",
    specificGravity: "",
  });

  const [notes, setNotes] = useState("");

  const aiResults = {
    glucose: "Negative",
    protein: "Trace",
    pH: "6.5",
    blood: "Negative",
    ketones: "Negative",
    bilirubin: "Negative",
    urobilinogen: "Normal",
    nitrite: "Positive",
    leukocytes: "Trace",
    specificGravity: "1.020",
  };

  const handleLabResultChange = (param, value) => {
    setLabResults({ ...labResults, [param]: value });
  };

  const getMatchStatus = (param) => {
    if (!labResults[param]) return null;
    return labResults[param].toLowerCase() === aiResults[param].toLowerCase()
      ? "match"
      : "mismatch";
  };

  const getMatchColor = (status) => {
    if (!status) return "";
    return status === "match"
      ? "border-green-500 bg-green-50"
      : "border-red-500 bg-red-50";
  };

  const parameters = [
    { key: "glucose", label: "Glucose" },
    { key: "protein", label: "Protein" },
    { key: "pH", label: "pH" },
    { key: "blood", label: "Blood" },
    { key: "ketones", label: "Ketones" },
    { key: "bilirubin", label: "Bilirubin" },
    { key: "urobilinogen", label: "Urobilinogen" },
    { key: "nitrite", label: "Nitrite" },
    { key: "leukocytes", label: "Leukocytes" },
    { key: "specificGravity", label: "Specific Gravity" },
  ];

  const matchCount = parameters.filter(
    (p) => getMatchStatus(p.key) === "match"
  ).length;
  const mismatchCount = parameters.filter(
    (p) => getMatchStatus(p.key) === "mismatch"
  ).length;
  const totalFilled = parameters.filter((p) => labResults[p.key]).length;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Validation Against Lab Results
                </h1>
                <p className="text-gray-600">
                  Compare AI analysis with laboratory test results
                </p>
              </div>
            </div>
          </div>
        </div>

        {totalFilled > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {matchCount}
                </div>
                <div className="text-sm text-gray-600">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {mismatchCount}
                </div>
                <div className="text-sm text-gray-600">Mismatches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {totalFilled > 0
                    ? Math.round((matchCount / totalFilled) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Enter Laboratory Results
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lab Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parameters.map((param) => (
                  <tr key={param.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {param.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aiResults[param.key]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={labResults[param.key]}
                        onChange={(e) =>
                          handleLabResultChange(param.key, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${getMatchColor(
                          getMatchStatus(param.key)
                        )}`}
                        placeholder="Enter lab result"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getMatchStatus(param.key) === "match" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Match
                        </span>
                      )}
                      {getMatchStatus(param.key) === "mismatch" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Mismatch
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validation Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Add any notes or observations about the validation"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={() =>
                onComplete({ labResults, notes, matchCount, mismatchCount })
              }
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Validation
              <CheckCircle className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UrineTestSystem = () => {
  const [currentStep, setCurrentStep] = useState("upload");
  const [testData, setTestData] = useState({});

  const handleUploadNext = (data) => {
    setTestData(data);
    setCurrentStep("details");
  };

  const handleDetailsNext = (data) => {
    setTestData(data);
    setCurrentStep("processing");
  };

  const handleProcessingNext = (data) => {
    setTestData(data);
    setCurrentStep("results");
  };

  const handleResultsNext = (data) => {
    setTestData(data);
    setCurrentStep("report");
  };

  const handleReportNext = (data) => {
    setTestData(data);
    setCurrentStep("history");
  };

  const handleViewDetails = (item) => {
    setTestData(item);
    setCurrentStep("report");
  };

  const handleValidation = (item) => {
    setTestData(item);
    setCurrentStep("validation");
  };

  const handleValidationComplete = (validationData) => {
    alert("Validation completed successfully!");
    setCurrentStep("history");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === "upload" && (
        <UploadUrineStrip onNext={handleUploadNext} />
      )}
      {currentStep === "details" && (
        <AddTestDetails
          uploadedData={testData}
          onNext={handleDetailsNext}
          onBack={() => setCurrentStep("upload")}
        />
      )}
      {currentStep === "processing" && (
        <ImageProcessingPreview
          testData={testData}
          onNext={handleProcessingNext}
          onBack={() => setCurrentStep("details")}
        />
      )}
      {currentStep === "results" && (
        <AnalysisResult
          testData={testData}
          onNext={handleResultsNext}
          onBack={() => setCurrentStep("processing")}
        />
      )}
      {currentStep === "report" && (
        <FullTestReport
          testData={testData}
          onNext={handleReportNext}
          onBack={() => setCurrentStep("results")}
        />
      )}
      {currentStep === "history" && (
        <TestHistory
          onViewDetails={handleViewDetails}
          onValidation={handleValidation}
          onBack={() => setCurrentStep("report")}
        />
      )}
      {currentStep === "validation" && (
        <ValidationAgainstLab
          testData={testData}
          onComplete={handleValidationComplete}
          onBack={() => setCurrentStep("history")}
        />
      )}
    </div>
  );
};

export default UrineTestSystem;
