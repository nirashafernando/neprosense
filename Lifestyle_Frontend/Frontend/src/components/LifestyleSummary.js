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

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/view-data");
        const data = await response.json();

        if (response.ok && data.length > 0) {
          // Calculate Averages
          const total = data.length;
          const totalWater = data.reduce((acc, curr) => acc + (curr["Water (L)"] || curr.water || 0), 0);
          const totalCalories = data.reduce((acc, curr) => acc + (curr["Calories (kcal)"] || curr.calories || 0), 0);
          const totalSleep = data.reduce((acc, curr) => acc + (curr["Sleep (hrs)"] || curr.sleep || 0), 0);
          const totalActivity = data.reduce((acc, curr) => acc + (curr["Activity (min)"] || curr.activity || 0), 0);

          // Map Trends for Table
          const trends = data.map(item => ({
            date: new Date(item.Date || item.date).toLocaleDateString(),
            water: item["Water (L)"] || item.water,
            calories: item["Calories (kcal)"] || item.calories,
            sleep: item["Sleep (hrs)"] || item.sleep,
            activity: item["Activity (min)"] || item.activity,
          })).reverse(); 

          setSummaryData({
            averages: {
              water: (totalWater / total).toFixed(1),
              calories: Math.round(totalCalories / total),
              sleep: (totalSleep / total).toFixed(1),
              activity: Math.round(totalActivity / total),
            },
            trends: trends
          });
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    // Check if there is data to export
    if (!summaryData.trends || summaryData.trends.length === 0) {
      alert("No data available to export!");
      return;
    }

    console.log("Exporting Data:", summaryData.trends); // Console එකේ Data බලාගන්න

    const doc = new jsPDF();

    // 1. Header Design (Green Background)
    doc.setFillColor(34, 197, 94); 
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Lifestyle Health Report", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });

    // 2. Summary Cards Section
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Weekly Averages", 14, 55);

    // Helper to draw stat boxes
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

    // Ensure values exist before printing
    drawStatBox(14, "Avg. Water", summaryData.averages.water || 0, "L", [59, 130, 246]); 
    drawStatBox(60, "Avg. Calories", summaryData.averages.calories || 0, "kcal", [234, 179, 8]);
    drawStatBox(106, "Avg. Sleep", summaryData.averages.sleep || 0, "hrs", [99, 102, 241]);
    drawStatBox(152, "Avg. Activity", summaryData.averages.activity || 0, "min", [34, 197, 94]);

    // 3. Detailed Table
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
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
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* ... Rest of your UI (Averages and Table) stays same ... */}
        {/* Just make sure to use the exact code below for the table section if you changed it */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Avg. Water Intake", value: summaryData.averages.water, unit: "L", color: "bg-blue-500", icon: "💧" },
            { title: "Avg. Calories", value: summaryData.averages.calories, unit: "kcal", color: "bg-yellow-500", icon: "🔥" },
            { title: "Avg. Sleep", value: summaryData.averages.sleep, unit: "hrs", color: "bg-indigo-500", icon: "😴" },
            { title: "Avg. Activity", value: summaryData.averages.activity, unit: "min", color: "bg-green-500", icon: "🏃" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{item.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {item.value || 0}
                    <span className="text-lg text-gray-500"> {item.unit}</span>
                  </p>
                </div>
                <div className="text-3xl">{item.icon}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.unit === 'kcal' ? Math.min(100, (item.value / 3000) * 100) : Math.min(100, (item.value / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
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
                          day.calories <= 2500 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {day.calories} kcal
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