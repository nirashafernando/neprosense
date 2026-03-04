import React, { useState, useEffect } from 'react';
import { X, Award, TrendingUp, Activity, Users, CheckCircle, AlertTriangle, Download, Heart, Eye } from 'lucide-react';
import api from '../lib/axios';
import MatchParameterExplanation from './MatchParameterExplanation';

const MatchDetailsModal = ({ isOpen, onClose, predictionId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (isOpen && predictionId) {
            fetchPredictionDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, predictionId]);

    const fetchPredictionDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/predictions/batch/${predictionId}/details`);

            if (response.data.success) {
                // ===== DEBUG LOGGING =====
                console.log('=== MODAL DATA DEBUG ===');
                console.log('Full Response:', response.data.data);
                if (response.data.data.topDonors && response.data.data.topDonors.length > 0) {
                    const topDonor = response.data.data.topDonors[0];
                    console.log('Top Donor:', topDonor);
                    console.log('HLA Match Score:', topDonor.parameters?.hlaMatchScore);
                    console.log('Risk Category:', topDonor.riskCategory);
                    console.log('Match Score:', topDonor.matchScore);
                    console.log('Probability:', topDonor.probability);
                    console.log('Parameters:', topDonor.parameters);
                }
                console.log('========================');
                // ===== END DEBUG =====

                setData(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching prediction details:', err);
            setError(err.response?.data?.message || 'Failed to load prediction details');
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const response = await api.get(`/predictions/batch/${predictionId}/pdf`, {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Donor_Matching_Report_${predictionId.slice(-8)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading PDF:', err);
            alert('Failed to download PDF report. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-medical-600 to-medical-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg">
                                <Heart className="w-6 h-6 text-medical-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Donor Match Details</h2>
                                {data && (
                                    <p className="text-medical-100 text-sm">
                                        Recipient: {data.recipient.recipientId} • {data.totalEvaluated} Donors Evaluated
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading match details...</p>
                            </div>
                        ) : error ? (
                            <div className="p-12 text-center">
                                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4rounded-lg inline-block">
                                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                                    <p>{error}</p>
                                </div>
                            </div>
                        ) : data ? (
                            <div className="p-6 space-y-6">
                                {/* Top Match Summary */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-600 text-white p-3 rounded-full">
                                            <Award className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    Recommended Match (ML-Based): {data.topDonors[0].donorId}
                                                </h3>
                                                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                                                    {data.topDonors[0].matchScore}% Compatibility
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${data.topDonors[0].riskCategory?.category === 'Low Risk'
                                                    ? 'bg-green-100 text-green-700'
                                                    : data.topDonors[0].riskCategory?.category === 'Medium Risk'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {data.topDonors[0].riskCategory?.category || 'Unknown Risk'}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                    Why this donor is recommended (ML Analysis):
                                                </p>
                                                <ul className="space-y-2">
                                                    {data.explanation.reasons.map((reason, index) => (
                                                        <li key={index} className="flex items-start gap-2 text-gray-700">
                                                            <span className="text-green-600 mt-1">•</span>
                                                            <span className="text-sm">{reason}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Highlights */}
                                            {data.explanation.comparisonHighlights[data.topDonors[0].donorId]?.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {data.explanation.comparisonHighlights[data.topDonors[0].donorId].map((highlight, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                            ✓ {highlight}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Top 3 Comparison Table */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-medical-600" />
                                        Top 3 Donor Comparison
                                    </h3>

                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                            Parameter
                                                        </th>
                                                        {data.topDonors.map((donor, idx) => (
                                                            <th key={idx} className="px-4 py-3 text-center">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${idx === 0 ? 'bg-gold-100 text-yellow-700' :
                                                                        idx === 1 ? 'bg-gray-200 text-gray-700' :
                                                                            'bg-orange-100 text-orange-700'
                                                                        }`}>
                                                                        #{idx + 1} {donor.donorId}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-medical-600">
                                                                        {donor.matchScore}%
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${(() => {
                                                                        const category = donor.riskCategory?.category;
                                                                        console.log(`Risk for ${donor.donorId}:`, category, 'Full riskCategory:', donor.riskCategory);
                                                                        if (category === 'Low Risk') return 'bg-green-100 text-green-700';
                                                                        if (category === 'Medium Risk') return 'bg-yellow-100 text-yellow-700';
                                                                        return 'bg-red-100 text-red-700';
                                                                    })()}`}>
                                                                        {donor.riskCategory?.category || 'Unknown'}
                                                                    </span>
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {/* Blood Group */}
                                                    <ComparisonRow
                                                        label="Blood Group"
                                                        icon={<Heart className="w-4 h-4" />}
                                                        values={data.topDonors.map(d => d.parameters.bloodGroup)}
                                                        recipient={data.recipient.bloodGroup}
                                                        bestIndex={0}
                                                    />

                                                    {/* Age */}
                                                    <ComparisonRow
                                                        label="Age"
                                                        icon={<Activity className="w-4 h-4" />}
                                                        values={data.topDonors.map(d => `${d.parameters.age} years`)}
                                                        recipient={`${data.recipient.age} years`}
                                                        bestIndex={data.topDonors.findIndex(d => d.parameters.age < 40)}
                                                    />

                                                    {/* HLA Match */}
                                                    <ComparisonRow
                                                        label="HLA Match"
                                                        icon={<TrendingUp className="w-4 h-4" />}
                                                        values={data.topDonors.map(d => {
                                                            const hlaScore = d.parameters?.hlaMatchScore ?? 0;
                                                            console.log(`HLA Score for ${d.donorId}:`, hlaScore, 'Full params:', d.parameters);
                                                            return `${hlaScore}/6`;
                                                        })}
                                                        bestIndex={data.topDonors.reduce((best, curr, idx, arr) =>
                                                            (curr.parameters?.hlaMatchScore ?? 0) > (arr[best].parameters?.hlaMatchScore ?? 0) ? idx : best, 0
                                                        )}
                                                    />

                                                    {/* eGFR */}
                                                    <ComparisonRow
                                                        label="eGFR"
                                                        icon={<Activity className="w-4 h-4" />}
                                                        values={data.topDonors.map(d => `${d.parameters.gfr} ml/min`)}
                                                        bestIndex={data.topDonors.reduce((best, curr, idx, arr) =>
                                                            curr.parameters.gfr > arr[best].parameters.gfr ? idx : best, 0
                                                        )}
                                                    />

                                                    {/* BMI */}
                                                    <ComparisonRow
                                                        label="BMI"
                                                        icon={<Activity className="w-4 h-4" />}
                                                        values={data.topDonors.map(d => d.parameters.bmi.toFixed(1))}
                                                        bestIndex={data.topDonors.findIndex(d => d.parameters.bmi >= 18.5 && d.parameters.bmi <= 25)}
                                                    />

                                                    {/* Health Status */}
                                                    <ComparisonRow
                                                        label="Health Status"
                                                        icon={<CheckCircle className="w-4 h-4" />}
                                                        values={data.topDonors.map(d => {
                                                            const issues = [];
                                                            if (d.parameters.diabetes) issues.push('DM');
                                                            if (d.parameters.hypertension) issues.push('HTN');
                                                            if (d.parameters.smoking) issues.push('Smoker');
                                                            return issues.length > 0 ? issues.join(', ') : 'Healthy';
                                                        })}
                                                        bestIndex={data.topDonors.findIndex(d =>
                                                            !d.parameters.diabetes && !d.parameters.hypertension && !d.parameters.smoking
                                                        )}
                                                    />
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Legend */}
                                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-6 text-xs text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <span className="text-green-600 font-bold">✓</span> Optimal Range
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="text-yellow-600 font-bold">▲</span> Acceptable Range
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="text-red-600 font-bold">▼</span> Requires Attention
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 italic">
                                                    Note: Icons show individual parameter ranges. Overall ranking is determined by ML composite analysis.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clinical Interpretation - Doctor-Friendly Explanation */}
                                    <MatchParameterExplanation
                                        donor={data.topDonors[0]}
                                        recipient={data.recipient}
                                    />
                                </div>

                                {/* Disclaimer */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Clinical Note:</strong> This system provides decision support only.
                                        Final clinical decisions must be made by qualified medical professionals considering
                                        all relevant patient factors and current clinical guidelines.
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Footer */}
                    {data && (
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between gap-3 border-t border-gray-200">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={downloading}
                                className="px-6 py-2 bg-medical-600 hover:bg-medical-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                {downloading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Generating PDF...
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        Download PDF Report
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper component for comparison rows
const ComparisonRow = ({ label, icon, values, recipient, bestIndex = -1 }) => {
    const getIndicator = (index, value) => {
        // For #1 ranked donor (index 0), never show red concern indicator
        // ML has already determined this is the best match despite any borderline parameters
        const isTopMatch = index === 0;
        
        // Clinical evaluation based on parameter type
        switch (label) {
            case 'HLA Match':
                const hlaScore = parseInt(value.split('/')[0]);
                if (hlaScore >= 5) return <span className="text-green-600 font-bold">✓</span>; // Excellent
                if (hlaScore >= 3) return <span className="text-yellow-600 font-bold">▲</span>; // Acceptable
                // Top match: show acceptable instead of concern
                return isTopMatch ? <span className="text-yellow-600 font-bold">▲</span> : <span className="text-red-600 font-bold">▼</span>;

            case 'eGFR':
                const gfr = parseInt(value);
                if (gfr >= 90) return <span className="text-green-600 font-bold">✓</span>; // Excellent
                if (gfr >= 60) return <span className="text-yellow-600 font-bold">▲</span>; // Acceptable
                // Top match: show acceptable instead of concern
                return isTopMatch ? <span className="text-yellow-600 font-bold">▲</span> : <span className="text-red-600 font-bold">▼</span>;

            case 'BMI':
                const bmi = parseFloat(value);
                if (bmi >= 18.5 && bmi <= 25) return <span className="text-green-600 font-bold">✓</span>; // Optimal
                if (bmi >= 17 && bmi <= 30) return <span className="text-yellow-600 font-bold">▲</span>; // Acceptable
                // Top match: show acceptable instead of concern
                return isTopMatch ? <span className="text-yellow-600 font-bold">▲</span> : <span className="text-red-600 font-bold">▼</span>;

            case 'Age':
                const age = parseInt(value);
                if (age < 40) return <span className="text-green-600 font-bold">✓</span>; // Young donor
                if (age < 55) return <span className="text-yellow-600 font-bold">▲</span>; // Acceptable
                // Top match: show acceptable instead of concern for older donors
                return isTopMatch ? <span className="text-yellow-600 font-bold">▲</span> : <span className="text-red-600 font-bold">▼</span>;

            case 'Health Status':
                if (value === 'Healthy') return <span className="text-green-600 font-bold">✓</span>;
                // For top match, multiple issues still acceptable per ML
                if (value.includes('DM') && value.includes('HTN')) {
                    return isTopMatch ? <span className="text-yellow-600 font-bold">▲</span> : <span className="text-red-600 font-bold">▼</span>;
                }
                if (value.includes('DM') || value.includes('HTN') || value.includes('Smoker')) {
                    return <span className="text-yellow-600 font-bold">▲</span>; // Single issue
                }
                return <span className="text-green-600 font-bold">✓</span>;

            case 'Blood Group':
                // Blood group compatibility is binary - either compatible or not
                // If this row is shown, it's already compatible
                return <span className="text-green-600 font-bold">✓</span>;

            default:
                // Fallback to relative comparison
                if (bestIndex === index) return <span className="text-green-600 font-bold">✓</span>;
                return <span className="text-gray-400">—</span>;
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    {icon}
                    <span>{label}</span>
                    {recipient && <span className="text-xs text-gray-500">({recipient})</span>}
                </div>
            </td>
            {values.map((value, idx) => (
                <td key={idx} className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                        {getIndicator(idx, value)}
                        <span className="text-sm text-gray-900">{value}</span>
                    </div>
                </td>
            ))}
        </tr>
    );
};

export default MatchDetailsModal;
