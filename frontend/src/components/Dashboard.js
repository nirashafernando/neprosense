import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Plus,
  User,
  Activity,
  TrendingUp,
  ArrowRight,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donorCount, setDonorCount] = useState(0);
  const [recipientCount, setRecipientCount] = useState(0);
  const [predictionCount, setPredictionCount] = useState(0);
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'donors', 'recipients'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [donorsResponse, recipientsResponse, predictionsResponse] = await Promise.all([
        api.get('/donors'),
        api.get('/recipients'),
        api.get('/predictions/my-predictions').catch(() => ({ data: { count: 0 } }))
      ]);

      if (donorsResponse.data.success) {
        const donorData = donorsResponse.data.data || [];
        setDonors(donorData);
        setDonorCount(donorData.length);
      }

      if (recipientsResponse.data.success) {
        const recipientData = recipientsResponse.data.data || [];
        setRecipients(recipientData);
        setRecipientCount(recipientData.length);
      }

      setPredictionCount(predictionsResponse.data.count || predictionsResponse.data.data?.length || 0);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (donorId) => {
    if (!window.confirm('Are you sure you want to delete this donor?')) return;

    try {
      await api.delete(`/donors/${donorId}`);
      setDonors(donors.filter(d => d._id !== donorId));
      setDonorCount(prev => prev - 1);
    } catch (err) {
      alert('Failed to delete donor: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteRecipient = async (recipientId) => {
    if (!window.confirm('Are you sure you want to delete this recipient?')) return;

    try {
      await api.delete(`/recipients/${recipientId}`);
      setRecipients(recipients.filter(r => r._id !== recipientId));
      setRecipientCount(prev => prev - 1);
    } catch (err) {
      alert('Failed to delete recipient: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredDonors = donors.filter(donor =>
    donor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.donorId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.bloodGroup?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecipients = recipients.filter(recipient =>
    recipient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.recipientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.bloodGroup?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isClinician = user?.role === 'Clinician';

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">NephroSense Intelligent Donor Matching System</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
                  ? 'border-medical-600 text-medical-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('donors')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'donors'
                  ? 'border-medical-600 text-medical-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Donors ({donorCount})
            </button>
            <button
              onClick={() => setActiveTab('recipients')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'recipients'
                  ? 'border-medical-600 text-medical-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Recipients ({recipientCount})
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Main Action CTA - Clinician Only */}
            {isClinician && (
              <div className="bg-gradient-to-r from-medical-600 to-teal-600 rounded-xl shadow-xl p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Ready to Start Matching?</h2>
                    <p className="text-medical-100 mb-6">
                      Use our AI-powered system to find the best donor matches with risk-based ranking
                    </p>
                    <button
                      onClick={() => navigate('/app/make-prediction')}
                      className="bg-white text-medical-700 px-8 py-4 rounded-lg font-semibold hover:bg-medical-50 transition-all shadow-lg flex items-center gap-2 text-lg"
                    >
                      <Heart className="w-6 h-6" />
                      Start Donor Matching
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
                      <Heart className="w-24 h-24 text-white opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-medical-500 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('donors')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Donors</h3>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-20 mt-2"></div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-medical-600 mt-2">
                        {donorCount}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Available for matching</p>
                  </div>
                  <div className="bg-medical-100 p-4 rounded-xl">
                    <Heart className="w-8 h-8 text-medical-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('recipients')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Recipients</h3>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-20 mt-2"></div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-blue-600 mt-2">
                        {recipientCount}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Waiting for transplant</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Predictions</h3>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-20 mt-2"></div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-purple-600 mt-2">
                        {predictionCount}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">Total analyses run</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-xl">
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {isClinician && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate("/app/donor")}
                    className="bg-medical-50 hover:bg-medical-100 border-2 border-medical-200 p-4 rounded-lg transition-all group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-medical-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Add Donor</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/app/recipient")}
                    className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 p-4 rounded-lg transition-all group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Add Recipient</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/app/matching-results")}
                    className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 p-4 rounded-lg transition-all group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-purple-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">View Results</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/app/model-transparency")}
                    className="bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 p-4 rounded-lg transition-all group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">Model Info</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Donor Management</h2>
              {isClinician && (
                <button
                  onClick={() => navigate('/app/donor')}
                  className="bg-medical-600 hover:bg-medical-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Donor
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or blood group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {isClinician && (
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonors.map((donor) => (
                    <tr key={donor._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donor.donorId}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{donor.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{donor.age}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-medical-100 text-medical-700">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{donor.location}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${donor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {donor.status}
                        </span>
                      </td>
                      {isClinician && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/app/donor?edit=${donor._id}`)}
                            className="text-medical-600 hover:text-medical-900 mr-3"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDonor(donor._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDonors.length === 0 && (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No donors found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipients Tab */}
        {activeTab === 'recipients' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recipient Management</h2>
              {isClinician && (
                <button
                  onClick={() => navigate('/app/recipient')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Recipient
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or blood group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {isClinician && (
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecipients.map((recipient) => (
                    <tr key={recipient._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{recipient.recipientId}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{recipient.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{recipient.age}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {recipient.bloodGroup}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${recipient.urgencyScore >= 8 ? 'bg-red-100 text-red-700' :
                            recipient.urgencyScore >= 5 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                          }`}>
                          {recipient.urgencyScore}/10
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${recipient.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {recipient.status}
                        </span>
                      </td>
                      {isClinician && (
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/app/recipient?edit=${recipient._id}`)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecipient(recipient._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRecipients.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recipients found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
