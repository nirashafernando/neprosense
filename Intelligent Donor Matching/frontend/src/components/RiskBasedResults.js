import React, { useState } from "react";
import { Trophy, Heart, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";

const RiskBasedResults = ({ result, onRunAnother }) => {
    const [expandedDonor, setExpandedDonor] = useState(null);

    if (!result) return null;

    const { predictions, topDonors, totalEvaluated, disclaimer } = result;

    const getRiskColor = (category) => {
        switch (category) {
            case "Low Risk":
                return {
                    bg: "bg-green-50",
                    border: "border-green-300",
                    text: "text-green-800",
                    badge: "bg-green-100 border-green-400"
                };
            case "Medium Risk":
                return {
                    bg: "bg-yellow-50",
                    border: "border-yellow-300",
                    text: "text-yellow-800",
                    badge: "bg-yellow-100 border-yellow-400"
                };
            case "High Risk":
                return {
                    bg: "bg-red-50",
                    border: "border-red-300",
                    text: "text-red-800",
                    badge: "bg-red-100 border-red-400"
                };
            default:
                return {
                    bg: "bg-gray-50",
                    border: "border-gray-300",
                    text: "text-gray-800",
                    badge: "bg-gray-100 border-gray-400"
                };
        }
    };

    const toggleExpand = (donorId) => {
        setExpandedDonor(expandedDonor === donorId ? null : donorId);
    };

    return (
        <div className="space-y-6">
            {/* Header with Summary */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Analysis Complete</h2>
                        <p className="text-green-100">
                            Evaluated <span className="font-bold">{totalEvaluated}</span> donor(s) |
                            Top recommendation available
                        </p>
                    </div>
                    <Heart className="w-16 h-16 opacity-50" />
                </div>
            </div>

            {/* Top 3 Donors - Highlighted */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-green-300">
                <div className="flex items-center space-x-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-gray-900">Top 3 Recommended Donors (Lowest Risk)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topDonors?.slice(0, 3).map((donor, index) => {
                        const colors = getRiskColor(donor.riskCategory.category);
                        return (
                            <div
                                key={donor.donorId}
                                className={`relative ${colors.bg} border-2 ${colors.border} rounded-lg p-5 shadow-md`}
                            >
                                {/* Rank Badge */}
                                <div className="absolute -top-3 -left-3 bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                    #{donor.rank}
                                </div>

                                <div className="mt-2">
                                    <h4 className="font-bold text-lg text-gray-900 mb-2">{donor.donorId}</h4>

                                    {/* Compatibility Score */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">Compatibility Score</span>
                                            <span className={`font-bold ${colors.text}`}>
                                                {(donor.probability * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${donor.riskCategory.category === "Low Risk"
                                                        ? "bg-green-500"
                                                        : donor.riskCategory.category === "Medium Risk"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                                style={{ width: `${donor.probability * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Risk Category Badge */}
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 ${colors.badge} ${colors.text}`}>
                                        {donor.riskCategory.category}
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-gray-600 mt-3">
                                        {donor.riskCategory.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* All Results - Ranked List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">All Evaluated Donors (Ranked by Risk)</h3>
                    <p className="text-sm text-gray-600 mt-1">Click on any donor to view detailed SHAP explanation</p>
                </div>

                <div className="divide-y divide-gray-200">
                    {predictions?.map((pred) => {
                        const colors = getRiskColor(pred.riskCategory.category);
                        const isExpanded = expandedDonor === pred.donorId;

                        return (
                            <div key={pred.donorId} className="hover:bg-gray-50 transition-colors">
                                <div
                                    onClick={() => toggleExpand(pred.donorId)}
                                    className="px-6 py-4 cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            {/* Rank */}
                                            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                                                #{pred.rank}
                                            </div>

                                            {/* Donor Info */}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{pred.donorId}</h4>
                                                <p className="text-sm text-gray-600">{pred.explanationText}</p>
                                            </div>

                                            {/* Risk Display */}
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {(pred.probability * 100).toFixed(1)}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">Compatibility Score</div>
                                                </div>

                                                <div className={`px-4 py-2 rounded-full font-semibold text-sm border-2 ${colors.badge} ${colors.text}`}>
                                                    {pred.riskCategory.category}
                                                </div>

                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SHAP Explanation Panel */}
                                {isExpanded && pred.shapExplanation && pred.shapExplanation.length > 0 && (
                                    <div className="px-6 pb-4 bg-gray-50">
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Info className="w-5 h-5 text-blue-500" />
                                                <h5 className="font-semibold text-gray-900">AI Explanation - Top Contributing Factors</h5>
                                            </div>

                                            <div className="space-y-2">
                                                {pred.shapExplanation.map((exp, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                        <div className="flex-1">
                                                            <span className="text-sm font-medium text-gray-700">{exp.feature}</span>
                                                            <p className="text-xs text-gray-500 mt-1">{exp.description}</p>
                                                        </div>
                                                        <div className={`ml-4 px-3 py-1 rounded text-xs font-semibold ${exp.importance > 0
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                            }`}>
                                                            {exp.importance > 0 ? "↑" : "↓"} {Math.abs(exp.importance).toFixed(3)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {predictions?.filter(p => p.riskCategory.category === "Low Risk").length || 0}
                        </div>
                        <div className="text-sm text-green-700 font-medium mt-1">Low Risk Donors</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-yellow-600">
                            {predictions?.filter(p => p.riskCategory.category === "Medium Risk").length || 0}
                        </div>
                        <div className="text-sm text-yellow-700 font-medium mt-1">Medium Risk Donors</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-red-600">
                            {predictions?.filter(p => p.riskCategory.category === "High Risk").length || 0}
                        </div>
                        <div className="text-sm text-red-700 font-medium mt-1">High Risk Donors</div>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Clinical Decision Support Disclaimer</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>{disclaimer}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onRunAnother}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Run Another Analysis
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    Print Results
                </button>
            </div>
        </div>
    );
};

export default RiskBasedResults;
