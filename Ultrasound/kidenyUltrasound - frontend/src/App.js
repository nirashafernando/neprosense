import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import Dashboard from "./components/Dashboard";
import "./App.css";

import KidneyUltrasoundSystem from "./components/KidneyUltrasoundSystem";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FrontPage />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analysis" element={<KidneyUltrasoundSystem />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
