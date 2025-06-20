// client/src/pages/ConserjeDashboard.tsx
import React, { useState, useEffect } from "react";
import SidebarConserje from "../components/SidebarConserje.tsx";
import NavbarConserje from "../components/NavbarConserje.tsx";
import { useIsMobile } from "../hooks/useIsMobile.ts";
import type { Package } from "../../../server/models/packageModel.ts";

export default function ConserjeDashboard() {
  const [section, setSection] = useState<"registro" | "historial">("registro");
  const isMobile = useIsMobile(769);

  const [form, setForm] = useState({
    tracking_id: "",
    destinatario: "",
    departamento: "",
    tipo: "Normal",
  });

  const [paquetes, setPaquetes] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/paquetes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    if (res.ok) {
      alert(result.message);
      setForm({ tracking_id: "", destinatario: "", departamento: "", tipo: "Normal" });
    } else {
      alert("❌ Error: " + (result.message || "Registro fallido"));
    }
  };

  useEffect(() => {
    if (section !== "historial") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión activa. Por favor, inicia sesión.");
      setPaquetes([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("/api/paquetes/all", {
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

  const diasTranscurridos = (fechaRec: string) => {
    const fecha = new Date(fechaRec);
    const diffMs = Date.now() - fecha.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="dashboard-wrapper conserje-dashboard-content">
      {isMobile ? (
        <NavbarConserje active={section} onSelect={setSection} />
      ) : (
        <SidebarConserje active={section} onSelect={setSection} />
      )}

      <div className="container py-4" style={{ flex: 1 }}>
        {section === "registro" && (
          <>
            <h2 className="mb-4">Registro de Paquetes</h2>
            <form onSubmit={handleSubmit} className="formulario-paquete">
              {/* ...form inputs... */}
            </form>
          </>
        )}

        {section === "historial" && (
          <>
            <h2 className="mb-4">Historial de Paquetes</h2>
            {loading && <p>Cargando historial...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              paquetes.length > 0 ? (
                <ul>
                  {paquetes.map((pkg) => {
                    const dias = diasTranscurridos(pkg.fecha_recepcion);
                    return (
                      <li key={pkg._id}>
                        <strong>{pkg.tracking_id}</strong> – Departamento: {pkg.departamento}, Tipo: {pkg.tipo}, Estado: {pkg.estado}
                        <span style={{ margin: "0 1rem" }}>•</span>
                        <em>{dias} {dias === 1 ? "día" : "días"}</em>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No hay paquetes registrados.</p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
