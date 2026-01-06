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

const UploadKidneyImage = ({ onNext }) => {
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-8 text-2xl font-bold text-center">
            Upload Kidney Ultrasound Image
          </h1>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="p-16 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500"
          >
            {!previewUrl ? (
              <div>
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="mb-2 text-lg font-medium text-gray-700">
                  Drag and drop an image or
                </p>
                <label className="inline-flex items-center px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  Select File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="mt-4 text-sm text-gray-500">JPG, PNG, DICOM</p>
              </div>
            ) : (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto mb-4 rounded-lg max-h-96"
                />
                <p className="mb-4 text-sm text-gray-600">
                  {selectedFile.name}
                </p>
                <label className="inline-flex items-center px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
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
            <div className="mt-8 text-center">
              <button
                onClick={() =>
                  onNext({ image: previewUrl, fileName: selectedFile.name })
                }
                className="px-8 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
              >
                Continue to Preprocessing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImagePreprocessing = ({ uploadedData, onNext, onBack }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const handleProcess = (type) => {
    setSelectedProcess(type);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center mb-6 space-x-2 text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-8 text-2xl font-bold text-center">
            Image Preprocessing
          </h1>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => handleProcess("grayscale")}
              className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50"
            >
              Grayscale
            </button>
            <button
              onClick={() => handleProcess("denoise")}
              className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50"
            >
              Denoise
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="mb-3 text-sm font-medium text-center text-gray-600">
                Ultrasound Image
              </h3>
              <div className="flex items-center justify-center p-4 bg-gray-100 border-2 border-gray-300 rounded-lg aspect-square">
                <div className="text-6xl text-gray-400">✕</div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-center text-gray-600">
                Preprocessing Image
              </h3>
              <div className="flex items-center justify-center p-4 bg-gray-100 border-2 border-gray-300 rounded-lg aspect-square">
                {processing ? (
                  <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                ) : (
                  <div className="text-6xl text-gray-400">✕</div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => onNext(uploadedData)}
              className="px-8 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              Continue to Segmentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const KidneySegmentation = ({ testData, onNext, onBack }) => {
  const [showSegmentation, setShowSegmentation] = useState(false);

  const handleSegment = () => {
    setShowSegmentation(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center mb-6 space-x-2 text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-8 text-2xl font-bold text-center">
            Kidney Segmentation
          </h1>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <div className="flex items-center justify-center p-4 bg-gray-100 border-2 border-gray-300 rounded-lg aspect-video">
                <div className="text-gray-400 text-8xl">✕</div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="p-4 mb-4 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="mb-3 font-semibold">Legends</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
                    <span className="text-sm">Kidney</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-400"></div>
                    <span className="text-sm">Cortex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleSegment}
              className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50"
            >
              Re-run Segmentation
            </button>
            <button className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
              Confirm
            </button>
            <button className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
              View Thickness
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => onNext(testData)}
              className="px-8 py-3 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              Proceed to Feature Extraction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureExtraction = ({ testData, onNext, onBack }) => {
  const [echogenicityLevel, setEchogenicityLevel] = useState(50);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center mb-6 space-x-2 text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-xl font-bold text-center">
            Feature Extraction
          </h2>

          <div className="space-y-6">
            <div className="p-4 border border-gray-300 rounded-lg">
              <h3 className="mb-4 font-semibold text-center">
                Cortex Thickness
              </h3>
              <div className="grid grid-cols-3 gap-2 text-sm text-center">
                <div className="p-2 border border-gray-300"></div>
                <div className="p-2 border border-gray-300"></div>
                <div className="p-2 border border-gray-300">0.0 mm</div>
              </div>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg">
              <h3 className="mb-4 font-semibold text-center">Echogenicity</h3>
              <div className="px-4 py-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={echogenicityLevel}
                  onChange={(e) => setEchogenicityLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${echogenicityLevel}%, #d1d5db ${echogenicityLevel}%, #d1d5db 100%)`,
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Low</span>
                  <span>Level: {echogenicityLevel}</span>
                  <span>High</span>
                </div>
              </div>
              <p className="text-sm text-center text-gray-600">
                Brightness level
              </p>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg">
              <h3 className="mb-4 font-semibold text-center">
                Kidney Shape/Size
              </h3>
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
                <div className="text-4xl text-gray-400">✕</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => onNext(testData)}
                className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50"
              >
                Analyze for CKD Stage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValidationComparison = ({ testData, onNext, onBack }) => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center mb-6 space-x-2 text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-xl font-bold text-center">
            Validation & Comparison
          </h2>

          <div className="p-6 mb-6 border border-gray-300 rounded-lg">
            <div className="gap-4 m-auto mb-4 ">
              <div className="text-center ">
                <div className="p-4 mb-2 border-2 border-gray-300 rounded-lg">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <p className="text-sm font-medium">AI Predicted Stage</p>
              </div>
              
            </div>

            <div className="py-2 text-center border-t border-gray-300">
              <p className="text-sm">
                Accuracy: <span className="font-bold">0.84</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* <button className="w-full px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
              Upload Radiologic Label
            </button> */}
            <button
              onClick={() => onNext(testData)}
              className="w-full px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50"
            >
              Download Validation Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CKDStagePrediction = ({ testData, onBack }) => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center mb-6 space-x-2 text-gray-600 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 pr-6 border-r border-gray-200">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 mb-4 bg-gray-200 rounded-full"></div>
                <h3 className="mb-2 font-semibold">User Info</h3>
                <div className="w-full space-y-1 text-sm">
                  <div className="py-1 "></div>
                  <div className="py-1 "></div>
                  <div className="py-1 b"></div>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h1 className="mb-6 text-2xl font-bold text-center">
                CKD Stage Prediction
              </h1>

              <div className="p-8 mb-6 border-2 border-gray-300 rounded-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-6xl font-bold">2</div>
                </div>
                <div className="p-3 text-center bg-gray-100 border border-gray-300 rounded">
                  <p className="text-sm">Stage 2: Mild CKD detected</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 font-semibold">
                  Summary of Extracted Features
                </h3>
                <div className="space-y-2">
                  <div className="py-2 "></div>
                  <div className="py-2 "></div>
                  <div className="py-2 "></div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
                  View Full Report
                </button>
                <button className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
                  Go Back
                </button>
                <button className="px-6 py-2 text-gray-700 transition-colors bg-white border-2 border-gray-300 rounded hover:bg-gray-50">
                  Start New Prediction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KidneyUltrasoundSystem = () => {
  const [currentStep, setCurrentStep] = useState("upload");
  const [testData, setTestData] = useState({});

  const handleUploadNext = (data) => {
    setTestData(data);
    setCurrentStep("preprocessing");
  };

  const handlePreprocessingNext = (data) => {
    setTestData(data);
    setCurrentStep("segmentation");
  };

  const handleSegmentationNext = (data) => {
    setTestData(data);
    setCurrentStep("extraction");
  };

  const handleExtractionNext = (data) => {
    setTestData(data);
    setCurrentStep("validation");
  };

  const handleValidationNext = (data) => {
    setTestData(data);
    setCurrentStep("prediction");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === "upload" && (
        <UploadKidneyImage onNext={handleUploadNext} />
      )}
      {currentStep === "preprocessing" && (
        <ImagePreprocessing
          uploadedData={testData}
          onNext={handlePreprocessingNext}
          onBack={() => setCurrentStep("upload")}
        />
      )}
      {currentStep === "segmentation" && (
        <KidneySegmentation
          testData={testData}
          onNext={handleSegmentationNext}
          onBack={() => setCurrentStep("preprocessing")}
        />
      )}
      {currentStep === "extraction" && (
        <FeatureExtraction
          testData={testData}
          onNext={handleExtractionNext}
          onBack={() => setCurrentStep("segmentation")}
        />
      )}
      {currentStep === "validation" && (
        <ValidationComparison
          testData={testData}
          onNext={handleValidationNext}
          onBack={() => setCurrentStep("extraction")}
        />
      )}
      {currentStep === "prediction" && (
        <CKDStagePrediction
          testData={testData}
          onBack={() => setCurrentStep("validation")}
        />
      )}
    </div>
  );
};

export default KidneyUltrasoundSystem;
