import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Package } from "../../../server/models/packageModel.ts";
import Header from "../components/Header"; // importa tu Header (ajusta la ruta si es necesario)

export default function PackagesPage() {
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);
  const navigate = useNavigate(); // para navegar cuando se haga click en Home del Header

  useEffect(() => {
    const savedPackages = localStorage.getItem("pendingPackages");
    if (savedPackages) {
      setPendingPackages(JSON.parse(savedPackages));
    }
  }, []);

  return (
    <>
      <Header onHomeClick={() => navigate("/")} />

      <div className="container py-4 mt-4">
        <h2 className="text-center mb-4 fw-bold">📦 Paquetes Pendientes</h2>

        {pendingPackages.length > 0 ? (
          <div className="row justify-content-center">
            {pendingPackages.map((pkg, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{pkg.tracking_id}</h5>
                    <p className="card-text">
                      <strong>Tipo:</strong> {pkg.tipo}<br />
                      <strong>Departamento:</strong> {pkg.departamento}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No hay paquetes pendientes.</p>
        )}
      </div>
    </>
  );
}
