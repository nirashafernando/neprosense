import React, { useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle, Droplets, Moon, Activity, Utensils } from "lucide-react";

const LifestyleInsights = () => {
  const [insights] = useState({
    hydration: {
      current: 1.5,
      recommended: 2.5,
      status: "below",
      tips: "Aim to drink at least 8 glasses (2 liters) of water daily. Keep a water bottle nearby as a reminder.",
      improvement: "+40% needed"
    },
    salt: {
      current: 8,
      recommended: 5,
      status: "above",
      tips: "The WHO recommends less than 5g of salt per day. Reduce processed foods and use herbs for flavor.",
      improvement: "-37.5% needed"
    },
    sleep: {
      current: 5.5,
      recommended: 8,
      status: "below",
      tips: "Adults need 7-9 hours of sleep. Maintain a consistent sleep schedule and avoid screens before bed.",
      improvement: "+45% needed"
    },
    activity: {
      current: 15,
      recommended: 30,
      status: "below",
      tips: "Aim for at least 30 minutes of moderate activity daily. Start with short walks and gradually increase.",
      improvement: "+100% needed"
    },
  });

  const getStatusColor = (status, value) => {
    if (status === "below" && value === "hydration") return "text-blue-600";
    if (status === "below" && value === "salt") return "text-yellow-600";
    if (status === "below" && value === "sleep") return "text-indigo-600";
    if (status === "below" && value === "activity") return "text-green-600";
    return "text-red-600";
  };

  const getStatusIcon = (status) => {
    return status === "below" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />;
  };

  const getIcon = (category) => {
    switch(category) {
      case "hydration": return <Droplets className="w-8 h-8" />;
      case "salt": return <Utensils className="w-8 h-8" />;
      case "sleep": return <Moon className="w-8 h-8" />;
      case "activity": return <Activity className="w-8 h-8" />;
      default: return <Activity className="w-8 h-8" />;
    }
  };

  const InsightCard = ({ title, data, category }) => {
    const Icon = getIcon(category);
    const StatusIcon = getStatusIcon(data.status);
    
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
                <span className={`text-sm font-medium ${getStatusColor(data.status, category)}`}>
                  {data.status === "below" ? "Below Target" : "Above Target"}
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
                className={`h-2 rounded-full ${
                  category === "hydration" ? "bg-blue-500" :
                  category === "salt" ? "bg-yellow-500" :
                  category === "sleep" ? "bg-indigo-500" : "bg-green-500"
                }`}
                style={{ 
                  width: `${Math.min(100, (data.current / data.recommended) * 100)}%` 
                }}
              ></div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.tips}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Lifestyle Insights & Analytics
                </h1>
                <p className="text-gray-600">
                  Track your daily habits against recommended values for CKD management
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InsightCard title="Hydration" data={insights.hydration} category="hydration" />
          <InsightCard title="Salt Intake" data={insights.salt} category="salt" />
          <InsightCard title="Sleep Quality" data={insights.sleep} category="sleep" />
          <InsightCard title="Physical Activity" data={insights.activity} category="activity" />
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Daily Summary Overview
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{insights.hydration.current}L</div>
              <div className="text-sm text-blue-700 mt-1">Water Intake</div>
              <div className="text-xs text-gray-500 mt-2">Target: {insights.hydration.recommended}L</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
              <div className="text-3xl font-bold text-yellow-600">{insights.salt.current}g</div>
              <div className="text-sm text-yellow-700 mt-1">Salt Consumption</div>
              <div className="text-xs text-gray-500 mt-2">Limit: {insights.salt.recommended}g</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600">{insights.sleep.current}hrs</div>
              <div className="text-sm text-indigo-700 mt-1">Sleep Duration</div>
              <div className="text-xs text-gray-500 mt-2">Goal: {insights.sleep.recommended}hrs</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{insights.activity.current}min</div>
              <div className="text-sm text-green-700 mt-1">Activity Time</div>
              <div className="text-xs text-gray-500 mt-2">Target: {insights.activity.recommended}min</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-500 p-6 rounded-xl">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Key Recommendations</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Increase water intake by {insights.hydration.improvement} to reach optimal hydration levels</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reduce salt consumption by {insights.salt.improvement} to meet recommended limits</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Add {insights.activity.improvement} more activity minutes daily for better cardiovascular health</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Aim for {insights.sleep.improvement} more sleep to support kidney function and recovery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleInsights;