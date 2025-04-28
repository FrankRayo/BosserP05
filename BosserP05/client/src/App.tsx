import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import Home from "./pages/Home.tsx";
import PackagesPage from "./pages/PackagesPage.tsx"; // Importa la nueva página de paquetes
import React from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="ml-64 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paquetes" element={<PackagesPage />} /> {/* Ruta a la página de paquetes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
