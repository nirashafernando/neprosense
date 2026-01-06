import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  Upload, 
  History, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Users,
  BarChart3,
  Clock,
  ArrowRight,
  Heart
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTests: 0,
    highRiskCases: 0,
    accuracyRate: 0,
    recentTests: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalTests: 245,
        highRiskCases: 42,
        accuracyRate: 94.5,
        recentTests: 18
      });
      setRecentActivities([
        { id: 1, patient: "John Smith", result: "High Risk", time: "2 hours ago" },
        { id: 2, patient: "Maria Garcia", result: "Normal", time: "4 hours ago" },
        { id: 3, patient: "Robert Chen", result: "Medium Risk", time: "1 day ago" },
        { id: 4, patient: "Sarah Johnson", result: "High Risk", time: "2 days ago" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      title: "Total Tests",
      value: stats.totalTests,
      icon: Activity,
      color: "bg-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      textColor: "text-blue-700",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "High Risk Cases",
      value: stats.highRiskCases,
      icon: AlertCircle,
      color: "bg-red-500",
      bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
      textColor: "text-red-700",
      gradient: "from-red-500 to-pink-600",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Accuracy Rate",
      value: `${stats.accuracyRate}%`,
      icon: TrendingUp,
      color: "bg-green-500",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
      textColor: "text-green-700",
      gradient: "from-green-500 to-teal-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Recent Tests",
      value: stats.recentTests,
      icon: Clock,
      color: "bg-purple-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      textColor: "text-purple-700",
      gradient: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "New Test Analysis",
      description: "Upload and analyze urine test strip",
      icon: Upload,
      path: "/analysis",
      color: "bg-medical-500",
      bgColor: "bg-medical-50",
      iconColor: "text-medical-600",
    },
    {
      title: "View Test History",
      description: "Access previous test results",
      icon: History,
      path: "/test-history",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Generate Reports",
      description: "Create detailed test reports",
      icon: FileText,
      path: "/reports",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "System Analytics",
      description: "View performance metrics",
      icon: BarChart3,
      path: "/analytics",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Shehani</h1>
        <p className="text-gray-600">NephroSense Urine Test Analysis System</p>
      </div>

      {/* Main Action CTA */}
      <div className="bg-gradient-to-r from-medical-600 to-teal-600 rounded-xl shadow-xl p-8 mb-8 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to Analyze?</h2>
            <p className="text-medical-100 mb-6">
              Use our AI-powered dual-channel CNN to analyze urine test strips 
            </p>
            <button
              onClick={() => navigate("/analysis")}
              className="bg-white text-medical-700 px-8 py-4 rounded-lg font-semibold hover:bg-medical-50 transition-all shadow-lg flex items-center gap-2 text-lg"
            >
              <Upload className="w-6 h-6" />
              Start New Analysis
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border-2 border-white shadow-lg hover:shadow-xl transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.iconBg} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`${action.bgColor} hover:scale-105 border-2 border-transparent hover:border-${action.color.split('-')[1]}-200 p-4 rounded-xl transition-all group`}
              >
                <div className="flex flex-col items-center">
                  <div className={`${action.color} p-3 rounded-full mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center">{action.title}</span>
                  <p className="text-xs text-gray-500 text-center mt-1">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
          <button
            onClick={() => navigate("/test-history")}
            className="text-medical-600 hover:text-medical-800 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${activity.result === "High Risk" ? 'bg-red-100' : activity.result === "Medium Risk" ? 'bg-yellow-100' : 'bg-green-100'}`}>
                  <Users className={`w-5 h-5 ${activity.result === "High Risk" ? 'text-red-600' : activity.result === "Medium Risk" ? 'text-yellow-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.patient}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.result === "High Risk" ? 'bg-red-100 text-red-700' : activity.result === "Medium Risk" ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {activity.result}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Info Footer */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-medical-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">System Information</h3>
            <p className="text-sm text-gray-600">
              Dual-Channel CNN Model • Accuracy • Lighting Correction 
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">System Status: Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;