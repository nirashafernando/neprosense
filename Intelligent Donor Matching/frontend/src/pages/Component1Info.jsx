import React from "react";
import { useNavigate } from "react-router-dom";
import { Microscope, ArrowLeft, AlertCircle, CheckCircle, Github } from "lucide-react";

const Component1Info = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </button>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <Microscope className="w-12 h-12 text-gray-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Urine Test Analysis</h1>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full">
                            Conceptual / In Development
                        </span>
                    </div>

                    <p className="text-lg text-gray-600">
                        CNN-based automated analysis of urine dipstick images for early detection of CKD biomarkers and risk indicators.
                    </p>
                </div>

                {/* Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
                    <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 mr-4" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                Development Status
                            </h3>
                            <p className="text-yellow-800 mb-3">
                                This component is currently in the conceptual and research phase. The functionality
                                described below represents the planned features and technical approach.
                            </p>
                            <button
                                onClick={() => navigate('/make-prediction')}
                                className="bg-medical-600 hover:bg-medical-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Explore Active Component 4 (Donor Matching)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overview */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                    <p className="text-gray-700 mb-4">
                        The Urine Test Analysis component leverages Convolutional Neural Networks (CNN) to automatically
                        analyze urine dipstick test images, identifying and quantifying key biomarkers associated with
                        chronic kidney disease. This enables rapid, automated screening for early CKD detection.
                    </p>
                    <p className="text-gray-700">
                        By processing standard dipstick images, the system can assess multiple parameters including protein levels,
                        glucose, blood cells, and pH, providing instant risk assessment and flagging abnormalities for further
                        clinical review.
                    </p>
                </div>

                {/* Technical Approach */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Approach</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Image Processing Pipeline</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Image capture and preprocessing</li>
                                <li>Color calibration and normalization</li>
                                <li>Region of interest detection</li>
                                <li>Multi-parameter extraction</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">CNN Architecture</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Custom CNN model for dipstick recognition</li>
                                <li>Transfer learning from medical imaging models</li>
                                <li>Multi-output regression for parameter quantification</li>
                                <li>Uncertainty estimation for confidence scoring</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">CKD Risk Assessment</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Biomarker correlation with CKD stages</li>
                                <li>Risk stratification algorithms</li>
                                <li>Longitudinal tracking for progression monitoring</li>
                                <li>Integration with electronic health records</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Expected Features */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Expected Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Automated dipstick image analysis",
                            "Multi-parameter biomarker detection",
                            "Real-time risk scoring",
                            "Abnormality flagging system",
                            "Historical trend analysis",
                            "Quality control validation",
                            "Mobile app integration",
                            "API for EMR systems"
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-medical-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Research Links */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Research & Development</h2>
                    <p className="text-gray-700 mb-4">
                        This component is being developed as part of ongoing research into AI-assisted early CKD detection.
                    </p>

                    <button
                        className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                    >
                        <Github className="w-5 h-5" />
                        View Research Repository
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Component1Info;
