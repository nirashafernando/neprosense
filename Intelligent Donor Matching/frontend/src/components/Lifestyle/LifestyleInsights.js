import React, { useState, useEffect } from "react";
import { TrendingUp, AlertCircle, CheckCircle, Droplets, Moon, Activity, Utensils } from "lucide-react";

const LifestyleInsights = () => {
  const [insights, setInsights] = useState({
    hydration: { current: 0, recommended: 2.5, status: "below", tips: "Drink more water", improvement: "Need more" },
    dailyCalories: { current: 0, recommended: 2000, status: "below", tips: "Balance diet", improvement: "Check intake" },
    sleep: { current: 0, recommended: 8, status: "below", tips: "Sleep more", improvement: "Need rest" },
    activity: { current: 0, recommended: 30, status: "below", tips: "Move more", improvement: "Walk more" },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/view-data");
            const data = await response.json();

            if (response.ok && data.length > 0) {
                const latest = data[data.length - 1];
                
                const water = latest["Water (L)"] || latest.water;
                const calories = latest["Calories (kcal)"] || latest.calories;
                const sleep = latest["Sleep (hrs)"] || latest.sleep;
                const activity = latest["Activity (min)"] || latest.activity;

                setInsights({
                    hydration: {
                        current: water,
                        recommended: 2.5,
                        status: water >= 2.5 ? "good" : "below",
                        tips: "Aim to drink at least 8 glasses (2 liters) of water daily.",
                        improvement: water < 2.5 ? `+${(2.5 - water).toFixed(1)}L needed` : "Great job!"
                    },
                    dailyCalories: {
                        current: calories,
                        recommended: 2000,
                        status: calories > 2200 ? "above" : "good",
                        tips: "Monitor calorie intake to maintain healthy weight.",
                        improvement: calories > 2000 ? `-${calories - 2000} kcal reduce` : "On track"
                    },
                    sleep: {
                        current: sleep,
                        recommended: 8,
                        status: sleep >= 7 ? "good" : "below",
                        tips: "Maintain a consistent sleep schedule.",
                        improvement: sleep < 8 ? `+${(8 - sleep).toFixed(1)} hrs needed` : "Well rested"
                    },
                    activity: {
                        current: activity,
                        recommended: 30,
                        status: activity >= 30 ? "good" : "below",
                        tips: "Aim for at least 30 minutes of moderate activity.",
                        improvement: activity < 30 ? `+${30 - activity} min needed` : "Active lifestyle!"
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching insights:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchLatestData();
  }, []);

  const getStatusColor = (status) => {
    if (status === "below" || status === "above") return "text-red-600";
    return "text-green-600";
  };

  const getStatusIcon = (status) => {
    return (status === "below" || status === "above") ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />;
  };

  const getIcon = (category) => {
    switch(category) {
      case "hydration": return <Droplets className="w-8 h-8" />;
      case "dailyCalories": return <Utensils className="w-8 h-8" />;
      case "sleep": return <Moon className="w-8 h-8" />;
      case "activity": return <Activity className="w-8 h-8" />;
      default: return <Activity className="w-8 h-8" />;
    }
  };

  const InsightCard = ({ title, data, category }) => {
    const Icon = getIcon(category);
    const StatusIcon = getStatusIcon(data.status);
    
    if (loading) return <div className="p-6 bg-gray-100 rounded-xl animate-pulse">Loading...</div>;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              {Icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <div className="flex items-center space-x-2">
                {StatusIcon}
                <span className={`text-sm font-medium ${getStatusColor(data.status)}`}>
                  {data.status === "good" ? "On Target" : "Needs Attention"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{data.current}</p>
              <p className="text-xs text-gray-600">Current</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{data.recommended}</p>
              <p className="text-xs text-blue-600">Recommended</p>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-semibold">Improvement Needed: </span>
              {data.improvement}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${category === "hydration" ? "bg-blue-500" : category === "dailyCalories" ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(100, (data.current / data.recommended) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">{data.tips}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
            <h1 className="text-2xl font-bold">Lifestyle Insights</h1>
            <p>Based on your latest entry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InsightCard title="Hydration" data={insights.hydration} category="hydration" />
          <InsightCard title="Daily Calories" data={insights.dailyCalories} category="dailyCalories" />
          <InsightCard title="Sleep Quality" data={insights.sleep} category="sleep" />
          <InsightCard title="Physical Activity" data={insights.activity} category="activity" />
        </div>
      </div>
    </div>
  );
};

export default LifestyleInsights;