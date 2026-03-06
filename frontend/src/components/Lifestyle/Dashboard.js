import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  Heart,
  ArrowRight,
  Calendar,
  Users,
  Droplets,
  AlertCircle 
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    riskAssessments: 0,
    positiveTrends: 0,
    activeUsers: 1,
  });

  const [recentEntries, setRecentEntries] = useState([]);
  
  const [riskDistribution, setRiskDistribution] = useState({
    low: 0,
    moderate: 0,
    high: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/lifestyle/view-data");
        const data = await response.json();

        if (response.ok) {
          const total = data.length;

          let low = 0, mod = 0, high = 0;
          
          const processedEntries = data.map((item, index) => {
            const water = item["Water (L)"] || item.water;
            const calories = item["Calories (kcal)"] || item.calories;
            const sleep = item["Sleep (hrs)"] || item.sleep;
            
            let riskLevel = "Low";
            if (water < 1.5 || calories > 2500) riskLevel = "High";
            else if (water < 2.0 || calories > 2200) riskLevel = "Moderate";

            if (riskLevel === "Low") low++;
            else if (riskLevel === "Moderate") mod++;
            else high++;

            return {
              id: item.ID || index,
              user: `Entry #${item.ID}`,
              risk: riskLevel,
              date: new Date(item.Date || item.date).toLocaleDateString(),
              hydration: `${water}L`,
              activity: `${item["Activity (min)"] || item.activity}min`
            };
          });

          setStats({
            totalEntries: total,
            riskAssessments: total,
            positiveTrends: Math.floor(low / (total || 1) * 100),
            activeUsers: 1,
          });

          setRiskDistribution({
            low: total ? Math.round((low / total) * 100) : 0,
            moderate: total ? Math.round((mod / total) * 100) : 0,
            high: total ? Math.round((high / total) * 100) : 0,
          });

          setRecentEntries(processedEntries.slice(-4).reverse());
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: "Total Lifestyle Entries",
      value: stats.totalEntries,
      icon: Calendar,
      gradient: "from-green-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-green-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Assessments Done",
      value: stats.riskAssessments,
      icon: Activity,
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Health Score",
      value: `${stats.positiveTrends}%`,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "low": return "bg-green-100 text-green-700";
      case "moderate": return "bg-yellow-100 text-yellow-700";
      case "high": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Welcome Header */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-xl shadow-lg">
                    <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      Lifestyle Management Dashboard
                    </h1>
                    <p className="text-slate-600 mt-0.5 text-sm">
                      Monitor and improve CKD patient lifestyles with AI-powered insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                      {loading ? (
                        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
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

        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Start Tracking Today's Lifestyle</h2>
              <p className="text-blue-100 mb-6">
                Log daily habits, monitor trends, and receive personalized recommendations
              </p>
              <button
                onClick={() => navigate('/lifestyle/tracker')}
                className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2 text-lg"
              >
                <Heart className="w-6 h-6" />
                Go to Lifestyle Tracker
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
                <Activity className="w-24 h-24 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Distribution (Real-time)</h2>
            <div className="space-y-4">
              {Object.entries(riskDistribution).map(([risk, percentage]) => (
                <div key={risk} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 capitalize">{risk} Risk</span>
                    <span className="font-semibold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        risk === 'low' ? 'bg-green-500' :
                        risk === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Lifestyle Entries</h2>
            {loading ? (
              <p className="text-gray-500">Loading data...</p>
            ) : recentEntries.length === 0 ? (
              <p className="text-gray-500">No entries found. Start tracking!</p>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">{entry.user}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-4 h-4" />
                          {entry.hydration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-4 h-4" />
                          {entry.activity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(entry.risk)}`}>
                        {entry.risk}
                      </span>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/lifestyle/tracker")}
              className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 p-4 rounded-lg transition-all group"
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900">Daily Tracker</span>
              </div>
            </button>

            <button
              onClick={() => navigate("/lifestyle/insights")}
              className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 p-4 rounded-lg transition-all group"
            >
              <div className="flex flex-col items-center">
                <div className="bg-purple-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900">View Insights</span>
              </div>
            </button>

            <button
              onClick={() => navigate("/lifestyle/risk-prediction")}
              className="bg-red-50 hover:bg-red-100 border-2 border-red-200 p-4 rounded-lg transition-all group"
            >
              <div className="flex flex-col items-center">
                <div className="bg-red-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900">Risk Analysis</span>
              </div>
            </button>

            <button
              onClick={() => navigate("/lifestyle/summary")}
              className="bg-green-50 hover:bg-green-100 border-2 border-green-200 p-4 rounded-lg transition-all group"
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900">Data Summary</span>
              </div>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;