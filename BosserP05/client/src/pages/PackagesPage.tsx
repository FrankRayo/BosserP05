import React, { useEffect, useState } from "react";
import type { Package } from "../../../server/models/packageModel.ts"; // asegúrate de importar el tipo

export default function PackagesPage() {
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);

  useEffect(() => {
    // Recuperar paquetes desde localStorage
    const savedPackages = localStorage.getItem("pendingPackages");
    if (savedPackages) {
      setPendingPackages(JSON.parse(savedPackages));
    }
  }, []);

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
    </div>
  );
}
