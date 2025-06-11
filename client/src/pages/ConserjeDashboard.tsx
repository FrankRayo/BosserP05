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

  // Estado para los paquetes en historial
  const [paquetes, setPaquetes] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manejador de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Registro de un nuevo paquete
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

  // useEffect para cargar el historial cuando cambia la sección
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
              <div className="mb-3">
                <input
                  type="text"
                  name="tracking_id"
                  className="form-control"
                  placeholder="Tracking ID"
                  value={form.tracking_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="destinatario"
                  className="form-control"
                  placeholder="Correo del destinatario"
                  value={form.destinatario}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="departamento"
                  className="form-control"
                  placeholder="Departamento"
                  value={form.departamento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <select
                  name="tipo"
                  className="form-select"
                  value={form.tipo}
                  onChange={handleChange}
                >
                  <option value="Normal">Normal</option>
                  <option value="Congelado">Congelado</option>
                  <option value="Frágil">Frágil</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100">
                Registrar Paquete
              </button>
            </form>
          </>
        )}

        {section === "historial" && (
          <>
            <h2 className="mb-4">Historial de Paquetes</h2>

            {loading && <p>Cargando historial...</p>}
            {error   && <p className="text-danger">{error}</p>}

            {!loading && !error && (
              paquetes.length > 0 ? (
                <ul>
                  {paquetes.map((pkg) => (
                    <li key={pkg._id}>
                     <strong>{pkg.tracking_id}</strong> – Departamento: {pkg.departamento}, Tipo: {pkg.tipo}, Estado: {pkg.estado}
                    </li>
                  ))}
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
  