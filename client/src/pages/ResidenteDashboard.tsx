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
    if (section !== "pendientes") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión activa. Por favor, inicia sesión.");
      setPaquetes([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("/api/paquetes/residente", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron obtener los paquetes.");
        return res.json();
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al actualizar paquete");
      alert("Paquete marcado como recibido");
      setPaquetes((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert("No se pudo marcar el paquete como recibido");
    }
  }

  return (
    <div className="dashboard-wrapper conserje-dashboard-content">
      {isMobile ? (
        <NavbarResidente active={section} onSelect={setSection} />
      ) : (
        <SidebarResidente active={section} onSelect={setSection} />
      )}

      <div className="container py-4" style={{ flex: 1 }}>
        {section === "pendientes" && (
          <>
            <h2 className="mb-4">Paquetes Pendientes</h2>
            {loading && <p>Cargando paquetes...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              paquetes.length > 0 ? (
                <ul>
                  {paquetes.map((pkg) => (
                    <li key={pkg._id}>
                      <strong>{pkg.tracking_id}</strong> - Departamento: {pkg.departamento}, Tipo: {pkg.tipo}
                      {pkg.estado === "Pendiente" && (
                        <button onClick={() => marcarRecibido(pkg._id)}>Indicar recibido</button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tienes paquetes pendientes.</p>
              )
            )}
          </>
        )}

        {section === "historial" && (
          <p className="text-muted">La sección de historial estará disponible próximamente.</p>
        )}
      </div>
    </div>
  );
}
  