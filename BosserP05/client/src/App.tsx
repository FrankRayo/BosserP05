import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import PackagesPage from "./pages/PackagesPage.tsx"; // Importa la nueva página de paquetes
import React from "react";

export default function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paquetes" element={<PackagesPage />} /> {/* Ruta a la página de paquetes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
