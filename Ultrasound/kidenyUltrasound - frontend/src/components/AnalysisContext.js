import React, { createContext, useContext, useState, useEffect } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysisHistory, setAnalysisHistory] = useState(() => {
    const savedData = localStorage.getItem("nephrosense_history");
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem("nephrosense_history", JSON.stringify(analysisHistory));
  }, [analysisHistory]);

  const addAnalysis = (newAnalysis) => {
    const analysisWithId = {
      ...newAnalysis,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "completed"
    };
    
    setAnalysisHistory((prev) => [analysisWithId, ...prev]);
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem("nephrosense_history");
  };

  return (
    <AnalysisContext.Provider value={{ analysisHistory, addAnalysis, clearHistory }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};