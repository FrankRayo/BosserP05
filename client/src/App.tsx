import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Login from "./pages/Login.tsx";
import PackagesPage from "./pages/PackagesPage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ConserjeDashboard from "./pages/ConserjeDashboard.tsx";
import ResidenteDashboard from "./pages/ResidenteDashboard.tsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/paquetes" element={<PackagesPage />} />

          {/* 🔐 Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedType="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Conserjería */}
          <Route
            path="/conserjeria"
            element={
              <ProtectedRoute allowedType="Conserjeria">
                <div className="dashboard-wrapper">
                  <ConserjeDashboard />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 🔐 Residente */}
          <Route
            path="/residente"
            element={
              <ProtectedRoute allowedType="Residente">
                <ResidenteDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 - Página no encontrada */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
