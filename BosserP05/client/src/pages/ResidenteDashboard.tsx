import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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

  const [historial, setHistorial] = useState<Package[]>([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [historialError, setHistorialError] = useState<string | null>(null);
  const [historialPage, setHistorialPage] = useState(1);
  const [historialPages, setHistorialPages] = useState(1);

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

  useEffect(() => {
    if (section !== "historial") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setHistorialError("No hay sesión activa. Por favor, inicia sesión.");
      setHistorial([]);
      return;
    }

    setHistorialLoading(true);
    setHistorialError(null);

    fetch(`/api/paquetes/historial?page=${historialPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener el historial.");
        return res.json();
      })
      .then((data) => {
        setHistorial(data.historial);
        setHistorialPages(data.pages);
      })
      .catch((err) => {
        setHistorialError(err.message || "Error al obtener historial.");
        setHistorial([]);
      })
      .finally(() => setHistorialLoading(false));
  }, [section, historialPage]);

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
          <>
            <h2 className="mb-4">Historial de Paquetes</h2>
            {historialLoading && <p>Cargando historial...</p>}
            {historialError && <p className="text-danger">{historialError}</p>}
            {!historialLoading && !historialError && (
              historial.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Tracking ID</th>
                          <th>Tipo</th>
                          <th>Estado</th>
                          <th>Fecha de Recepción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historial.map((pkg) => (
                          <tr key={pkg._id}>
                            <td>{pkg.tracking_id}</td>
                            <td>{pkg.tipo}</td>
                            <td>{pkg.estado}</td>
                            <td>{new Date(pkg.fecha_recepcion).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-secondary"
                      disabled={historialPage === 1}
                      onClick={() => setHistorialPage((p) => p - 1)}
                    >
                      Anterior
                    </button>
                    <span>Página {historialPage} de {historialPages}</span>
                    <button
                      className="btn btn-secondary"
                      disabled={historialPage === historialPages}
                      onClick={() => setHistorialPage((p) => p + 1)}
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                <p>No hay historial de paquetes.</p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
