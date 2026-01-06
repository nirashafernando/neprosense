import React, { useState } from "react";
import { Calendar, TrendingUp, Download, Filter, Search } from "lucide-react";

const LifestyleSummary = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");
  
  const summaryData = {
    averages: {
      water: 2.1,
      salt: 6.3,
      sleep: 6.8,
      activity: 28,
    },
    trends: [
      { date: "Mon", water: 1.8, salt: 7.2, sleep: 6.5, activity: 25 },
      { date: "Tue", water: 2.0, salt: 6.8, sleep: 7.0, activity: 30 },
      { date: "Wed", water: 2.2, salt: 5.9, sleep: 6.2, activity: 20 },
      { date: "Thu", water: 2.3, salt: 6.1, sleep: 7.2, activity: 35 },
      { date: "Fri", water: 2.1, salt: 6.5, sleep: 6.8, activity: 32 },
      { date: "Sat", water: 2.4, salt: 5.8, sleep: 7.5, activity: 40 },
      { date: "Sun", water: 2.0, salt: 6.2, sleep: 6.9, activity: 28 },
    ]
  };

  const handleExport = () => {
    alert("Export functionality will be implemented soon!");
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Lifestyle Data Summary
                  </h1>
                  <p className="text-gray-600">
                    Comprehensive overview of your lifestyle patterns and trends
                  </p>
                </div>
              </div>
              <button
                onClick={handleExport}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search entries or dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="quarter">Past 3 Months</option>
                <option value="year">Past Year</option>
              </select>
            </div>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Averages Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Avg. Water Intake", value: summaryData.averages.water, unit: "L", color: "bg-blue-500", icon: "💧" },
            { title: "Avg. Salt Intake", value: summaryData.averages.salt, unit: "g", color: "bg-yellow-500", icon: "🧂" },
            { title: "Avg. Sleep", value: summaryData.averages.sleep, unit: "hrs", color: "bg-indigo-500", icon: "😴" },
            { title: "Avg. Activity", value: summaryData.averages.activity, unit: "min", color: "bg-green-500", icon: "🏃" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{item.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {item.value}
                    <span className="text-lg text-gray-500"> {item.unit}</span>
                  </p>
                </div>
                <div className="text-3xl">{item.icon}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${Math.min(100, (item.value / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Trends Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Trends ({timeRange})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salt (g)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleep (hrs)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summaryData.trends.map((day, index) => {
                  const allGood = day.water >= 2 && day.salt <= 5 && day.sleep >= 7 && day.activity >= 30;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{day.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          day.water >= 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {day.water}L
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          day.salt <= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {day.salt}g
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          day.sleep >= 7 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {day.sleep}hrs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          day.activity >= 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {day.activity}min
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          allGood ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {allGood ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSummary;