import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * MatchParameterExplanation Component
 * 
 * Provides doctor-friendly explanations for match parameters, HLA scores,
 * and risk assessments to help clinicians make informed decisions.
 */
const MatchParameterExplanation = ({ donor, recipient }) => {
    if (!donor || !recipient) return null;

    const hlaMatch = donor.parameters?.hlaMatchScore ?? 0;
    const compatibility = donor.matchScore ?? 0;
    const riskCategory = donor.riskCategory?.category || 'Unknown';
    const probability = donor.probability ?? 0;

    // Helper functions
    const getHLAMatchLevel = (score) => {
        if (score === 6) return "Perfect Match";
        if (score >= 5) return "Excellent Match";
        if (score >= 4) return "Good Match";
        if (score >= 3) return "Acceptable Match";
        return "Poor Match";
    };

    const getHLAExplanation = (score) => {
        if (score === 6) {
            return "All 6 HLA antigens match perfectly (2 HLA-A, 2 HLA-B, 2 HLA-DR). This is the ideal scenario with the lowest rejection risk and best long-term outcomes.";
        } else if (score >= 4) {
            return `${score} out of 6 HLA antigens match. ${6 - score} mismatch(es) detected. This is considered ${getHLAMatchLevel(score).toLowerCase()} and acceptable for transplant.`;
        } else {
            return `Only ${score} out of 6 HLA antigens match. ${6 - score} mismatch(es) detected. Higher immunosuppression may be required.`;
        }
    };

    const getRiskExplanation = (category, compatScore, prob) => {
        const rejectionRisk = Math.round(prob * 100);
        const successProb = 100 - rejectionRisk;

        if (category === "Low Risk") {
            return `${successProb}% predicted compatibility with ${rejectionRisk}% rejection risk. This match shows favorable indicators for successful transplant outcomes. Recommended for transplant consideration with standard immunosuppression protocol.`;
        } else if (category === "Medium Risk") {
            return `${successProb}% predicted compatibility with ${rejectionRisk}% rejection risk. Moderate risk factors detected. Careful clinical monitoring and potentially enhanced immunosuppression recommended post-transplant.`;
        } else {
            return `${successProb}% predicted compatibility with ${rejectionRisk}% rejection risk. Significant risk factors identified. Consider alternative donor options, additional crossmatch testing, or enhanced immunosuppression protocols.`;
        }
    };

    const getParameterMatches = () => {
        const matches = [];

        // Blood Group
        const bloodMatch = donor.parameters?.bloodGroup === recipient.bloodGroup;
        matches.push({
            isMatch: bloodMatch,
            isWarning: false,
            label: "Blood Group",
            value: `${donor.parameters?.bloodGroup || 'N/A'} → ${recipient.bloodGroup}`,
            description: bloodMatch ? "Perfect ABO match" : "ABO mismatch - requires special protocols"
        });

        // HLA Match
        matches.push({
            isMatch: hlaMatch >= 4,
            isWarning: hlaMatch === 3,
            label: "HLA Match",
            value: `${hlaMatch}/6 (${getHLAMatchLevel(hlaMatch)})`,
            description: getHLAExplanation(hlaMatch)
        });

        // Age Difference
        const ageDiff = Math.abs((donor.parameters?.age ?? 0) - (recipient.age ?? 0));
        matches.push({
            isMatch: ageDiff <= 15,
            isWarning: ageDiff > 15 && ageDiff <= 25,
            label: "Age Difference",
            value: `${ageDiff} years`,
            description: ageDiff <= 15
                ? "Optimal age matching"
                : ageDiff <= 25
                    ? "Acceptable age difference"
                    : "Significant age gap - may affect outcomes"
        });

        // Donor eGFR
        const donorGFR = donor.parameters?.gfr ?? 0;
        matches.push({
            isMatch: donorGFR >= 90,
            isWarning: donorGFR >= 60 && donorGFR < 90,
            label: "Donor eGFR",
            value: `${donorGFR} ml/min/1.73m²`,
            description: donorGFR >= 90
                ? "Excellent kidney function"
                : donorGFR >= 60
                    ? "Good kidney function"
                    : "Reduced kidney function - careful evaluation needed"
        });

        // Donor BMI
        const donorBMI = donor.parameters?.bmi ?? 0;
        matches.push({
            isMatch: donorBMI >= 18.5 && donorBMI <= 30,
            isWarning: (donorBMI > 30 && donorBMI <= 35) || (donorBMI >= 17 && donorBMI < 18.5),
            label: "Donor BMI",
            value: donorBMI.toFixed(1),
            description: donorBMI >= 18.5 && donorBMI <= 25
                ? "Optimal BMI range"
                : donorBMI > 25 && donorBMI <= 30
                    ? "Slightly elevated but acceptable"
                    : donorBMI > 30
                        ? "Elevated BMI - increased surgical risk"
                        : "Low BMI - nutritional assessment recommended"
        });

        // Comorbidities
        const hasDiabetes = donor.parameters?.diabetes ?? false;
        const hasHTN = donor.parameters?.hypertension ?? false;
        const smokes = donor.parameters?.smoking ?? false;
        const hasComorbidities = hasDiabetes || hasHTN || smokes;

        const comorbidityList = [];
        if (hasDiabetes) comorbidityList.push("Diabetes");
        if (hasHTN) comorbidityList.push("Hypertension");
        if (smokes) comorbidityList.push("Smoking");

        matches.push({
            isMatch: !hasComorbidities,
            isWarning: hasComorbidities && comorbidityList.length === 1,
            label: "Donor Health",
            value: hasComorbidities ? comorbidityList.join(", ") : "No comorbidities",
            description: !hasComorbidities
                ? "No significant comorbidities detected"
                : `Present: ${comorbidityList.join(", ")} - may affect graft survival`
        });

        return matches;
    };

    const parameterMatches = getParameterMatches();

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
            <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Info className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-blue-900 mb-1">Clinical Interpretation</h4>
                    <p className="text-sm text-blue-700">Detailed parameter analysis for informed decision-making</p>
                </div>
            </div>

            {/* Risk Assessment Summary */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${riskCategory === 'Low Risk'
                            ? 'bg-green-100 text-green-700'
                            : riskCategory === 'Medium Risk'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                        {riskCategory}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{compatibility}%</span>
                    <span className="text-sm text-gray-600">Compatibility</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                    {getRiskExplanation(riskCategory, compatibility, probability)}
                </p>
            </div>

            {/* Parameter Breakdown */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-600 rounded"></span>
                    Parameter Analysis
                </h5>
                <div className="space-y-3">
                    {parameterMatches.map((match, idx) => (
                        <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="mt-0.5">
                                {match.isMatch ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : match.isWarning ? (
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">{match.label}:</span>
                                    <span className={`text-sm font-semibold ${match.isMatch
                                            ? 'text-green-700'
                                            : match.isWarning
                                                ? 'text-yellow-700'
                                                : 'text-red-700'
                                        }`}>
                                        {match.value}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{match.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clinical Recommendation */}
            <div className="mt-4 bg-blue-100 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900 font-medium">
                    <strong>Note:</strong> This system provides decision support only and does not replace professional medical judgment.
                    All transplant decisions should be made by qualified medical professionals considering the complete clinical picture.
                </p>
            </div>
        </div>
    );
};

export default MatchParameterExplanation;
