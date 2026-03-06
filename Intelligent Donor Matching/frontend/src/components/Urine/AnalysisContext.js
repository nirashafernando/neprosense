import React, { createContext, useContext, useState, useEffect } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysisHistory, setAnalysisHistory] = useState(() => {
    const saved = localStorage.getItem("nephro_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("nephro_history", JSON.stringify(analysisHistory));
  }, [analysisHistory]);

  const addAnalysis = (data) => {
    const now = new Date();
    
    const processedData = {
      ...data,
      // Logic for Risk Evaluation Summary
      summary: data.riskLevel || data.summary || "NORMAL",
      
      // Patient Data Logic
      patientName: data.patientName || "Anonymous",
      patientId: data.patientId || `PID-${Math.floor(Math.random() * 10000)}`,
      age: data.age || "N/A",
      gender: data.gender || "N/A",
      
      // Flags for Critical/Abnormal status
      hasWarning: data.hasWarning || data.riskLevel?.includes("HIGH") || false,
      flags: {
        ...data.flags,
        isAbnormal: data.apiResults?.some(m => m.status === 'ABNORMAL') || data.hasWarning || false
      },
      
      // Timestamps formatted for the Dashboard table
      id: data.id || `NS-${Date.now()}`,
      date: data.date || now.toLocaleDateString(),
      time: data.time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toISOString()
    };

    setAnalysisHistory((prev) => [processedData, ...prev]);
  };

  const deleteAnalysis = (id) => {
    setAnalysisHistory((prev) => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all diagnostic history?")) {
      setAnalysisHistory([]);
    }
  };

  return (
    <AnalysisContext.Provider value={{ analysisHistory, addAnalysis, deleteAnalysis, clearHistory }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);