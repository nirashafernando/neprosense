import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import Dashboard from "./components/Dashboard";
import UrineTestAnalysis from "./components/UrineTestAnalysis";
import { AnalysisProvider } from "./AnalysisContext"; 

function App() {
  return (
    <AnalysisProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<FrontPage />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analysis" element={<UrineTestAnalysis />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AnalysisProvider>
  );
}

export default App;