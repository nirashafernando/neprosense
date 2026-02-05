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
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/app/dashboard")}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </button>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-3 rounded-full">
                                <Heart className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Risk-Based Donor Matching
                                </h1>
                                <p className="text-gray-600">
                                    Research-grade multi-donor compatibility analysis with AI explainability
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading donors and recipients...</p>
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
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Select Recipient</h2>

                            <select
                                value={selectedRecipient?._id || ""}
                                onChange={handleRecipientSelect}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">-- Choose a recipient --</option>
                                {recipients.map((recipient) => (
                                    <option key={recipient._id} value={recipient._id}>
                                        {recipient.recipientId} - {recipient.name} ({recipient.bloodGroup}) - Urgency: {recipient.urgencyScore}/10
                                    </option>
                                ))}
                            </select>

                            {selectedRecipient && (
                                <div className="mt-3 p-4 bg-purple-50 rounded border border-purple-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Age:</span>
                                            <span className="ml-2 text-gray-900">{selectedRecipient.age}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Blood:</span>
                                            <span className="ml-2 text-gray-900">{selectedRecipient.bloodGroup}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Location:</span>
                                            <span className="ml-2 text-gray-900">{selectedRecipient.location}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Waiting:</span>
                                            <span className="ml-2 text-gray-900">{selectedRecipient.waitingTime || 0} months</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Donor Selection */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">2. Select Donors</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleSelectAllToggle}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectAll
                                            ? "bg-green-100 text-green-700 border border-green-300"
                                            : "bg-gray-100 text-gray-700 border border-gray-300"
                                            }`}
                                    >
                                        {selectAll ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                        <span className="font-medium">Select All Donors ({donors.length})</span>
                                    </button>
                                </div>
                            </div>

                            {!selectAll && (
                                <>
                                    <div className="mb-3 text-sm text-gray-600">
                                        Selected: <span className="font-semibold text-gray-900">{selectedDonorIds.length}</span> donor(s)
                                    </div>

                                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                                        <div className="divide-y divide-gray-200">
                                            {donors.map((donor) => (
                                                <label
                                                    key={donor._id}
                                                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDonorIds.includes(donor._id)}
                                                        onChange={() => handleDonorToggle(donor._id)}
                                                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-900">
                                                                {donor.donorId} - {donor.name}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                {donor.bloodGroup}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-sm text-gray-500">
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
                                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <CheckSquare className="w-6 h-6 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">
                                                All {donors.length} donors will be evaluated
                                            </p>
                                            <p className="text-sm text-green-700 mt-1">
                                                The system will rank all available donors by compatibility and risk level
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Run Matching Button */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <button
                                    onClick={handleRunMatching}
                                    disabled={!selectedRecipient || effectiveDonorCount === 0 || predicting}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-3 min-w-[300px] justify-center shadow-lg"
                                >
                                    {predicting ? (
                                        <>
                                            <Loader className="w-6 h-6 animate-spin" />
                                            <span>Analyzing {effectiveDonorCount} donor(s)...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-6 h-6" />
                                            <span>Run Risk-Based Matching</span>
                                        </>
                                    )}
                                </button>

                                {selectedRecipient && effectiveDonorCount > 0 && !predicting && (
                                    <p className="text-sm text-gray-600 text-center">
                                        Evaluating <span className="font-semibold">{effectiveDonorCount}</span> donor(s) for{" "}
                                        <span className="font-semibold">{selectedRecipient.name}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Clinical Disclaimer */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Clinical Decision Support Tool</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
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
            {ToastComponent}

            {/* Confirmation Dialog */}
            <ConfirmDialog
                {...confirmDialog}
                onClose={() => setConfirmDialog({ isOpen: false })}
            />
        </div>
    );
};

export default MakePrediction;
