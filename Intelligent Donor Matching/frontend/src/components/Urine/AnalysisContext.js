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
      summary: data.risk_evaluation || data.riskLevel || data.summary || "NORMAL PHYSIOLOGY",
      
   
      patientName: data.patientName || "Anonymous",
      patientId: data.patientId || `NS-${Math.floor(10000 + Math.random() * 90000)}`,
      age: data.age || "N/A",
      gender: data.gender || "N/A",
      
  
      results: data.yolo_data || data.results || [],
      
      hasWarning: data.hasWarning || (data.risk_evaluation?.includes("HIGH") || data.riskLevel?.includes("HIGH")),
      flags: {
        isAbnormal: data.apiResults?.some(m => m.status === 'ABNORMAL') || 
                    data.results?.some(m => m.status === 'ABNORMAL') || 
                    data.hasWarning || false
      },
      
      id: data.id || `REC-${Date.now()}`,
      date: data.date || now.toISOString().split('T')[0],
      time: data.time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
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