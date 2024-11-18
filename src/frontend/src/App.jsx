import React from "react";
import PredictionPage from "./pages/PredictionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authentication";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-[#e1e1e1] w-screen h-screen overflow-hidden">
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <PredictionPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
