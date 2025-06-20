import React, { useState, useEffect } from "react";
import SidebarConserje from "../components/SidebarConserje.tsx";
import NavbarConserje from "../components/NavbarConserje.tsx";
import { useIsMobile } from "../hooks/useIsMobile.ts";
import type { Package } from "../../../server/models/packageModel.ts";
import { toast } from "react-toastify";

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

  const [filtroDepartamento, setFiltroDepartamento] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Registrando paquete...");

    const res = await fetch("/api/paquetes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();

    if (res.ok) {
      toast.update(toastId, {
        render: result.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setForm({ tracking_id: "", destinatario: "", departamento: "", tipo: "Normal" });
    } else {
      toast.update(toastId, {
        render: "❌ Error: " + (result.message || "Registro fallido"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (section !== "historial") return;

    const controller = new AbortController();
    const signal = controller.signal;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión activa. Por favor, inicia sesión.");
      setPaquetes([]);
      return;
    }

    const toastId = toast.loading("Cargando historial...");
    setLoading(true);
    setError(null);

    fetch("/api/paquetes/all", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron obtener los paquetes.");
        return res.json() as Promise<Package[]>;
      })
      .then((data) => {
        setPaquetes(data);
        toast.update(toastId, {
          render: "✅ Historial cargado",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("🔄 Fetch cancelado por cambio de pestaña.");
          return;
        }
        setError(err.message || "Error al obtener paquetes.");
        setPaquetes([]);
        toast.update(toastId, {
          render: "❌ " + (err.message || "Error al obtener historial"),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [section]);

  const diasTranscurridos = (fechaRec: string) => {
    const fecha = new Date(fechaRec);
    const diffMs = Date.now() - fecha.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  const paquetesFiltrados = paquetes.filter((pkg) => {
    const coincideDepartamento = filtroDepartamento === "" || pkg.departamento.toLowerCase().includes(filtroDepartamento.toLowerCase());
    const coincideFecha = filtroFecha === "" || pkg.fecha_recepcion.startsWith(filtroFecha);
    return coincideDepartamento && coincideFecha;
  });

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
                <label htmlFor="tracking_id" className="form-label">Tracking ID</label>
                <input type="text" id="tracking_id" name="tracking_id" className="form-control" value={form.tracking_id} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="destinatario" className="form-label">Correo del destinatario</label>
                <input type="email" id="destinatario" name="destinatario" className="form-control" value={form.destinatario} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="departamento" className="form-label">Departamento</label>
                <input type="text" id="departamento" name="departamento" className="form-control" value={form.departamento} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="tipo" className="form-label">Tipo de paquete</label>
                <select id="tipo" name="tipo" className="form-select" value={form.tipo} onChange={handleChange}>
                  <option value="Normal">Normal</option>
                  <option value="Congelado">Congelado</option>
                  <option value="Frágil">Frágil</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <button type="submit" className="btn btn-success w-100">Registrar Paquete</button>
            </form>
          </>
        )}

        {section === "historial" && (
          <>
            <h2 className="mb-4">Historial de Paquetes</h2>
            <div className="row mb-3">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Buscar por departamento" value={filtroDepartamento} onChange={(e) => setFiltroDepartamento(e.target.value)} />
              </div>
              <div className="col-md-6">
                <input type="date" className="form-control" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
              </div>
            </div>

            {loading && <p>Cargando historial...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && paquetesFiltrados.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tracking ID</th>
                      <th>Tipo</th>
                      <th>Departamento</th>
                      <th>Estado</th>
                      <th>Fecha de Recepción</th>
                      <th>Días</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paquetesFiltrados.map((pkg) => {
                      const dias = diasTranscurridos(pkg.fecha_recepcion);
                      return (
                        <tr key={pkg._id}>
                          <td>{pkg.tracking_id}</td>
                          <td>{pkg.tipo}</td>
                          <td>{pkg.departamento}</td>
                          <td>{pkg.estado}</td>
                          <td>{new Date(pkg.fecha_recepcion).toLocaleString()}</td>
                          <td>{dias}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay paquetes registrados.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
