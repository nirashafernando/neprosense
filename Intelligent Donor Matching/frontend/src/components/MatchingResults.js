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
        return "text-green-600 bg-green-50";
      case "unsuitable":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Get compatibility score color
  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600 font-semibold";
    if (score >= 50) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
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
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Donor - Recipient Matching Results
                </h1>
                <p className="text-gray-600">
                  View compatibility scores and risk assessments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading matching results...</p>
          </div>
        )}

        {/* Search Bar */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Recipient ID or Donor ID"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Results Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommended Match
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ML Compatibility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.predictionId || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.donorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.recipientId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={getScoreColor(item.compatibilityScore)}>
                            {item.compatibilityScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                              item.riskProbability
                            )}`}
                          >
                            {item.riskProbability}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDateTime(item.createdAt).date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatDateTime(item.createdAt).time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleView(item.predictionId)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        {searchTerm
                          ? "No matching results found"
                          : "No prediction data available"}
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
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredData.length}
                </div>
                <div className="text-sm text-gray-600">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {
                    filteredData.filter(
                      (item) => {
                        const risk = item.riskProbability.toLowerCase();
                        return risk.includes("high") || risk.includes("unsuitable");
                      }
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">High Risk / Unsuitable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredData.filter((item) => item.compatibilityScore >= 70).length}
                </div>
                <div className="text-sm text-gray-600">High Compatibility</div>
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
      {ToastComponent}
    </div>
  );
};

export default MatchingResults;
