import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Plus,
  User,
  Activity,
  ArrowRight,
  Edit,
  Trash2,
  Search
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";
import DashboardStats from "./DashboardStats";
import MatchDistributionChart from "./MatchDistributionChart";
import { useToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import OnboardingTutorial from "./OnboardingTutorial";
import MedicalTooltip from "./MedicalTooltip";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning, showInfo, ToastComponent } = useToast();
  const [donorCount, setDonorCount] = useState(0);
  const [recipientCount, setRecipientCount] = useState(0);
  const [predictionCount, setPredictionCount] = useState(0);
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDonor, setEditingDonor] = useState(null);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [donorsResponse, recipientsResponse, predictionsResponse] = await Promise.all([
        api.get('/donors'),
        api.get('/recipients'),
        api.get('/predictions/my-predictions').catch(() => ({ data: { data: [] } }))
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

      const predictionData = predictionsResponse.data.data || [];
      setPredictions(predictionData);
      setPredictionCount(predictionData.length);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
      showError(
        'Failed to load dashboard data',
        5000,
        {
          label: 'Retry',
          onClick: fetchData
        }
      );
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (donorId) => {
    const donor = donors.find(d => d._id === donorId);
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Donor Record',
      message: 'Are you sure you want to delete this donor? This action cannot be undone and will remove all associated data.',
      type: 'danger',
      confirmText: 'Delete Donor',
      cancelText: 'Keep Donor',
      showPreview: true,
      previewData: {
        'Donor ID': donor?.donorId || 'N/A',
        'Name': donor?.name || 'N/A',
        'Blood Group': donor?.bloodGroup || 'N/A',
        'Age': donor?.age || 'N/A'
      },
      onConfirm: async () => {
        try {
          await api.delete(`/donors/${donorId}`);
          setDonors(donors.filter(d => d._id !== donorId));
          setDonorCount(prev => prev - 1);
          showSuccess('Donor deleted successfully');
        } catch (err) {
          showError('Failed to delete donor: ' + (err.response?.data?.message || err.message));
        }
      }
    });
  };

  const handleDeleteRecipient = async (recipientId) => {
    const recipient = recipients.find(r => r._id === recipientId);
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Recipient Record',
      message: 'Are you sure you want to delete this recipient? This action cannot be undone and will remove all associated prediction data.',
      type: 'danger',
      confirmText: 'Delete Recipient',
      cancelText: 'Keep Recipient',
      showPreview: true,
      previewData: {
        'Recipient ID': recipient?.recipientId || 'N/A',
        'Name': recipient?.name || 'N/A',
        'Blood Group': recipient?.bloodGroup || 'N/A',
        'Urgency Score': recipient?.urgencyScore || 'N/A'
      },
      onConfirm: async () => {
        try {
          await api.delete(`/recipients/${recipientId}`);
          setRecipients(recipients.filter(r => r._id !== recipientId));
          setRecipientCount(prev => prev - 1);
          showSuccess('Recipient deleted successfully');
        } catch (err) {
          showError('Failed to delete recipient: ' + (err.response?.data?.message || err.message));
        }
      }
    });
  };

  const handleEditDonor = (donor) => {
    setEditingDonor(donor._id);
    setEditFormData({
      name: donor.name,
      age: donor.age,
      bloodGroup: donor.bloodGroup,
      location: donor.location,
      contactNumber: donor.contactNumber,
      medicalHistory: donor.medicalHistory || '',
      status: donor.status
    });
  };

  const handleEditRecipient = (recipient) => {
    setEditingRecipient(recipient._id);
    setEditFormData({
      name: recipient.name,
      age: recipient.age,
      bloodGroup: recipient.bloodGroup,
      urgencyScore: recipient.urgencyScore,
      medicalCondition: recipient.medicalCondition || '',
      status: recipient.status
    });
  };

  const handleSaveDonor = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/donors/${editingDonor}`, editFormData);

      if (response.data.success) {
        setDonors(donors.map(d =>
          d._id === editingDonor ? response.data.data : d
        ));
        setEditingDonor(null);
        setEditFormData({});
        showSuccess('Donor updated successfully!');
      }
    } catch (err) {
      showError('Failed to update donor: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRecipient = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/recipients/${editingRecipient}`, editFormData);

      if (response.data.success) {
        setRecipients(recipients.map(r =>
          r._id === editingRecipient ? response.data.data : r
        ));
        setEditingRecipient(null);
        setEditFormData({});
        showSuccess('Recipient updated successfully!');
      }
    } catch (err) {
      showError('Failed to update recipient: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingDonor(null);
    setEditingRecipient(null);
    setEditFormData({});
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
      {/* Toast Notifications */}
      {ToastComponent}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        {...confirmDialog}
        onClose={() => setConfirmDialog({ isOpen: false })}
      />

      {/* Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial
          userRole={user?.role}
          onComplete={() => {
            showInfo('Welcome to NeproSense! You\'re all set to begin.', 4000);
          }}
        />
      )}

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

            {/* Dashboard Statistics */}
            <DashboardStats />

            {/* Match Distribution Charts */}
            {predictions.length > 0 && (
              <MatchDistributionChart predictions={predictions} />
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

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            )}

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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MedicalTooltip term="Age">Age</MedicalTooltip>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MedicalTooltip term="Blood Compatibility">Blood Group</MedicalTooltip>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {isClinician && (
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonors.map((donor) => (
                    editingDonor === donor._id ? (
                      <tr key={donor._id} className="bg-blue-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{donor.donorId}</td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-medical-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={editFormData.age}
                            onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-medical-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={editFormData.bloodGroup}
                            onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-medical-500"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={editFormData.location}
                            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-medical-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={editFormData.status}
                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-medical-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="matched">Matched</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={handleSaveDonor}
                            disabled={saving}
                            className="bg-medical-600 hover:bg-medical-700 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
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
                              onClick={() => handleEditDonor(donor)}
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
                    )
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

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            )}

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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MedicalTooltip term="Age">Age</MedicalTooltip>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MedicalTooltip term="Blood Compatibility">Blood Group</MedicalTooltip>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {isClinician && (
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecipients.map((recipient) => (
                    editingRecipient === recipient._id ? (
                      <tr key={recipient._id} className="bg-blue-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{recipient.recipientId}</td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={editFormData.age}
                            onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={editFormData.bloodGroup}
                            onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={editFormData.urgencyScore}
                            onChange={(e) => setEditFormData({ ...editFormData, urgencyScore: e.target.value })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={editFormData.status}
                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="waiting">Waiting</option>
                            <option value="matched">Matched</option>
                            <option value="transplanted">Transplanted</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={handleSaveRecipient}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
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
                              onClick={() => handleEditRecipient(recipient)}
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
                    )
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
