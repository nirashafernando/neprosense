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

  const statCards = [
    {
      title: "Total Lifestyle Entries",
      value: stats.totalEntries,
      subtitle: "Tracked records",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Assessments Done",
      value: stats.riskAssessments,
      subtitle: "Risk evaluations",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Health Score",
      value: `${stats.positiveTrends}%`,
      subtitle: "Low-risk ratio",
      icon: TrendingUp,
      color: "text-medical-600",
      bgColor: "bg-medical-50",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      subtitle: "Currently monitoring",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
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

          {/* Welcome Header */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-medical-500 to-medical-700 p-3 rounded-xl shadow-lg">
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

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                {loading ? (
                  <div className="h-9 bg-gray-200 rounded w-3/4 animate-pulse mb-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                )}
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-br from-medical-600 via-medical-700 to-teal-600 rounded-xl shadow-xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Start Tracking Today's Lifestyle</h2>
                <p className="text-medical-100 mb-6 text-sm md:text-base">
                  Log daily habits, monitor trends, and receive personalized recommendations
                </p>
                <button
                  onClick={() => navigate('/lifestyle/tracker')}
                  className="bg-white text-medical-700 px-6 py-3 rounded-lg font-bold hover:bg-medical-50 transition-all shadow-lg flex items-center gap-2 text-base group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  Go to Lifestyle Tracker
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </button>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                  <Activity className="w-20 h-20 text-white opacity-80" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Distribution + Recent Entries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-medical-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-medical-600" />
                </div>
                Risk Distribution (Real-time)
              </h2>
              <div className="space-y-4">
                {Object.entries(riskDistribution).map(([risk, percentage]) => (
                  <div key={risk} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700 capitalize">{risk} Risk</span>
                      <span className="font-semibold text-slate-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          risk === 'low' ? 'bg-green-500' :
                          risk === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                Recent Lifestyle Entries
              </h2>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentEntries.length === 0 ? (
                <p className="text-slate-500 text-sm">No entries found. Start tracking!</p>
              ) : (
                <div className="space-y-3">
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{entry.user}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" />{entry.hydration}</span>
                          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" />{entry.activity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRiskColor(entry.risk)}`}>{entry.risk}</span>
                        <span className="text-xs text-slate-400">{entry.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
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
                onClick={() => navigate("/lifestyle/tracker")}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                    <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Daily Tracker</span>
                </div>
              </button>

              <button
                onClick={() => navigate("/lifestyle/insights")}
                className="bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border-2 border-purple-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                    <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">View Insights</span>
                </div>
              </button>

              <button
                onClick={() => navigate("/lifestyle/risk-prediction")}
                className="bg-gradient-to-br from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 border-2 border-rose-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-rose-600 to-red-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                    <AlertCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Risk Analysis</span>
                </div>
              </button>

              <button
                onClick={() => navigate("/lifestyle/summary")}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-300 p-4 rounded-lg transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform shadow-md">
                    <Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">Data Summary</span>
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