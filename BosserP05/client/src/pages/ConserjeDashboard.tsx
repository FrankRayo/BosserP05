import React, { useState } from "react";
import SidebarConserje from "../components/SidebarConserje.tsx";
import NavbarConserje from "../components/NavbarConserje.tsx";
import { useIsMobile } from "../hooks/useIsMobile.ts";

export default function ConserjeDashboard() {
  const [section, setSection] = useState<"registro" | "historial">("registro");
  const isMobile = useIsMobile(769);

  const [form, setForm] = useState({
    tracking_id: "",
    destinatario: "",
    departamento: "",
    tipo: "Normal",
  });

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
      setForm({
        tracking_id: "",
        destinatario: "",
        departamento: "",
        tipo: "Normal",
      });
    } else {
      alert("❌ Error: " + (result.message || "Registro fallido"));
    }
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
            <p className="text-muted">Esta sección se implementará próximamente.</p>
          </>
        )}
      </div>
    </div>
  );
}
