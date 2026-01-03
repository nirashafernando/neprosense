import React from "react";
import { useNavigate } from "react-router-dom";
import { Image, ArrowLeft, AlertCircle, CheckCircle, Github } from "lucide-react";

const Component2Info = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <Image className="w-12 h-12 text-gray-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Clinical Image Analysis</h1>
                        </div>
                    </div>

                    <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full inline-block mb-4">
                        Conceptual / In Development
                    </span>

                    <p className="text-lg text-gray-600">
                        AI-assisted interpretation of ultrasound and medical imaging to support nephrologists in diagnostic decision-making.
                    </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
                    <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 mr-4" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Development Status</h3>
                            <p className="text-yellow-800 mb-3">
                                This component is currently in the conceptual phase. Features described represent planned capabilities.
                            </p>
                            <button onClick={() => navigate('/make-prediction')}
                                className="bg-medical-600 hover:bg-medical-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Explore Active Component 4
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                    <p className="text-gray-700 mb-4">
                        Clinical Image Analysis provides AI-powered interpretation of kidney ultrasound scans, CT images, and other medical
                        imaging modalities to assist nephrologists in identifying structural abnormalities, measuring kidney dimensions,
                        and detecting pathological changes.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Approach</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Image Processing</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Deep learning-based segmentation</li>
                                <li>Automated kidney boundary detection</li>
                                <li>Volume and size measurements</li>
                                <li>Texture analysis for pathology detection</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Diagnostic Support</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Abnormality detection and classification</li>
                                <li>Longitudinal comparison analysis</li>
                                <li>SHAP-based explanation of findings</li>
                                <li>Integration with radiology workflows</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Expected Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Ultrasound analysis", "CT scan interpretation", "MRI processing", "Automated measurements",
                            "Pathology detection", "Report generation", "DICOM integration", "Multi-modal fusion"
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-medical-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component2Info;
