import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import Component1Info from "./pages/Component1Info";
import Component2Info from "./pages/Component2Info";
import Component3Info from "./pages/Component3Info";
// Comment out Component4Info if it doesn't exist yet
// import Component4Info from "./pages/Component4Info";
import FrontPage from "./components/FrontPage";
import Dashboard from "./components/Dashboard";
import Donor from "./components/Donor";
import AddRecipient from "./components/Recipient";
import MakePrediction from "./components/MakePrediction";
import MatchingResults from "./components/MatchingResults";
import DetailedMatchInformation from "./components/DetailedMatchInformation";
import Reports from "./components/Reports";
import AdminProfile from "./components/AdminProfile";

// Import Lifestyle components - FIX THE TYPO: "Lifetyle" -> "Lifestyle"
import LifestyleFrontPage from "./components/Lifestyle/FrontPage";
import LifestyleDashboard from "./components/Lifestyle/Dashboard";
import LifestyleTracker from "./components/Lifestyle/LifestyleTracker";
import LifestyleInsights from "./components/Lifestyle/LifestyleInsights";
import LifestyleSummary from "./components/Lifestyle/LifestyleSummary";
import RiskPrediction from "./components/Lifestyle/RiskPrediction"; // Changed from LifeStyle to Lifestyle

import "./App.css";

import UrineTestAnalysis from "./components/Urine/UrineTestAnalysis";
import { AnalysisProvider } from "./components/Urine/AnalysisContext";
import UrineDashboard from "./components/Urine/Dashboard"; 
import UrineFrontpage from "./components/Urine/FrontPage";  


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Component Info Pages (Public) */}
            <Route path="/component-1" element={<Component1Info />} />
            <Route path="/component-2" element={<Component2Info />} />
            <Route path="/component-3" element={<Component3Info />} />
            {/* Comment out if Component4Info doesn't exist */}
            {/* <Route path="/component-4" element={<Component4Info />} /> */}

            {/* Protected routes - Donor Matching System */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <FrontPage />
                </ProtectedRoute>
              }
            >
              {/* Redirect /app to /app/dashboard */}
              <Route index element={<Navigate to="/app/dashboard" replace />} />

              {/* Main pages */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="matching-results" element={<MatchingResults />} />
              <Route path="reports" element={<Reports />} />
              <Route path="admin-profile" element={<AdminProfile />} />

              {/* Doctor-only routes */}
              <Route
                path="donor"
                element={
                  <ProtectedRoute clinicianOnly={true}>
                    <Donor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="recipient"
                element={
                  <ProtectedRoute clinicianOnly={true}>
                    <AddRecipient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="make-prediction"
                element={
                  <ProtectedRoute clinicianOnly={true}>
                    <MakePrediction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="detailedMatchInformation"
                element={<DetailedMatchInformation />}
              />
            </Route>

            {/* Protected Urine Routes */}
            <Route
              path="/urine"
              element={
                <ProtectedRoute>
                  <AnalysisProvider>
                    <UrineFrontpage />
                  </AnalysisProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<UrineDashboard />} />
              <Route path="urinedashboard" element={<UrineDashboard />} />
              <Route path="urineanalysis" element={<UrineTestAnalysis />} />
            </Route>

            {/* Legacy redirects for backward compatibility */}
            {/* Lifestyle Management Routes */}
            <Route
              path="/lifestyle"
              element={
                <ProtectedRoute>
                  <LifestyleFrontPage />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/lifestyle/dashboard" replace />} />
              <Route path="dashboard" element={<LifestyleDashboard />} />
              <Route path="tracker" element={<LifestyleTracker />} />
              <Route path="insights" element={<LifestyleInsights />} />
              <Route path="summary" element={<LifestyleSummary />} />
              <Route path="risk-prediction" element={<RiskPrediction />} />
            </Route>

            {/* Legacy redirects for Donor Matching */}
            <Route
              path="/dashboard"
              element={<Navigate to="/app/dashboard" replace />}
            />
            <Route
              path="/admin-profile"
              element={<Navigate to="/app/admin-profile" replace />}
            />
            <Route
              path="/make-prediction"
              element={<Navigate to="/app/make-prediction" replace />}
            />
            <Route
              path="/matching-results"
              element={<Navigate to="/app/matching-results" replace />}
            />
            <Route
              path="/reports"
              element={<Navigate to="/app/reports" replace />}
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;