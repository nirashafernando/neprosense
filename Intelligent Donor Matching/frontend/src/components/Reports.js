import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Heart,
  User,
  Trash2,
  Clock
} from "lucide-react";
import api from "../lib/axios";
import MatchDetailsModal from "./MatchDetailsModal";
import { useToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

const Reports = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, ToastComponent } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPredictionId, setSelectedPredictionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(null); // Track which report is downloading
  const [deleting, setDeleting] = useState(null); // Track which report is being deleted
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Fetch batch prediction requests
      const response = await api.get('/predictions/my-predictions');

      if (response.data.success) {
        setReports(response.data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports");
      setLoading(false);
    }
  };

  const handleViewDetails = (reportId) => {
    setSelectedPredictionId(reportId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPredictionId(null);
  };

  const handleDownloadReport = async (reportId) => {
    setDownloading(reportId);
    try {
      const response = await api.get(`/predictions/batch/${reportId}/pdf`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Donor_Matching_Report_${reportId.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('Report downloaded successfully');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      showError('Failed to download PDF report. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleDeleteReport = async (reportId, reportName) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Report?",
      message: `Are you sure you want to delete ${reportName}? This action cannot be undone.`,
      type: "danger",
      confirmText: "Delete Report",
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        executeDelete(reportId);
      }
    });
  };

  const executeDelete = async (reportId) => {
    setDeleting(reportId);
    try {
      await api.delete(`/predictions/batch/${reportId}`);

      // Remove from local state
      setReports(reports.filter(r => r._id !== reportId));

      showSuccess('Report deleted successfully');
    } catch (err) {
      console.error('Error deleting report:', err);
      showError('Failed to delete report: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(null);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
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
  };

  const filteredReports = reports.filter(report => {
    const searchLower = searchQuery.toLowerCase();

    // Handle recipientId as object or string
    const recipientMatch = report.recipientId?.recipientId?.toLowerCase().includes(searchLower) ||
      report.recipientId?.name?.toLowerCase().includes(searchLower) ||
      (typeof report.recipientId === 'string' && report.recipientId.toLowerCase().includes(searchLower));

    // Handle donorIds as array
    const donorMatch = report.donorIds?.some(donor =>
      donor?.donorId?.toLowerCase().includes(searchLower) ||
      donor?.name?.toLowerCase().includes(searchLower)
    ) || false;

    // Handle report ID
    const reportIdMatch = report._id?.toLowerCase().includes(searchLower);

    const matchesSearch = recipientMatch || donorMatch || reportIdMatch;

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && report.status === filterStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Professional Medical Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-medical-500 to-medical-700 p-3 rounded-xl shadow-lg">
                  <FileText className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    Clinical Reports
                  </h1>
                  <p className="text-slate-600 mt-0.5 text-sm">
                    Donor-recipient compatibility analysis
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-medical-50 to-emerald-50 px-4 py-2 rounded-lg border border-medical-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-700">System Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards with Medical Theme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-slate-200 hover:border-medical-300 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-medical-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-medical-100 to-medical-50 rounded-lg">
                  <FileText className="w-5 h-5 text-medical-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
              </div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Total Reports</p>
              <p className="text-xs text-slate-500">All time generated</p>
            </div>
          </div>

          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-slate-200 hover:border-emerald-300 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {reports.filter(r => 
                    r.predictions?.some(p => p.riskCategory?.category?.toLowerCase().includes('low'))
                  ).length}
                </p>
              </div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Low Risk</p>
              <p className="text-xs text-emerald-600 font-medium">Optimal matches</p>
            </div>
          </div>

          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-slate-200 hover:border-amber-300 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {reports.filter(r => 
                    r.predictions?.some(p => p.riskCategory?.category?.toLowerCase().includes('medium'))
                  ).length}
                </p>
              </div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Medium Risk</p>
              <p className="text-xs text-amber-600 font-medium">Requires monitoring</p>
            </div>
          </div>

          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-slate-200 hover:border-rose-300 cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-100 to-transparent rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-rose-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {reports.filter(r => 
                    r.predictions?.some(p => p.riskCategory?.category?.toLowerCase().includes('high'))
                  ).length}
                </p>
              </div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">High Risk</p>
              <p className="text-xs text-rose-600 font-medium">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-medical-600 transition-colors">
                <Search className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search by Recipient ID, Donor ID, or Report ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-medical-600 transition-colors pointer-events-none">
                <Filter className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 appearance-none transition-all text-slate-700 cursor-pointer bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-lg px-4 py-3 mb-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-rose-700 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Enhanced Reports List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-medical-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-medical-600" />
                </div>
              </div>
              <p className="text-slate-600 font-medium">Loading clinical reports...</p>
              <p className="text-slate-400 text-xs">Please wait while we retrieve your data</p>
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <EmptyState 
            type={searchQuery ? "searchResults" : "reports"}
            onAction={() => navigate('/app/make-prediction')}
          />
        ) : (
          <>
            {paginatedReports.map((report, index) => {
              const { date, time } = formatDateTime(report.createdAt || Date.now());
              const topDonor = report.topDonors?.[0];
              const riskCategory = topDonor?.riskCategory?.category || 'N/A';
              const isLowRisk = riskCategory.toLowerCase().includes('low');
              const isMediumRisk = riskCategory.toLowerCase().includes('medium');
              const isHighRisk = riskCategory.toLowerCase().includes('high');

              return (
                <div
                  key={report._id || index}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-slate-200 hover:border-medical-300 overflow-hidden"
                >
                  {/* Report Header with Color Accent */}
                  <div className={`h-1.5 ${isLowRisk ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : isMediumRisk ? 'bg-gradient-to-r from-amber-400 to-amber-600' : isHighRisk ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 'bg-gradient-to-r from-medical-400 to-medical-600'}`}></div>
                  
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Main Content */}
                      <div className="flex-1 space-y-4">
                        {/* Report Title & Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-medical-100 to-medical-50 rounded-lg">
                              <FileText className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                              #{report._id?.slice(-8).toUpperCase() || `REP${index + 1}`}
                            </h3>
                          </div>
                          {report.status && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200">
                              {report.status}
                            </span>
                          )}
                        </div>

                        {/* Clinical Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm mt-0.5">
                              <User className="w-4 h-4 text-medical-600" strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recipient</p>
                              <p className="text-sm font-bold text-slate-900">
                                {report.recipientId?.recipientId || report.recipientId?.name || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm mt-0.5">
                              <Heart className="w-4 h-4 text-rose-600" strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Donors Evaluated</p>
                              <p className="text-sm font-bold text-slate-900">
                                {report.totalEvaluated || report.donorIds?.length || "N/A"} candidates
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm mt-0.5">
                              <Calendar className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Analysis Date</p>
                              <p className="text-sm font-bold text-slate-900">{date}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm mt-0.5">
                              <Clock className="w-4 h-4 text-indigo-600" strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Analysis Time</p>
                              <p className="text-sm font-bold text-slate-900">{time}</p>
                            </div>
                          </div>
                        </div>

                        {/* Recommended Match - Enhanced Design */}
                        {topDonor && (
                          <div className={`p-4 rounded-lg border-2 ${
                            isLowRisk ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300' :
                            isMediumRisk ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300' :
                            isHighRisk ? 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-300' :
                            'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-300'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${
                                  isLowRisk ? 'bg-emerald-200' :
                                  isMediumRisk ? 'bg-amber-200' :
                                  isHighRisk ? 'bg-rose-200' :
                                  'bg-slate-200'
                                }`}>
                                  <CheckCircle className={`w-4 h-4 ${
                                    isLowRisk ? 'text-emerald-700' :
                                    isMediumRisk ? 'text-amber-700' :
                                    isHighRisk ? 'text-rose-700' :
                                    'text-slate-700'
                                  }`} strokeWidth={2.5} />
                                </div>
                                <p className={`text-xs font-bold uppercase tracking-wider ${
                                  isLowRisk ? 'text-emerald-800' :
                                  isMediumRisk ? 'text-amber-800' :
                                  isHighRisk ? 'text-rose-800' :
                                  'text-slate-800'
                                }`}>
                                  AI-Recommended Match
                                </p>
                              </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isLowRisk ? 'bg-emerald-600 text-white' :
                                isMediumRisk ? 'bg-amber-600 text-white' :
                                isHighRisk ? 'bg-rose-600 text-white' :
                                'bg-slate-600 text-white'
                              }`}>
                                {riskCategory}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-xs font-semibold ${
                                  isLowRisk ? 'text-emerald-700' :
                                  isMediumRisk ? 'text-amber-700' :
                                  isHighRisk ? 'text-rose-700' :
                                  'text-slate-700'
                                }`}>Optimal Donor Match</p>
                                <p className="text-base font-bold text-slate-900">Donor: {topDonor.donorId}</p>
                              </div>
                              {topDonor.compatibilityScore && (
                                <div className="text-right">
                                  <p className={`text-xs font-semibold ${
                                    isLowRisk ? 'text-emerald-700' :
                                    isMediumRisk ? 'text-amber-700' :
                                    isHighRisk ? 'text-rose-700' :
                                    'text-slate-700'
                                  }`}>Compatibility</p>
                                  <p className="text-base font-bold text-slate-900">
                                    {(topDonor.compatibilityScore * 100).toFixed(1)}%
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Redesigned */}
                      <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto lg:min-w-[200px]">
                        <button
                          onClick={() => handleViewDetails(report._id)}
                          className="flex-1 lg:flex-none bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2.5} />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={() => handleDownloadReport(report._id)}
                          disabled={downloading === report._id}
                          className="flex-1 lg:flex-none border-2 border-medical-600 text-medical-600 hover:bg-medical-50 disabled:bg-slate-100 disabled:border-slate-300 disabled:text-slate-400 px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
                        >
                          {downloading === report._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-medical-600 border-t-transparent"></div>
                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" strokeWidth={2.5} />
                              <span>Download PDF</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteReport(report._id, `Report #${report._id?.slice(-8).toUpperCase()}`)}
                          disabled={deleting === report._id}
                          className="flex-1 lg:flex-none border-2 border-rose-600 text-rose-600 hover:bg-rose-50 disabled:bg-slate-100 disabled:border-slate-300 disabled:text-slate-400 px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
                        >
                          {deleting === report._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-rose-600 border-t-transparent"></div>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Pagination */}
          {filteredReports.length > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredReports.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
          </>
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        {...confirmDialog}
        onClose={() => setConfirmDialog({ isOpen: false })}
      />
      </div>
    </div>
  );
};

export default Reports;
