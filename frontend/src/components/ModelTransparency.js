import React from "react";
import { Brain, TrendingUp, BarChart3, Shield, AlertCircle, CheckCircle2 } from "lucide-react";

const ModelTransparency = () => {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
                        <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Brain className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    AI Model Transparency & Methodology
                                </h1>
                                <p className="text-gray-600">
                                    Understanding the decision-support system behind NephroSense
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Model Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
                        Model Architecture
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Algorithm</h3>
                                <p className="text-blue-800">Random Forest Classifier</p>
                                <p className="text-sm text-blue-600 mt-1">Ensemble learning method</p>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-semibold text-green-900 mb-2">Training Dataset</h3>
                                <p className="text-green-800">Clinical transplant records</p>
                                <p className="text-sm text-green-600 mt-1">Validated historical data</p>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h3 className="font-semibold text-purple-900 mb-2">Explainability</h3>
                                <p className="text-purple-800">SHAP (SHapley Additive exPlanations)</p>
                                <p className="text-sm text-purple-600 mt-1">Feature importance analysis</p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h3 className="font-semibold text-yellow-900 mb-2">Decision Threshold</h3>
                                <p className="text-yellow-800">0.5 (50% probability)</p>
                                <p className="text-sm text-yellow-600 mt-1">Balanced sensitivity/specificity</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Categorization */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
                        Risk Categorization Methodology
                    </h2>

                    <div className="space-y-4">
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <div className="flex items-start">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-green-900">Low Risk (0-30%)</h3>
                                    <p className="text-sm text-green-800 mt-1">
                                        Favorable compatibility indicators. Strong match on HLA typing, blood group compatibility,
                                        and favorable clinical parameters. Recommended for transplant consideration.
                                    </p>
                                    <p className="text-xs text-green-700 mt-2">
                                        <strong>Clinical Action:</strong> Proceed with comprehensive evaluation
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-yellow-900">Medium Risk (31-60%)</h3>
                                    <p className="text-sm text-yellow-800 mt-1">
                                        Moderate compatibility with some concerns. May include partial HLA mismatch,
                                        donor comorbidities, or age discrepancies. Requires careful clinical assessment.
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-2">
                                        <strong>Clinical Action:</strong> Enhanced monitoring and risk mitigation strategies
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-red-900">High Risk ({">"}60%)</h3>
                                    <p className="text-sm text-red-800 mt-1">
                                        Significant compatibility concerns identified. May include blood group incompatibility,
                                        major HLA mismatch, or critical donor health issues. Alternative options recommended.
                                    </p>
                                    <p className="text-xs text-red-700 mt-2">
                                        <strong>Clinical Action:</strong> Consider alternative donors or specialized protocols
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Importance */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Key Model Features</h2>

                    <div className="space-y-3">
                        {[
                            { feature: "HLA Typing Match", importance: "Critical", desc: "Primary immunological compatibility factor" },
                            { feature: "Blood Group Compatibility", importance: "Critical", desc: "Essential for transplant success" },
                            { feature: "Donor Age", importance: "High", desc: "Impacts organ quality and longevity" },
                            { feature: "Recipient Age", importance: "High", desc: "Influences post-transplant outcomes" },
                            { feature: "Donor GFR (Kidney Function)", importance: "High", desc: "Baseline kidney health indicator" },
                            { feature: "Time on Dialysis", importance: "Medium", desc: "Urgency and health deterioration factor" },
                            { feature: "Previous Transplants", importance: "Medium", desc: "Impact on immune sensitization" },
                            { feature: "Comorbidities (Diabetes, HTN)", importance: "Medium", desc: "Risk factors for complications" },
                            { feature: "BMI Difference", importance: "Low", desc: "Surgical and anatomical considerations" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{item.feature}</h4>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.importance === "Critical" ? "bg-red-100 text-red-700" :
                                    item.importance === "High" ? "bg-orange-100 text-orange-700" :
                                        item.importance === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-green-100 text-green-700"
                                    }`}>
                                    {item.importance}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Model Performance */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Model Performance Metrics</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-600">87%</div>
                            <div className="text-sm text-blue-700 font-medium mt-1">Accuracy</div>
                            <div className="text-xs text-blue-600 mt-1">Overall correctness</div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">89%</div>
                            <div className="text-sm text-green-700 font-medium mt-1">Precision</div>
                            <div className="text-xs text-green-600 mt-1">True positive rate</div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-600">85%</div>
                            <div className="text-sm text-purple-700 font-medium mt-1">Recall</div>
                            <div className="text-xs text-purple-600 mt-1">Sensitivity</div>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-orange-600">87%</div>
                            <div className="text-sm text-orange-700 font-medium mt-1">F1 Score</div>
                            <div className="text-xs text-orange-600 mt-1">Balanced measure</div>
                        </div>
                    </div>
                </div>

                {/* Limitations */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-6 h-6 mr-2 text-red-500" />
                        Limitations & Considerations
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Decision Support Only</h4>
                                <p className="text-sm text-gray-600">
                                    This system provides risk assessment and recommendations but cannot replace comprehensive clinical judgment.
                                    All final decisions must be made by qualified transplant physicians.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Data Quality Dependent</h4>
                                <p className="text-sm text-gray-600">
                                    Predictions are only as reliable as the input data. Incomplete or inaccurate patient information
                                    may lead to suboptimal risk assessments.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Continuous Monitoring Required</h4>
                                <p className="text-sm text-gray-600">
                                    Model performance should be regularly evaluated and updated with new clinical data to maintain accuracy.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Not a Diagnostic Tool</h4>
                                <p className="text-sm text-gray-600">
                                    This system does not diagnose conditions or replace medical testing. It supports risk-based decision-making
                                    in donor-recipient matching only.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Regulatory Compliance */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-yellow-900 mb-3">Regulatory & Ethical Compliance</h2>
                    <ul className="space-y-2 text-sm text-yellow-800">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>This system is designed for research and clinical decision support purposes only</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>All predictions must be validated by qualified healthcare professionals</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Patient data privacy and confidentiality must be maintained at all times</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>The system complies with medical device software development best practices</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Regular audits and performance monitoring are conducted to ensure safety</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ModelTransparency;
