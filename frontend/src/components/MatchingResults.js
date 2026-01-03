import React, { useState, useEffect } from "react";
import { Heart, Search, Eye } from "lucide-react";
import api from "../lib/axios";

const MatchingResults = ({ onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingData, setMatchingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchingResults = async () => {
      try {
        setLoading(true);
        // Fetch all predictions from the backend
        const response = await api.get('/predictions/my-predictions');

        if (response.data.success) {
          // Transform backend data to match component structure
          const transformedData = response.data.data.map(pred => ({
            donorId: pred.donorData?.donorId || 'N/A',
            recipientId: pred.recipientData?.recipientId || 'N/A',
            compatibilityScore: Math.round((pred.result?.probability || 0) * 100),
            riskProbability: pred.result?.suitability || 'Unknown',
            predictionId: pred._id
          }));
          setMatchingData(transformedData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching matching results:", err);
        setError(err.response?.data?.message || "Failed to fetch matching results");
        setLoading(false);
        // Fallback to empty array if error
        setMatchingData([]);
      }
    };

    fetchMatchingResults();
  }, []);

  const handleView = (donorId, recipientId) => {
    onViewDetails(donorId, recipientId);
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
                      Donor ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compatibility Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Probability
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
                        key={item.predictionId || `${item.donorId}-${item.recipientId}-${index}`}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleView(item.donorId, item.recipientId)}
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
                        colSpan="5"
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
                      (item) =>
                        item.riskProbability.toLowerCase() === "high" ||
                        item.riskProbability.toLowerCase() === "unsuitable"
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
    </div>
  );
};

export default MatchingResults;
