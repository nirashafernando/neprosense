import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, TrendingUp, ChevronDown, ChevronUp, Activity } from "lucide-react";

const RiskPrediction = () => {
  const [showDetails, setShowDetails] = useState(false);

  const [predictionData] = useState({
    riskLevel: "MODERATE",
    probability: 65,
    factors: [
      { name: "Low Hydration", impact: "High", description: "Water intake 40% below recommended" },
      { name: "High Salt Intake", impact: "Medium", description: "Exceeding daily salt limit by 60%" },
      { name: "Insufficient Sleep", impact: "Medium", description: "Sleep duration below optimal range" },
      { name: "Limited Physical Activity", impact: "Low", description: "Minimal daily movement" },
    ],
    recommendations: [
      "Increase water intake to 2.5L daily",
      "Reduce salt consumption to under 5g per day",
      "Aim for 7-8 hours of quality sleep",
      "Incorporate 30 minutes of moderate activity daily",
    ],
    nextSteps: [
      "Schedule follow-up in 2 weeks",
      "Consult with nutritionist for diet plan",
      "Monitor blood pressure regularly"
    ];

    if (riskLevel === "HIGH") {
      steps.unshift("Consult with nephrologist immediately");
      steps.push("Consider dietary counseling");
      steps.push("Daily blood pressure monitoring");
    } else if (riskLevel === "MODERATE") {
      steps.unshift("Schedule nutritionist consultation");
      steps.push("Weekly weight tracking");
    } else {
      steps.unshift("Continue healthy habits");
      steps.push("Monthly check-in");
    }

    return steps;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "LOW": return { bg: "bg-green-500", border: "border-green-500", text: "text-green-600", light: "bg-green-50" };
      case "MODERATE": return { bg: "bg-yellow-500", border: "border-yellow-500", text: "text-yellow-600", light: "bg-yellow-50" };
      case "HIGH": return { bg: "bg-red-500", border: "border-red-500", text: "text-red-600", light: "bg-red-50" };
      default: return { bg: "bg-gray-500", border: "border-gray-500", text: "text-gray-600", light: "bg-gray-50" };
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing lifestyle data with ML model...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const colors = getRiskColor(predictionData.riskLevel);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  CKD Risk Prediction Results
                </h1>
                <p className="text-gray-600">
                  ML-powered lifestyle risk assessment based on your latest data
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Level Display */}
        <div className={`bg-white rounded-xl shadow-lg p-8 border-4 ${colors.border} mb-8`}>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Predicted CKD Risk Level</h2>
            <div className={`inline-block px-12 py-6 ${colors.bg} text-white text-4xl font-bold rounded-2xl shadow-lg mb-6`}>
              {predictionData.riskLevel}
            </div>
            <p className="text-gray-600 mb-4">
              Based on your lifestyle data, there is a <span className="font-bold">{predictionData.probability}%</span> probability of CKD progression risk
            </p>

            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${colors.bg}`}
                style={{ width: `${predictionData.probability}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-2">
              <span>Low Risk</span>
              <span>Moderate Risk</span>
              <span>High Risk</span>
            </div>
          </div>
        </div>

        {/* Key Risk Factors */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Key Risk Factors Identified
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictionData.factors.map((factor, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{factor.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${factor.impact === "High" ? "bg-red-100 text-red-700" :
                      factor.impact === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                    }`}>
                    {factor.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Detailed Insights */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Hide Detailed Insights
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                View Detailed Insights
              </>
            )}
          </button>
        </div>

        {/* Detailed Insights Section */}
        {showDetails && (
          <div className="space-y-6 animate-fadeIn">
            {/* Personalized Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Personalized Recommendations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictionData.recommendations.map((rec, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-green-800">{rec}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Recommended Next Steps
              </h2>

              <div className="space-y-3">
                {predictionData.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded">
                      <span className="font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <p className="text-blue-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Decision Support Tool Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
              <div className="flex">
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">Clinical Decision Support Tool</h3>
                  <div className="text-yellow-800">
                    <p className="mb-2">
                      This AI-powered risk assessment is designed to support clinical decision-making and lifestyle management.
                      It does not replace professional medical advice, diagnosis, or treatment.
                    </p>
                    <p>
                      Please consult with a qualified healthcare provider for comprehensive medical evaluation and personalized care plans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskPrediction;