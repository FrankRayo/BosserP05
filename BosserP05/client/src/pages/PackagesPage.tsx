import React, { useEffect, useState } from "react";

export default function PackagesPage() {
  const [pendingPackages, setPendingPackages] = useState([]);

  useEffect(() => {
    // Simulando la obtención de paquetes pendientes del backend
    const fetchPackages = async () => {
      const res = await fetch("/api/verify_resident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com", password: "password" }), // Usa los datos correctos
      });

      const data = await res.json();
      if (data.success) {
        setPendingPackages(data.packages);
      }
    };

    fetchPackages();
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
