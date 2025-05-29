import React, { useEffect, useState } from "react";
import type { Package } from "../../../server/models/packageModel.ts"; // asegúrate de importar el tipo
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate

export default function PackagesPage() {
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  useEffect(() => {
    // Verificar si el userKey es 1, de lo contrario redirigir al usuario a la página principal
    const userKey = localStorage.getItem("userKey");
    if (userKey !== "1") {
      navigate("/"); // Redirigir al usuario a la página principal
    } else {
      // Recuperar paquetes desde localStorage
      const savedPackages = localStorage.getItem("pendingPackages");
      if (savedPackages) {
        setPendingPackages(JSON.parse(savedPackages));
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Establecer userKey a 0 en localStorage
    localStorage.setItem("userKey", "0");
    // Redirigir al usuario a la página principal
    navigate("/"); // Usar navigate para redirigir
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Paquetes Pendientes</h2>
      {pendingPackages.length > 0 ? (
        <ul>
          {pendingPackages.map((pkg, i) => (
            <li key={i}>
              <strong>{pkg.tracking_id}</strong> - Tipo: {pkg.tipo}, Departamento: {pkg.departamento}
            </li>
          ))}
        </ul>
      ) : (
        <p>Vacío</p>
      )}

      {/* Botón de Cerrar Sesión */}
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
