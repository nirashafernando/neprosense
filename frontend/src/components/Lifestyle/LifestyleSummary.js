import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp, Download, Filter, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LifestyleSummary = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [summaryData, setSummaryData] = useState({
    averages: {
      water: 0,
      calories: 0,
      sleep: 0,
      activity: 0,
    },
    trends: []
  });

  // Animated values for average cards
  const [animatedAverages, setAnimatedAverages] = useState({
    water: 0,
    calories: 0,
    sleep: 0,
    activity: 0
  });

  // Animated widths for progress bars
  const [animatedWidths, setAnimatedWidths] = useState({
    water: 0,
    calories: 0,
    sleep: 0,
    activity: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/lifestyle/view-data");
        const data = await response.json();

        if (response.ok && data.length > 0) {
          const total = data.length;
          const totalWater = data.reduce((acc, curr) => acc + (curr["Water (L)"] || curr.water || 0), 0);
          const totalCalories = data.reduce((acc, curr) => acc + (curr["Calories (kcal)"] || curr.calories || 0), 0);
          const totalSleep = data.reduce((acc, curr) => acc + (curr["Sleep (hrs)"] || curr.sleep || 0), 0);
          const totalActivity = data.reduce((acc, curr) => acc + (curr["Activity (min)"] || curr.activity || 0), 0);

          const trends = data.map(item => ({
            date: new Date(item.Date || item.date).toLocaleDateString(),
            water: item["Water (L)"] || item.water,
            calories: item["Calories (kcal)"] || item.calories,
            sleep: item["Sleep (hrs)"] || item.sleep,
            activity: item["Activity (min)"] || item.activity,
          })).reverse();

          const newAverages = {
            water: (totalWater / total).toFixed(1),
            calories: Math.round(totalCalories / total),
            sleep: (totalSleep / total).toFixed(1),
            activity: Math.round(totalActivity / total),
          };

          setSummaryData({
            averages: newAverages,
            trends: trends
          });

          // Calculate target widths for progress bars
          const targetWidths = {
            water: Math.min(100, (newAverages.water / 3) * 100), // Max 3L
            calories: Math.min(100, (newAverages.calories / 3000) * 100), // Max 3000 kcal
            sleep: Math.min(100, (newAverages.sleep / 9) * 100), // Max 9 hrs
            activity: Math.min(100, (newAverages.activity / 60) * 100) // Max 60 min
          };

          // Animate average numbers counting up
          animateAverages(newAverages);
          
          // Animate progress bars
          animateProgressBars(targetWidths);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animate average numbers counting up
  const animateAverages = (targetAverages) => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedAverages({
        water: (parseFloat(targetAverages.water) * progress).toFixed(1),
        calories: Math.min(Math.round(targetAverages.calories * progress), targetAverages.calories),
        sleep: (parseFloat(targetAverages.sleep) * progress).toFixed(1),
        activity: Math.min(Math.round(targetAverages.activity * progress), targetAverages.activity),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);
  };

  // Animate progress bars
  const animateProgressBars = (targetWidths) => {
    const duration = 1000; // 1 second
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedWidths({
        water: Math.min(targetWidths.water * progress, targetWidths.water),
        calories: Math.min(targetWidths.calories * progress, targetWidths.calories),
        sleep: Math.min(targetWidths.sleep * progress, targetWidths.sleep),
        activity: Math.min(targetWidths.activity * progress, targetWidths.activity),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);
  };

  const handleExport = () => {
    if (!summaryData.trends || summaryData.trends.length === 0) {
      alert("No data available to export!");
      return;
    }

    console.log("Exporting Data:", summaryData.trends);

    const doc = new jsPDF();

    doc.setFillColor(34, 197, 94); 
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Lifestyle Health Report", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Weekly Averages", 14, 55);

    const drawStatBox = (x, title, value, unit, color) => {
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(x, 60, 40, 30, 3, 3, 'FD');
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(title, x + 20, 70, { align: "center" });
        
        doc.setFontSize(14);
        doc.setTextColor(color[0], color[1], color[2]); 
        doc.setFont("helvetica", "bold");
        doc.text(`${value} ${unit}`, x + 20, 82, { align: "center" });
    };

    drawStatBox(14, "Avg. Water", summaryData.averages.water || 0, "L", [59, 130, 246]); 
    drawStatBox(60, "Avg. Calories", summaryData.averages.calories || 0, "kcal", [234, 179, 8]);
    drawStatBox(106, "Avg. Sleep", summaryData.averages.sleep || 0, "hrs", [99, 102, 241]);
    drawStatBox(152, "Avg. Activity", summaryData.averages.activity || 0, "min", [34, 197, 94]);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text("Daily Detailed Breakdown", 14, 105);

    const tableColumn = ["Date", "Water (L)", "Calories (kcal)", "Sleep (hrs)", "Activity (min)", "Status"];
    const tableRows = [];

    summaryData.trends.forEach(item => {
      const allGood = item.water >= 2 && item.calories <= 2500 && item.sleep >= 7 && item.activity >= 30;
      const statusText = allGood ? "Good" : "Improve";

      const rowData = [
        item.date,
        item.water,
        item.calories,
        item.sleep,
        item.activity,
        statusText
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      startY: 110,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 5) {
            if (data.cell.raw === 'Good') {
                data.cell.styles.textColor = [34, 197, 94]; 
                data.cell.styles.fontStyle = 'bold';
            } else {
                data.cell.styles.textColor = [220, 38, 38]; 
            }
        }
      }
    });

    doc.save("lifestyle_report.pdf");
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-7 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-96"></div>
                  </div>
                </div>
                <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="p-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const averageCards = [
    { 
      title: "Avg. Water Intake", 
      value: animatedAverages.water, 
      unit: "L", 
      color: "bg-blue-500", 
      icon: "💧",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      delay: 0.1
    },
    { 
      title: "Avg. Calories", 
      value: animatedAverages.calories, 
      unit: "kcal", 
      color: "bg-yellow-500", 
      icon: "🔥",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      delay: 0.2
    },
    { 
      title: "Avg. Sleep", 
      value: animatedAverages.sleep, 
      unit: "hrs", 
      color: "bg-indigo-500", 
      icon: "😴",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      delay: 0.3
    },
    { 
      title: "Avg. Activity", 
      value: animatedAverages.activity, 
      unit: "min", 
      color: "bg-green-500", 
      icon: "🏃",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      delay: 0.4
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl animate-pulse-slowest"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with animations */}
        <div className="mb-8 animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-8 border-green-600 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="bg-green-100 p-3 rounded-full animate-pulse-subtle">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                    Lifestyle Data Summary
                  </h1>
                  <p className="text-gray-600">
                    Comprehensive overview of your lifestyle patterns and trends
                  </p>
                </div>
              </div>
              <button
                onClick={handleExport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group"
              >
                <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Average Cards with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {averageCards.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${item.delay}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color.replace('bg-', 'bg-')}`}></span>
                    {item.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {item.value || 0}
                    <span className="text-lg text-gray-500 ml-1">{item.unit}</span>
                  </p>
                </div>
                <div className={`text-3xl ${item.bgColor} p-3 rounded-xl`}>
                  {item.icon}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${item.color}`}
                  style={{ width: `${animatedWidths[item.unit === 'L' ? 'water' : item.unit === 'kcal' ? 'calories' : item.unit === 'hrs' ? 'sleep' : 'activity']}%` }}
                >
                  <div className="w-full h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              {/* Target indicator */}
              <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>Current</span>
                <span>Target: {item.unit === 'L' ? '3L' : item.unit === 'kcal' ? '3000' : item.unit === 'hrs' ? '9hrs' : '60min'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Trends Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden animate-slideUp" style={{ animationDelay: '0.5s' }}>
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              Daily Trends (All Time)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories (kcal)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleep (hrs)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summaryData.trends.map((day, index) => {
                  const allGood = day.water >= 2 && day.calories <= 2500 && day.sleep >= 7 && day.activity >= 30;
                  return (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 transition-colors duration-200 animate-fadeIn"
                      style={{ animationDelay: `${0.6 + (index * 0.05)}s`, animationFillMode: 'both' }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{day.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 inline-block ${
                          day.water >= 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {day.water}L
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 inline-block ${
                          day.calories <= 2500 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {day.calories} kcal
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 inline-block ${
                          day.sleep >= 7 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {day.sleep}hrs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 inline-block ${
                          day.activity >= 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {day.activity}min
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 inline-block ${
                          allGood ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {allGood ? '✓ Good' : '⚠️ Improve'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Table footer with record count */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Showing {summaryData.trends.length} records • Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Last updated indicator */}
        <div className="text-center text-xs text-gray-400 mt-4 animate-fadeIn" style={{ animationDelay: '1s' }}>
          <p>📊 Summary updates automatically with new entries</p>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        
        @keyframes pulse-slowest {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 4s ease-in-out infinite;
        }
        
        .animate-pulse-slowest {
          animation: pulse-slowest 5s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LifestyleSummary;