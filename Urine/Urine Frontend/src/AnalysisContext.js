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
    setAnalysisHistory((prev) => [data, ...prev]);
  };

  return (
    <AnalysisContext.Provider value={{ analysisHistory, addAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);