import React from "react";
import PredictionPage from "./pages/PredictionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/Authentication";
import { ProtectedRoute } from "./components/ProtectedRoute";
// import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import SettingsPage from "./pages/SettingPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import CreateMedicalRecord from "./components/Patient/CreateMedicalRecord";

function App() {
  const navigate = useNavigate();

  return (
    <AuthProvider>
      <div className="bg-[#e1e1e1] w-screen h-screen overflow-hidden">
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          {/* Dashboard route commented out
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          /> */}
          <Route
            path="prediction"
            element={
              <ProtectedRoute>
                <PredictionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients"
            element={
              <ProtectedRoute>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients/:id"
            element={
              <ProtectedRoute>
                <PatientDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients/:id/create-record"
            element={
              <ProtectedRoute>
                <PatientDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records/:id"
            element={
              <CreateMedicalRecord
                viewMode={true}
                onBack={() => navigate(-1)}
                onRecordCreated={() => {}}
              />
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
