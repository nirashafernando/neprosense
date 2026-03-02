import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Loader, AlertCircle, CheckSquare, Square } from "lucide-react";
import api from "../lib/axios";
import RiskBasedResults from "./RiskBasedResults";
import { useToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import MedicalTooltip from "./MedicalTooltip";

const MakePrediction = () => {
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning, ToastComponent } = useToast();
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

    // Data lists
    const [donors, setDonors] = useState([]);
    const [recipients, setRecipients] = useState([]);

    // Selection state
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [selectedDonorIds, setSelectedDonorIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // UI state
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [donorsRes, recipientsRes] = await Promise.all([
                api.get('/donors'),
                api.get('/recipients')
            ]);

            if (donorsRes.data.success) {
                setDonors(donorsRes.data.data);
            }
            if (recipientsRes.data.success) {
                setRecipients(recipientsRes.data.data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            showError("Failed to load donors and recipients", {
                action: { label: "Retry", onClick: fetchData }
            });
            setLoading(false);
        }
    };

    const handleRecipientSelect = (e) => {
        const recipient = recipients.find(r => r._id === e.target.value);
        setSelectedRecipient(recipient);
        setResult(null);
    };

    const handleDonorToggle = (donorId) => {
        setSelectedDonorIds(prev => {
            if (prev.includes(donorId)) {
                return prev.filter(id => id !== donorId);
            } else {
                return [...prev, donorId];
            }
        });
        setResult(null);
    };

    const handleSelectAllToggle = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedDonorIds([]);
        }
        setResult(null);
    };

    const handleRunMatching = async () => {
        if (!selectedRecipient) {
            showWarning("Please select a recipient");
            return;
        }

        if (!selectAll && selectedDonorIds.length === 0) {
            showWarning("Please select at least one donor or enable 'Select All Donors'");
            return;
        }

        // Show confirmation dialog before running prediction
        setConfirmDialog({
            isOpen: true,
            title: "Run Matching Prediction?",
            message: `This will analyze ${selectAll ? donors.length : selectedDonorIds.length} donor(s) for recipient ${selectedRecipient.name || selectedRecipient.recipientId}.`,
            type: "info",
            confirmText: "Run Prediction",
            onConfirm: () => {
                setConfirmDialog({ isOpen: false });
                executePrediction();
            }
        });
    };

    const executePrediction = async () => {

        setPredicting(true);
        setError(null);
        setResult(null);

        try {
            const response = await api.post('/predictions/predict-batch', {
                recipientId: selectedRecipient._id,
                donorIds: selectedDonorIds,
                selectAll: selectAll
            });

            if (response.data.success) {
                setResult(response.data.data);
                showSuccess(`Successfully analyzed ${response.data.data.predictions?.length || 0} matches!`);
            }
            setPredicting(false);
        } catch (err) {
            console.error("Error making prediction:", err);
            showError(err.response?.data?.message || "Failed to make prediction", {
                action: { label: "Retry", onClick: executePrediction }
            });
            setPredicting(false);
        }
    };

    const effectiveDonorCount = selectAll ? donors.length : selectedDonorIds.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-emerald-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/app/dashboard")}
                        className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-all mb-4 font-medium group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                        <span>Back to Dashboard</span>
                    </button>

                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-medical-500 to-medical-700 p-3 rounded-xl shadow-lg">
                                <Heart className="w-7 h-7 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                    Risk-Based Donor Matching
                                </h1>
                                <p className="text-slate-600 mt-0.5 text-sm">
                                    Research-grade multi-donor compatibility analysis with AI explainability
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 text-rose-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
                        <Loader className="w-16 h-16 animate-spin text-medical-600 mx-auto mb-4" strokeWidth={2.5} />
                        <p className="text-slate-600 font-medium">Loading donors and recipients...</p>
                    </div>
                ) : result ? (
                    /* Show Results */
                    <RiskBasedResults
                        result={result}
                        onRunAnother={() => {
                            setResult(null);
                            setSelectedRecipient(null);
                            setSelectedDonorIds([]);
                            setSelectAll(false);
                        }}
                    />
                ) : (
                    /* Selection Form */
                    <div className="space-y-6">
                        {/* Recipient Selection */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">1. Select Recipient</h2>

                            <select
                                value={selectedRecipient?._id || ""}
                                onChange={handleRecipientSelect}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md font-medium"
                            >
                                <option value="">-- Choose a recipient --</option>
                                {recipients.map((recipient) => (
                                    <option key={recipient._id} value={recipient._id}>
                                        {recipient.recipientId} - {recipient.name} ({recipient.bloodGroup}) - Urgency: {recipient.urgencyScore}/10
                                    </option>
                                ))}
                            </select>

                            {selectedRecipient && (
                                <div className="mt-4 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 shadow-sm">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-bold text-slate-700">Age:</span>
                                            <span className="ml-2 text-slate-900 font-medium">{selectedRecipient.age}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-700">Blood:</span>
                                            <span className="ml-2 text-slate-900 font-medium">{selectedRecipient.bloodGroup}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-700">Location:</span>
                                            <span className="ml-2 text-slate-900 font-medium">{selectedRecipient.location}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-700">Waiting:</span>
                                            <span className="ml-2 text-slate-900 font-medium">{selectedRecipient.waitingTime || 0} months</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Donor Selection */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Select Donors</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleSelectAllToggle}
                                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all font-medium shadow-sm hover:shadow-md ${selectAll
                                            ? "bg-gradient-to-r from-medical-100 to-teal-100 text-medical-800 border-2 border-medical-400"
                                            : "bg-slate-100 text-slate-700 border-2 border-slate-300 hover:bg-slate-200"
                                            }`}
                                    >
                                        {selectAll ? <CheckSquare className="w-5 h-5" strokeWidth={2.5} /> : <Square className="w-5 h-5" strokeWidth={2.5} />}
                                        <span>Select All Donors ({donors.length})</span>
                                    </button>
                                </div>
                            </div>

                            {!selectAll && (
                                <>
                                    <div className="mb-4 text-sm text-slate-600 font-medium">
                                        Selected: <span className="font-bold text-slate-900 text-base">{selectedDonorIds.length}</span> donor(s)
                                    </div>

                                    <div className="max-h-96 overflow-y-auto border-2 border-slate-200 rounded-xl shadow-sm">
                                        <div className="divide-y divide-slate-100">
                                            {donors.map((donor) => (
                                                <label
                                                    key={donor._id}
                                                    className="flex items-center p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-medical-50 cursor-pointer transition-all"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDonorIds.includes(donor._id)}
                                                        onChange={() => handleDonorToggle(donor._id)}
                                                        className="w-5 h-5 text-medical-600 border-slate-300 rounded focus:ring-medical-500"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-slate-900">
                                                                {donor.donorId} - {donor.name}
                                                            </span>
                                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-medical-100 to-teal-100 text-medical-800 border border-medical-300">
                                                                {donor.bloodGroup}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-sm text-slate-600 font-medium">
                                                            Age: {donor.age} | Location: {donor.location} | GFR: {donor.gfr || "N/A"}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectAll && (
                                <div className="p-6 bg-gradient-to-r from-medical-50 to-teal-50 border-2 border-medical-200 rounded-xl shadow-sm">
                                    <div className="flex items-center space-x-4">
                                        <CheckSquare className="w-8 h-8 text-medical-600" strokeWidth={2.5} />
                                        <div>
                                            <p className="font-bold text-medical-900 text-lg">
                                                All {donors.length} donors will be evaluated
                                            </p>
                                            <p className="text-sm text-medical-700 mt-1 font-medium">
                                                The system will rank all available donors by compatibility and risk level
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Run Matching Button */}
                        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                            <div className="flex flex-col items-center space-y-4">
                                <button
                                    onClick={handleRunMatching}
                                    disabled={!selectedRecipient || effectiveDonorCount === 0 || predicting}
                                    className="bg-gradient-to-r from-medical-600 to-teal-700 hover:from-medical-700 hover:to-teal-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white px-10 py-5 rounded-xl font-bold text-lg transition-all flex items-center space-x-3 min-w-[320px] justify-center shadow-lg hover:shadow-xl group"
                                >
                                    {predicting ? (
                                        <>
                                            <Loader className="w-7 h-7 animate-spin" strokeWidth={2.5} />
                                            <span>Analyzing {effectiveDonorCount} donor(s)...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-7 h-7 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                                            <span>Run Risk-Based Matching</span>
                                        </>
                                    )}
                                </button>

                                {selectedRecipient && effectiveDonorCount > 0 && !predicting && (
                                    <p className="text-sm text-slate-600 text-center font-medium">
                                        Evaluating <span className="font-bold text-medical-700">{effectiveDonorCount}</span> donor(s) for{" "}
                                        <span className="font-bold text-medical-700">{selectedRecipient.name}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Clinical Disclaimer */}
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-5 rounded-xl shadow-sm">
                            <div className="flex">
                                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                                <div className="ml-4">
                                    <h3 className="text-sm font-bold text-amber-900">Clinical Decision Support Tool</h3>
                                    <div className="mt-2 text-sm text-amber-800 font-medium">
                                        <p>
                                            This system provides AI-based risk assessment and donor ranking to support clinical decision-making.
                                            Final transplant decisions must be made by qualified medical professionals based on comprehensive
                                            clinical evaluation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Results */}
                        {result && <RiskBasedResults result={result} />}
                    </div>
                )}
            </div>

            {/* Toast Notifications */}
            <ToastComponent />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                {...confirmDialog}
                onClose={() => setConfirmDialog({ isOpen: false })}
            />
        </div>
    );
};

export default MakePrediction;
