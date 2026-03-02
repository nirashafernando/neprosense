import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import Dashboard from "./components/Dashboard";
import "./App.css";

import KidneyUltrasoundSystem from "./components/KidneyUltrasoundSystem";
import { AnalysisProvider } from "./components/AnalysisContext"; 

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main Layout */}
            <Route path="/" element={<FrontPage />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analysis" element={<KidneyUltrasoundSystem />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AnalysisProvider>
  );
}

export default App;