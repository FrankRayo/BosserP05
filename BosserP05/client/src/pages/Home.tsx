import { useState } from "react";
import type { Package } from "../../../server/models/packageModel.ts";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [mode, setMode] = useState<"inicio" | "conserje" | "login_residente" | "residente_home">("inicio");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/verify_resident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (result.success) {
      setPendingPackages(result.packages);
      setMode("residente_home");
      setMessage(`Tienes ${result.packages.length} paquete(s) pendiente(s).`);
    } else {
      toast.error("Correo incorrecto o sin paquetes pendientes.", {
        position: "top-center",
        autoClose: 3000,
      });
      setMessage("");
    }
  };

  return (
    <div className="container py-4">
      <Sidebar onHomeClick={() => setMode("inicio")} />
      
      {/* Toast container para mostrar los toasts */}
      <ToastContainer />

      {/* Sección de selección de modo de ingreso */}
      {mode === "inicio" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Selecciona Modo de Ingreso</h1>
          <div className="d-flex justify-content-center gap-4">
            <button
              type="button"
              onClick={() => setMode("conserje")}
              className="btn btn-primary"
            >
              Modo Conserjería
            </button>
            <button
              type="button"
              onClick={() => setMode("login_residente")}
              className="btn btn-success"
            >
              Modo Residente
            </button>
          </div>
        </div>
      )}

      {/* Sección de ingreso para residente */}
      {mode === "login_residente" && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Ingreso de Residente</h2>
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="p-1">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="p-1">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Ingresar
            </button>
          </form>
          {/* Ya no mostramos el message aquí porque lo manejamos con toast */}
        </div>
      )}

      {/* Sección de conserje */}
      {mode === "conserje" && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Registrar nuevo paquete</h2>
          <form action="/api/paquetes" method="POST" className="space-y-3">
            <div className="p-1">
              <input
                name="tracking_id"
                placeholder="Tracking ID"
                required
                className="form-control"
              />
            </div>
            <div className="p-1">
              <input
                name="destinatario"
                placeholder="Correo del destinatario"
                required
                className="form-control"
              />
            </div>
            <div className="p-1">
              <input
                name="departamento"
                placeholder="Departamento"
                required
                className="form-control"
              />
            </div>
            <div className="p-1">
              <select name="tipo" className="form-select">
                <option value="Normal">Normal</option>
                <option value="Congelado">Congelado</option>
                <option value="Frágil">Frágil</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success w-100 mt-3">
              Registrar Paquete
            </button>
          </form>
        </div>
      )}

      {/* Sección de residente y resumen de paquetes */}
      {mode === "residente_home" && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Resumen de Paquetes Pendientes</h2>
          {message && <p className="mb-3">{message}</p>}
          {pendingPackages.length > 0 ? (
            <ul className="list-unstyled">
              {pendingPackages.map((pkg, i) => (
                <li key={i}>
                  <strong>{pkg.tracking_id}</strong> - Tipo: {pkg.tipo}, Departamento: {pkg.departamento}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes paquetes pendientes.</p>
          )}
        </div>
      )}
    </div>
  );
}
