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
  User
} from "lucide-react";
import api from "../lib/axios";
import MatchDetailsModal from "./MatchDetailsModal";

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPredictionId, setSelectedPredictionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(null); // Track which report is downloading

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

  const getRiskCategoryColor = (category) => {
    if (!category) return "bg-gray-100 text-gray-700";

    const cat = category.toLowerCase();
    if (cat.includes('low')) return "bg-green-100 text-green-700";
    if (cat.includes('medium')) return "bg-yellow-100 text-yellow-700";
    if (cat.includes('high')) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getRiskIcon = (category) => {
    if (!category) return <AlertCircle className="w-4 h-4" />;

    const cat = category.toLowerCase();
    if (cat.includes('low')) return <CheckCircle className="w-4 h-4" />;
    if (cat.includes('medium')) return <AlertCircle className="w-4 h-4" />;
    if (cat.includes('high')) return <AlertCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
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
      const response = await api.get(`/ predictions / batch / ${reportId}/pdf`, {
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
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF report. Please try again.');
    } finally {
      setDownloading(null);
    }
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prediction Reports</h1>
            <p className="text-gray-600">View and manage all donor matching predictions</p>
          </div>
          <div className="bg-medical-100 p-4 rounded-xl">
            <FileText className="w-8 h-8 text-medical-600" />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-medical-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{reports.length}</p>
            </div>
            <FileText className="w-10 h-10 text-medical-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Low Risk</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {reports.filter(r => r.riskCategory?.category?.toLowerCase().includes('low')).length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Medium Risk</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {reports.filter(r => r.riskCategory?.category?.toLowerCase().includes('medium')).length}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">High Risk</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {reports.filter(r => r.riskCategory?.category?.toLowerCase().includes('high')).length}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Recipient ID, Donor ID, or Report ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? "Try adjusting your search criteria" : "Start by making a prediction to generate reports"}
            </p>
            <button
              onClick={() => navigate('/app/make-prediction')}
              className="bg-medical-600 hover:bg-medical-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Make a Prediction
            </button>
          </div>
        ) : (
          filteredReports.map((report, index) => (
            <div
              key={report._id || index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-medical-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Report #{report._id?.slice(-8).toUpperCase() || index + 1}
                    </h3>
                    {report.status && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {report.status}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        <strong>Recipient:</strong> {report.recipientId?.recipientId || report.recipientId?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        <strong>Donors Evaluated:</strong> {report.totalEvaluated || report.donorIds?.length || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Show top donor info */}
                  {report.topDonors && report.topDonors.length > 0 && (
                    <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-semibold text-green-800 mb-2">Top Match</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Donor: {report.topDonors[0].donorId}
                        </span>
                        <span className={`px - 2 py - 1 rounded text - xs font - semibold ${report.topDonors[0].riskCategory?.category === 'Low Risk' ? 'bg-green-100 text-green-700' :
                          report.topDonors[0].riskCategory?.category === 'Medium Risk' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          } `}>
                          {report.topDonors[0].riskCategory?.category || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(report._id)}
                    className="bg-medical-600 hover:bg-medical-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report._id)}
                    disabled={downloading === report._id}
                    className="border-2 border-medical-600 text-medical-600 hover:bg-medical-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                  >
                    {downloading === report._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-medical-600"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        predictionId={selectedPredictionId}
      />
    </div>
  );
};

export default Reports;
