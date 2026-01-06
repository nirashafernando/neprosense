import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import Dashboard from "./components/Dashboard";
import "./App.css";

import UrineTestAnalysis from "./components/UrineTestAnalysis";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FrontPage />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analysis" element={<UrineTestAnalysis />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
