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
  Search,
  PlayCircle
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";
import DashboardStats from "./DashboardStats";
import MatchDistributionChart from "./MatchDistributionChart";
import { useToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import OnboardingTutorial from "./OnboardingTutorial";
import MedicalTooltip from "./MedicalTooltip";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import StatusIndicator from "./StatusIndicator";

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
  const [donorPage, setDonorPage] = useState(1);
  const [recipientPage, setRecipientPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [mlServiceStatus, setMlServiceStatus] = useState('connected');
  const [dbStatus, setDbStatus] = useState('connected');

  useEffect(() => {
    fetchData();
    checkServiceStatus();
    
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 500);
    }

    // Periodically check service status every 30 seconds
    const statusInterval = setInterval(checkServiceStatus, 30000);
    return () => clearInterval(statusInterval);
  }, []);

  const checkServiceStatus = async () => {
    try {
      // Check database connection by making an API call
      const dbResponse = await api.get('/donors').catch(() => null);
      setDbStatus(dbResponse ? 'connected' : 'disconnected');

      // Check ML service by attempting a health check or prediction endpoint
      const mlResponse = await api.get('/predictions/health-check').catch(() => null);
      setMlServiceStatus(mlResponse ? 'connected' : 'disconnected');
    } catch (err) {
      console.error('Error checking service status:', err);
      setDbStatus('disconnected');
      setMlServiceStatus('disconnected');
    }
  };

  const handleRestartTutorial = () => {
    localStorage.removeItem('hasSeenOnboarding');
    setShowOnboarding(true);
    showSuccess('Tutorial restarted! Follow the steps to learn about the system.');
  };

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
        setDbStatus('connected');
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
      setDbStatus('disconnected');
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
  // Pagination calculations
  const getDonorPagination = () => {
    const startIndex = (donorPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDonors = filteredDonors.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
    return { paginatedDonors, totalPages };
  };

  const getRecipientPagination = () => {
    const startIndex = (recipientPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRecipients = filteredRecipients.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);
    return { paginatedRecipients, totalPages };
  };

  const { paginatedDonors, totalPages: donorTotalPages } = getDonorPagination();
  const { paginatedRecipients, totalPages: recipientTotalPages } = getRecipientPagination();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="p-4 md:p-6">
        {/* Toast Notifications */}
        <ToastComponent />

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
          {/* Enhanced Welcome Header */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-medical-500 to-medical-700 p-3 rounded-xl shadow-lg">
                    <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      Welcome back, {user?.name}
                    </h1>
                    <p className="text-slate-600 mt-0.5 text-sm">
                      NephroSense Intelligent Donor Matching System
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRestartTutorial}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <PlayCircle className="w-4 h-4" strokeWidth={2.5} />
                  <span className="text-sm font-bold">Restart Tutorial</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-lg px-4 py-3 mb-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 rounded-lg">
                  <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-rose-700 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Enhanced Tab Navigation */}
          <div className="mb-5">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-1">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-medical-600 to-medical-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('donors')}
                  className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'donors'
                      ? 'bg-gradient-to-r from-medical-600 to-medical-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Donors
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'donors' ? 'bg-white/20' : 'bg-medical-100 text-medical-700'
                    }`}>
                      {donorCount}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('recipients')}
                  className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === 'recipients'
                      ? 'bg-gradient-to-r from-medical-600 to-medical-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Recipients
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'recipients' ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {recipientCount}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Enhanced Main Action CTA - Clinician Only */}
            {isClinician && (
              <div className="bg-gradient-to-br from-medical-600 via-medical-700 to-teal-600 rounded-xl shadow-xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Start Matching?</h2>
                    <p className="text-medical-100 mb-6 text-sm md:text-base">
                      Use our AI-powered system to find the best donor matches with risk-based ranking
                    </p>
                    <button
                      onClick={() => navigate('/app/make-prediction')}
                      className="bg-white text-medical-700 px-6 py-3 rounded-lg font-bold hover:bg-medical-50 transition-all shadow-lg flex items-center gap-2 text-base group"
                    >
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                      Start Donor Matching
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                      <Heart className="w-20 h-20 text-white opacity-80" strokeWidth={2} />
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

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">
              <div 
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-slate-200 hover:border-medical-300 cursor-pointer relative overflow-hidden"
                onClick={() => setActiveTab('donors')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-medical-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-br from-medical-100 to-medical-50 rounded-lg">
                        <Heart className="w-5 h-5 text-medical-600" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Donors</h3>
                    </div>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-slate-200 rounded w-20 mt-2"></div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-medical-600 mb-1">
                        {donorCount}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">Available for matching</p>
                  </div>
                </div>
              </div>

              <div 
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-slate-200 hover:border-blue-300 cursor-pointer relative overflow-hidden"
                onClick={() => setActiveTab('recipients')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Recipients</h3>
                    </div>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-slate-200 rounded w-20 mt-2"></div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-blue-600 mb-1">
                        {recipientCount}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">Waiting for transplant</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-slate-200 hover:border-purple-300 cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                        <Activity className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Predictions</h3>
                    </div>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-slate-200 rounded w-20 mt-2"></div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-purple-600 mb-1">
                        {predictionCount}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">Total analyses run</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            {isClinician && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-medical-100 rounded-lg">
                    <svg className="w-4 h-4 text-medical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => navigate("/app/donor")}
                    className="bg-gradient-to-br from-medical-50 to-teal-50 hover:from-medical-100 hover:to-teal-100 border-2 border-medical-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-medical-600 to-medical-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Add Donor</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/app/recipient")}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Add Recipient</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/app/make-prediction")}
                    className="bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border-2 border-purple-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                        <Heart className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">Start Matching</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/app/matching-results")}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                        <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-slate-900 text-sm">View Results</span>
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
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or blood group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-sm hover:shadow-md placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-medical-50 to-teal-50 border-b-2 border-medical-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Age</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Blood Group</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                      {isClinician && (
                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDonors.map((donor) => (
                      editingDonor === donor._id ? (
                        <tr key={donor._id} className="bg-gradient-to-r from-medical-50 to-teal-50">
                          <td className="px-4 py-4 text-sm font-semibold text-slate-900">{donor.donorId}</td>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full px-3 py-2 border-2 border-medical-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              value={editFormData.age}
                              onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                              className="w-20 px-3 py-2 border-2 border-medical-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={editFormData.bloodGroup}
                              onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                              className="px-3 py-2 border-2 border-medical-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all"
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
                              className="w-full px-3 py-2 border-2 border-medical-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={editFormData.status}
                              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                              className="px-3 py-2 border-2 border-medical-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all"
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
                              className="bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white px-4 py-2 rounded-lg mr-2 disabled:opacity-50 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={donor._id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-medical-50 transition-all">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{donor.donorId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{donor.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{donor.age}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-medical-100 to-teal-100 text-medical-800 border border-medical-300">
                              {donor.bloodGroup}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{donor.location}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${donor.status === 'active' ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-300' : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300'
                              }`}>
                              {donor.status}
                            </span>
                          </td>
                          {isClinician && (
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditDonor(donor)}
                                className="text-medical-600 hover:text-medical-800 mr-4 p-1 hover:bg-medical-50 rounded transition-all"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDonor(donor._id)}
                                className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {filteredDonors.length === 0 && (
              <EmptyState 
                type={searchQuery ? "searchResults" : "donors"}
                onAction={!searchQuery && isClinician ? () => navigate('/app/donor') : null}
              />
            )}

            {/* Pagination */}
            {filteredDonors.length > itemsPerPage && (
              <Pagination
                currentPage={donorPage}
                totalPages={donorTotalPages}
                totalItems={filteredDonors.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setDonorPage}
              />
            )}
          </div>
        )}

        {/* Recipients Tab */}
        {activeTab === 'recipients' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recipient Management</h2>
              {isClinician && (
                <button
                  onClick={() => navigate('/app/recipient')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all font-medium"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  Add New Recipient
                </button>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or blood group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Age</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Blood Group</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Urgency</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                      {isClinician && (
                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRecipients.map((recipient) => (
                      editingRecipient === recipient._id ? (
                        <tr key={recipient._id} className="bg-gradient-to-r from-blue-50 to-indigo-50">
                          <td className="px-4 py-4 text-sm font-semibold text-slate-900">{recipient.recipientId}</td>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              value={editFormData.age}
                              onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                              className="w-20 px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={editFormData.bloodGroup}
                              onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                              className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                              className="w-20 px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={editFormData.status}
                              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                              className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg mr-2 disabled:opacity-50 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={recipient._id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{recipient.recipientId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{recipient.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{recipient.age}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-300">
                              {recipient.bloodGroup}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${recipient.urgencyScore >= 8 ? 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border-rose-300' :
                              recipient.urgencyScore >= 5 ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300' :
                                'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-300'
                              }`}>
                              {recipient.urgencyScore}/10
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${recipient.status === 'waiting' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300' : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300'
                              }`}>
                              {recipient.status}
                            </span>
                          </td>
                          {isClinician && (
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditRecipient(recipient)}
                                className="text-blue-600 hover:text-blue-800 mr-4 p-1 hover:bg-blue-50 rounded transition-all"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRecipient(recipient._id)}
                                className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {filteredRecipients.length === 0 && (
              <EmptyState 
                type={searchQuery ? "searchResults" : "recipients"}
                onAction={!searchQuery && isClinician ? () => navigate('/app/recipient') : null}
              />
            )}

            {/* Pagination */}
          {filteredRecipients.length > itemsPerPage && (
              <Pagination
                currentPage={recipientPage}
                totalPages={recipientTotalPages}
                totalItems={filteredRecipients.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setRecipientPage}
              />
            )}
          </div>
        )}

        {/* Status Indicator */}
        <div className="fixed bottom-4 right-4 z-40">
          <StatusIndicator 
            mlServiceStatus={mlServiceStatus}
            dbStatus={dbStatus}
            isProcessing={loading}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
