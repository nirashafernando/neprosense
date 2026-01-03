import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

const DetailedMatchInformation = () => {
  const navigate = useNavigate();
  const { donorId, recipientId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatchDetails();
  }, [donorId, recipientId]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);

      // Fetch donor, recipient, and their prediction
      const [donorRes, recipientRes, predictionsRes] = await Promise.all([
        api.get(`/donors?donorId=${donorId}`),
        api.get(`/recipients?recipientId=${recipientId}`),
        api.get('/predictions/my-predictions')
      ]);

      const donor = donorRes.data.data?.find(d => d.donorId === donorId);
      const recipient = recipientRes.data.data?.find(r => r.recipientId === recipientId);

      // Find prediction for this pair
      const prediction = predictionsRes.data.data?.find(p =>
        p.donorData?.donorId === donorId && p.recipientData?.recipientId === recipientId
      );

      if (donor && recipient) {
        setMatchData({
          donorProfile: {
            id: donor.donorId,
            age: donor.age,
            gender: donor.gender,
            bloodGroup: donor.bloodGroup,
            hlaType: donor.hlaTyping,
            weight: donor.weight,
            location: donor.location,
          },
          recipientProfile: {
            id: recipient.recipientId,
            age: recipient.age,
            gender: recipient.gender,
            bloodGroup: recipient.bloodGroup,
            hlaType: recipient.hlaTyping,
            weight: recipient.weight,
            location: recipient.location,
          },
          compatibilityBreakdown: {
            bloodTypeMatch: donor.bloodGroup === recipient.bloodGroup ? "Perfect Match" : "Mismatch",
            hlaMatchScore: calculateHLAMatch(donor.hlaTyping, recipient.hlaTyping),
            ageWeightMatching: calculateAgeWeightMatch(donor.age, donor.weight, recipient.age, recipient.weight),
            waitingTimeScore: recipient.waitingTime ? Math.min(100, (recipient.waitingTime / 24) * 100) : 50,
            geographicDistance: 45, // This would need geocoding in production
          },
          riskProbabilityScore: prediction ? Math.round((prediction.result?.probability || 0) * 100) : 0,
          overallCompatibility: prediction ? Math.round((prediction.result?.probability || 0) * 100) : 0,
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching match details:", err);
      setError("Failed to fetch match details");
      setLoading(false);
    }
  };

  const calculateHLAMatch = (donorHLA, recipientHLA) => {
    // Simple similarity check - in production this would be more sophisticated
    if (!donorHLA || !recipientHLA) return 50;
    const donorTypes = donorHLA.split(',').map(s => s.trim());
    const recipientTypes = recipientHLA.split(',').map(s => s.trim());
    const matches = donorTypes.filter(d => recipientTypes.some(r => r === d)).length;
    return Math.round((matches / Math.max(donorTypes.length, recipientTypes.length)) * 100);
  };

  const calculateAgeWeightMatch = (donorAge, donorWeight, recipientAge, recipientWeight) => {
    const ageDiff = Math.abs(donorAge - recipientAge);
    const weightDiff = Math.abs(donorWeight - recipientWeight);
    const ageScore = Math.max(0, 100 - (ageDiff * 2));
    const weightScore = Math.max(0, 100 - (weightDiff * 1.5));
    return Math.round((ageScore + weightScore) / 2);
  };

  const handleBack = () => {
    navigate("/matching-results");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Matching Results</span>
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || "Match data not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Matching Results</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Detailed Match Information
                </h1>
                <p className="text-gray-600">
                  Comprehensive compatibility analysis for {donorId} → {recipientId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Donor Profile */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Donor Profile</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">ID:</span>
                  <p className="text-gray-800">{matchData.donorProfile.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Age:</span>
                  <p className="text-gray-800">{matchData.donorProfile.age}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Gender:</span>
                  <p className="text-gray-800">{matchData.donorProfile.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Blood Group:</span>
                  <p className="text-gray-800">{matchData.donorProfile.bloodGroup}</p>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">HLA Type:</span>
                <p className="text-gray-800 text-sm">{matchData.donorProfile.hlaType}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Weight:</span>
                  <p className="text-gray-800">{matchData.donorProfile.weight} kg</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-800">{matchData.donorProfile.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Profile */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recipient Profile</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">ID:</span>
                  <p className="text-gray-800">{matchData.recipientProfile.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Age:</span>
                  <p className="text-gray-800">{matchData.recipientProfile.age}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Gender:</span>
                  <p className="text-gray-800">{matchData.recipientProfile.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Blood Group:</span>
                  <p className="text-gray-800">{matchData.recipientProfile.bloodGroup}</p>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">HLA Type:</span>
                <p className="text-gray-800 text-sm">{matchData.recipientProfile.hlaType}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Weight:</span>
                  <p className="text-gray-800">{matchData.recipientProfile.weight} kg</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-800">{matchData.recipientProfile.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Compatibility Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-500">Blood Type Match:</span>
              <p className="text-lg font-semibold text-green-600">
                {matchData.compatibilityBreakdown.bloodTypeMatch}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-500">HLA Match Score:</span>
              <p className={`text-lg font-semibold ${getScoreColor(matchData.compatibilityBreakdown.hlaMatchScore)}`}>
                {matchData.compatibilityBreakdown.hlaMatchScore}%
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-500">Age/Weight Matching:</span>
              <p className={`text-lg font-semibold ${getScoreColor(matchData.compatibilityBreakdown.ageWeightMatching)}`}>
                {matchData.compatibilityBreakdown.ageWeightMatching}%
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-500">Waiting Time Score:</span>
              <p className={`text-lg font-semibold ${getScoreColor(matchData.compatibilityBreakdown.waitingTimeScore)}`}>
                {matchData.compatibilityBreakdown.waitingTimeScore}%
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <span className="text-sm font-medium text-gray-500">Geographic Distance:</span>
              <p className={`text-lg font-semibold ${getScoreColor(100 - matchData.compatibilityBreakdown.geographicDistance)}`}>
                {matchData.compatibilityBreakdown.geographicDistance} km
              </p>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Risk Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 border-2 rounded-lg ${getScoreBackground(matchData.riskProbabilityScore)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(matchData.riskProbabilityScore)}`}>
                  {matchData.riskProbabilityScore}%
                </div>
                <div className="text-lg font-medium text-gray-700">ML Prediction Score</div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${matchData.riskProbabilityScore >= 80
                          ? "bg-green-500"
                          : matchData.riskProbabilityScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      style={{ width: `${matchData.riskProbabilityScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`p-6 border-2 rounded-lg ${getScoreBackground(matchData.overallCompatibility)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(matchData.overallCompatibility)}`}>
                  {matchData.overallCompatibility}%
                </div>
                <div className="text-lg font-medium text-gray-700">Overall Compatibility</div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${matchData.overallCompatibility >= 80
                          ? "bg-green-500"
                          : matchData.overallCompatibility >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      style={{ width: `${matchData.overallCompatibility}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedMatchInformation;
