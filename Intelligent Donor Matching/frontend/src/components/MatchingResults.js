import React, { useState, useEffect } from "react";
import { Heart, Search, Eye, Calendar, Clock } from "lucide-react";
import api from "../lib/axios";
import MatchDetailsModal from "./MatchDetailsModal";
import { useToast } from "./Toast";

const MatchingResults = ({ onViewDetails }) => {
  const { showSuccess, showError, showInfo, ToastComponent } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingData, setMatchingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPredictionId, setSelectedPredictionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMatchingResults = async () => {
      try {
        setLoading(true);
        // Fetch batch predictions from the backend
        const response = await api.get('/predictions/my-predictions');

        if (response.data.success) {
          // Transform batch predictions to show ONE ROW per prediction session
          const transformedData = response.data.data.map(batchPred => {
            // Get recipient info
            const recipientId = batchPred.recipientId?.recipientId || batchPred.recipientId?.name || 'N/A';

            // Get best match info from topDonors
            const topDonor = batchPred.topDonors && batchPred.topDonors.length > 0
              ? batchPred.topDonors[0]
              : null;

            return {
              donorId: topDonor ? `Best: ${topDonor.donorId}` : `${batchPred.totalEvaluated || batchPred.donorIds?.length || 0} Donors`,
              recipientId: recipientId,
              compatibilityScore: topDonor
                ? Math.round((topDonor.probability || 0) * 100)
                : 0,
              riskProbability: topDonor?.riskCategory?.category || 'Unknown',
              predictionId: batchPred._id,
              donorsEvaluated: batchPred.totalEvaluated || batchPred.donorIds?.length || 0,
              // Use createdAt if available, otherwise use current date
              createdAt: batchPred.createdAt || batchPred.updatedAt || Date.now()
            };
          });

          // Debug: Log first item to check data structure
          if (transformedData.length > 0) {
            console.log('Sample transformed data:', transformedData[0]);
          }

          setMatchingData(transformedData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching matching results:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });

        // Set more specific error message
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch matching results";
        setError(errorMessage);
        showError(errorMessage, {
          action: { label: "Retry", onClick: () => window.location.reload() }
        });
        setLoading(false);
        // Fallback to empty array if error
        setMatchingData([]);
      }
    };

    fetchMatchingResults();
  }, []);

  const handleView = (predictionId) => {
    setSelectedPredictionId(predictionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPredictionId(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = matchingData.filter(
    (item) =>
      item.donorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get risk probability color
  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "suitable":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-300";
      case "unsuitable":
        return "bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border-rose-300";
      case "high":
        return "bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border-rose-300";
      case "medium":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300";
      case "low":
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300";
    }
  };

  // Get compatibility score color
  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-600 font-bold";
    if (score >= 50) return "text-amber-600 font-bold";
    return "text-rose-600 font-bold";
  };

  const formatDateTime = (dateString) => {
    try {
      if (!dateString) {
        return { date: 'N/A', time: 'N/A' };
      }

      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return { date: 'Invalid Date', time: 'Invalid Time' };
      }

      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return { date: dateStr, time: timeStr };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { date: 'N/A', time: 'N/A' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-medical-500 to-medical-700 p-3 rounded-xl shadow-lg">
                <Heart className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Donor - Recipient Matching Results
                </h1>
                <p className="text-slate-600 mt-0.5 text-sm">
                  View compatibility scores and risk assessments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 text-rose-800 px-4 py-3 rounded-xl mb-6 shadow-sm">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium text-lg">Loading matching results...</p>
          </div>
        )}

        {/* Search Bar */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-500" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search by Recipient ID or Donor ID"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm hover:shadow-md font-medium placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        {/* Results Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Recommended Match
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Recipient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      ML Compatibility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Risk Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.predictionId || index}
                        className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-emerald-50 transition-all"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          {item.donorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {item.recipientId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`${getScoreColor(item.compatibilityScore)} text-base`}>
                            {item.compatibilityScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(
                              item.riskProbability
                            )}`}
                          >
                            {item.riskProbability}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
                            <span className="font-medium">{formatDateTime(item.createdAt).date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
                            <span className="font-medium">{formatDateTime(item.createdAt).time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleView(item.predictionId)}
                            className="inline-flex items-center px-4 py-2 border-2 border-emerald-300 text-sm font-bold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-md hover:shadow-lg"
                          >
                            <Eye className="w-4 h-4 mr-2" strokeWidth={2.5} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Heart className="w-12 h-12 text-slate-300" strokeWidth={2} />
                          <p className="text-slate-500 font-medium">
                            {searchTerm
                              ? "No matching results found"
                              : "No prediction data available"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200">
                <div className="text-4xl font-bold text-emerald-600 mb-1">
                  {filteredData.length}
                </div>
                <div className="text-sm text-slate-600 font-medium">Total Matches</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-lg border-2 border-rose-200">
                <div className="text-4xl font-bold text-rose-600 mb-1">
                  {
                    filteredData.filter(
                      (item) => {
                        const risk = item.riskProbability.toLowerCase();
                        return risk.includes("high") || risk.includes("unsuitable");
                      }
                    ).length
                  }
                </div>
                <div className="text-sm text-slate-600 font-medium">High Risk / Unsuitable</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200">
                <div className="text-4xl font-bold text-amber-600 mb-1">
                  {filteredData.filter((item) => item.compatibilityScore >= 70).length}
                </div>
                <div className="text-sm text-slate-600 font-medium">High Compatibility</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        predictionId={selectedPredictionId}
      />

      {/* Toast Notifications */}
      <ToastComponent />
    </div>
  );
};

export default MatchingResults;
