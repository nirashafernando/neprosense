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
import FrontPage from "./components/FrontPage";
import Dashboard from "./components/Dashboard";
import Donor from "./components/Donor";
import AddRecipient from "./components/Recipient";
import MakePrediction from "./components/MakePrediction";
import MatchingResults from "./components/MatchingResults";
import DetailedMatchInformation from "./components/DetailedMatchInformation";
import Reports from "./components/Reports";
import AdminProfile from "./components/AdminProfile";
import "./App.css";

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

            {/* Protected routes - All under /app */}
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

              {/* Clinician-only routes */}
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

            {/* Legacy redirects for backward compatibility */}
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
