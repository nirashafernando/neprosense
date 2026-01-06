import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  BarChart3,
  Activity,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle,
  AlertCircle,
  Users,
  Heart,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAnalysis: 0,
    completedPredictions: 0,
    pendingValidation: 0,
    accuracyRate: 0
  });

  const [recentAnalysis, setRecentAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalAnalysis: 42,
        completedPredictions: 38,
        pendingValidation: 4,
        accuracyRate: 87
      });
      setRecentAnalysis([
        { id: 1, patientId: "P001", stage: "Stage 2", date: "2024-03-15", status: "completed" },
        { id: 2, patientId: "P002", stage: "Stage 3", date: "2024-03-14", status: "completed" },
        { id: 3, patientId: "P003", stage: "Stage 1", date: "2024-03-13", status: "pending" },
        { id: 4, patientId: "P004", stage: "Stage 4", date: "2024-03-12", status: "completed" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      title: "Total Analysis",
      value: stats.totalAnalysis,
      icon: Activity,
      gradient: "from-blue-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Predictions Completed",
      value: stats.completedPredictions,
      icon: CheckCircle,
      gradient: "from-green-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Validation",
      value: stats.pendingValidation,
      icon: AlertCircle,
      gradient: "from-yellow-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Accuracy Rate",
      value: `${stats.accuracyRate}%`,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Start New Analysis",
      description: "Upload kidney ultrasound for CKD staging",
      icon: Upload,
      color: "bg-gradient-to-r from-blue-500 to-cyan-600",
      onClick: () => navigate("/analysis"),
    },
    {
      title: "View Reports",
      description: "Access detailed prediction reports",
      icon: BarChart3,
      color: "bg-gradient-to-r from-green-500 to-teal-600",
      onClick: () => navigate("/reports"),
    },
    {
      title: "Model Performance",
      description: "Check AI model accuracy metrics",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-purple-500 to-pink-600",
      onClick: () => navigate("/model-performance"),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome to NephroSense Ultrasound</h1>
          <p className="text-gray-600">AI-powered kidney ultrasound analysis for CKD stage prediction</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-xl p-6 border-2 border-white shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium tracking-wide text-gray-600 uppercase">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-xl`}>
                    <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Action CTA */}
        <div className="p-8 mb-8 text-white shadow-xl bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Ready to Analyze Kidney Ultrasound?</h2>
              <p className="mb-6 text-blue-100">
                Upload ultrasound images for automated CKD stage prediction with AI segmentation
              </p>
              <button
                onClick={() => navigate("/analysis")}
                className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-blue-700 transition-all bg-white rounded-lg shadow-lg hover:bg-blue-50"
              >
                <Upload className="w-6 h-6" />
                Start New Analysis
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="hidden md:block">
              <div className="p-6 rounded-full bg-white/10 backdrop-blur-sm">
                <Activity className="w-24 h-24 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="p-6 text-left transition-all bg-white border-2 border-gray-200 shadow-lg rounded-xl hover:border-blue-500 hover:shadow-xl group"
              >
                <div className={`${action.color} p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>

        {/* Recent Analysis */}
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Analysis</h2>
            <p className="text-sm text-gray-600">Latest kidney ultrasound predictions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Patient ID</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">CKD Stage</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAnalysis.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.stage === "Stage 1" ? "bg-green-100 text-green-800" :
                        item.stage === "Stage 2" ? "bg-blue-100 text-blue-800" :
                        item.stage === "Stage 3" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {item.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <button className="mr-3 text-blue-600 hover:text-blue-900">
                        <Eye className="inline w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recentAnalysis.length === 0 && !loading && (
            <div className="py-12 text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No analysis records found</p>
              <button
                onClick={() => navigate("/analysis")}
                className="mt-4 font-medium text-blue-600 hover:text-blue-800"
              >
                Start your first analysis →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;