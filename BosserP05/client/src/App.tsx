import { BrowserRouter, Routes, Route } from "react-router-dom"; // Enrutador de React para navegación SPA
import React from "react";

import Login from "./pages/Login.tsx"; // Página de inicio de sesión
import PackagesPage from "./pages/PackagesPage.tsx"; // Página para ver paquetes (pública o protegida)
import AdminDashboard from "./pages/AdminDashboard.tsx"; // Panel de control del administrador
import ConserjeDashboard from "./pages/ConserjeDashboard.tsx"; // Panel de control del conserje
import ResidenteDashboard from "./pages/ResidenteDashboard.tsx"; // Panel de control del residente
import { ProtectedRoute } from "./routes/ProtectedRoute.tsx"; // Ruta protegida que verifica el tipo de usuario
import { ToastContainer } from "react-toastify"; // Contenedor de notificaciones tipo toast
import "react-toastify/dist/ReactToastify.css"; // Estilos de las notificaciones toast

export default function App() {
  return (
    <BrowserRouter> {/* Define que se usará routing basado en historial del navegador */}
      <div className="container-fluid"> {/* Contenedor con clases de Bootstrap */}
        <Routes> {/* Agrupa todas las rutas disponibles */}
          <Route path="/" element={<Login />} /> {/* Página raíz = login */}
          <Route path="/paquetes" element={<PackagesPage />} /> {/* Página pública para paquetes */}

          {/* 🔐 Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedType="Admin"> {/* Solo accesible por usuarios tipo Admin */}
                <AdminDashboard /> {/* Renderiza el panel de Admin */}
              </ProtectedRoute>
            }
          />

          {/* 🔐 Conserjería */}
          <Route
            path="/conserjeria"
            element={
              <ProtectedRoute allowedType="Conserjeria"> {/* Solo accesible por usuarios tipo Conserjería */}
                <div className="dashboard-wrapper"> {/* Envoltura adicional (por si hay estilo común) */}
                  <ConserjeDashboard /> {/* Renderiza el panel del Conserje */}
                </div>
              </ProtectedRoute>
            }
          />

          {/* 🔐 Residente */}
          <Route
            path="/residente"
            element={
              <ProtectedRoute allowedType="Residente"> {/* Solo accesible por usuarios tipo Residente */}
                <ResidenteDashboard /> {/* Renderiza el panel del Residente */}
              </ProtectedRoute>
            }
          />

          {/* 404 - Página no encontrada */}
          <Route path="*" element={<div>Página no encontrada</div>} /> {/* Ruta para páginas no definidas */}
        </Routes>

        {/* 🔔 Toasts globales */}
        <ToastContainer position="bottom-right" autoClose={3000} /> {/* Componente de notificaciones en esquina inferior derecha */}
      </div>
    </BrowserRouter>
  );
}
