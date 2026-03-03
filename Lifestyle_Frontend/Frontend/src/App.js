import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import Dashboard from "./components/Dashboard";
import "./App.css";

import LifestyleSummary from "./components/LifestyleSummary";
import LifestyleTracker from "./components/LifestyleTracker";
import LifestyleInsights from "./components/LifestyleInsights";
import RiskPrediction from "./components/RiskPrediction";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FrontPage />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="lifestyle-data-summary"
              element={<LifestyleSummary />}
            />
            <Route path="lifestyle-tracker" element={<LifestyleTracker />} />
            <Route path="lifestyle-insights" element={<LifestyleInsights />} />
            <Route
              path="lifestyle-risk-prediction"
              element={<RiskPrediction />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
