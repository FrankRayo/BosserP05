// client/src/pages/ResidenteDashboard.tsx
import React, { useState, useEffect } from "react";
import SidebarResidente from "../components/SidebarResidente.tsx";
import NavbarResidente from "../components/NavbarResidente.tsx";
import { useIsMobile } from "../hooks/useIsMobile.ts";
import type { Package } from "../../../server/models/packageModel.ts";

export default function ResidenteDashboard() {
  const [section, setSection] = useState<"pendientes" | "historial">("pendientes");
  const isMobile = useIsMobile(769);

  const [paquetes, setPaquetes] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión activa. Por favor, inicia sesión.");
      setPaquetes([]);
      return;
    }

    setLoading(true);
    setError(null);

    const url =
      section === "pendientes"
        ? "/api/paquetes/residente"
        : "/api/paquetes/residente?all=true";

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron obtener los paquetes.");
        return res.json() as Promise<Package[]>;
      })
      .then((data) => setPaquetes(data))
      .catch((err) => {
        setError(err.message || "Error al obtener paquetes.");
        setPaquetes([]);
      })
      .finally(() => setLoading(false));
  }, [section]);

  async function marcarRecibido(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay sesión activa. Por favor, inicia sesión.");
      return;
    }
    try {
      const res = await fetch(`/api/paquetes/${id}/recibido`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error actualizando paquete");
      alert("Paquete marcado como recibido");
      setPaquetes((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("No se pudo marcar como recibido");
    }
  }

  // Sólo los pendientes para la sección Pendientes
  const pendientes = paquetes.filter((p) => p.estado === "Pendiente");
  // Para Historial, todos los paquetes
  const paquetesHistorial = paquetes; 

  return (
    <div className="dashboard-wrapper conserje-dashboard-content">
      {isMobile ? (
        <NavbarResidente active={section} onSelect={setSection} />
      ) : (
        <SidebarResidente active={section} onSelect={setSection} />
      )}

      <div className="container py-4" style={{ flex: 1 }}>
        {section === "pendientes" ? (
          <>
            <h2 className="mb-4">Paquetes Pendientes</h2>
            {loading && <p>Cargando paquetes...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              pendientes.length > 0 ? (
                <ul>
                  {pendientes.map((pkg) => (
                    <li key={pkg._id}>
                      <strong>{pkg.tracking_id}</strong> – Departamento: {pkg.departamento}, Tipo: {pkg.tipo}
                      <button
                        onClick={() => marcarRecibido(pkg._id)}
                        style={{ marginLeft: "1rem" }}
                      >
                        Indicar recibido
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tienes paquetes pendientes.</p>
              )
            )}
          </>
        ) : (
          <>
            <h2 className="mb-4">Historial de Paquetes</h2>
            {loading && <p>Cargando historial...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              paquetesHistorial.length > 0 ? (
                <ul>
                  {paquetesHistorial.map((pkg) => (
                    <li key={pkg._id}>
                      <strong>{pkg.tracking_id}</strong> – Departamento: {pkg.departamento}, Tipo: {pkg.tipo}, Estado: {pkg.estado}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tienes historial de paquetes.</p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
