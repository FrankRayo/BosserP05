// client/src/pages/Home.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Package } from "../../../server/models/packageModel.ts";
import Sidebar from "../components/Header.tsx";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header.tsx";

export default function Home() {
  const [mode, setMode] = useState<"inicio" | "conserje" | "login_residente" | "residente_home" | "signup">("inicio");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);

  const navigate = useNavigate();

  // Funciones de notificación
  const notifySuccess = (msg: string) => toast.success(msg, { position: "top-center", autoClose: 3000 });
  const notifyError = (msg: string) => toast.error(msg, { position: "top-center", autoClose: 3000 });

  // Función para login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/verify_resident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (result.success) {
      // Guardar el userKey con valor 1 en el localStorage
      localStorage.setItem("userKey", "1"); // Guarda el valor "1" como la clave

      setPendingPackages(result.packages);
      localStorage.setItem("pendingPackages", JSON.stringify(result.packages));
      localStorage.setItem("departamento", result.departamento);

      notifySuccess("¡Login exitoso! 🎉");
      navigate("/paquetes");
    } else {
      notifyError("Credenciales incorrectas ❌");
    }
  };

  // Función para signup (registro)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/signup_resident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, telefono, email, password, departamento }),
    });

    const result = await res.json();

    if (res.ok) {
      notifySuccess("¡Registro exitoso! Inicia sesión ahora.");
      setMode("login_residente");
      navigate("/");
    } else {
      notifyError("Error en el registro ❌");
    }
  };

  return (
    <div className="container py-4">
      <Header onHomeClick={() => setMode("inicio")} />

      <ToastContainer aria-label="Notification container" />

      {/* Sección de selección de modo de ingreso */}
      {mode === "inicio" && (
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold mb-4">Selecciona Modo de Ingreso</h1>
          <div className="d-flex justify-content-center gap-4">
            <button type="button" onClick={() => setMode("conserje")} className="btn btn-primary">
              Modo Conserjería
            </button>
            <button type="button" onClick={() => setMode("login_residente")} className="btn btn-success">
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
          <div className="mt-4 text-center">
            <span>¿No tienes cuenta? </span>
            <button onClick={() => setMode("signup")} className="text-blue-600 hover:underline">
              Regístrate aquí
            </button>
          </div>
        </div>
      )}

      {/* Sección de registro de residente */}
      {mode === "signup" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Registrar Residente</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Número de Departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-green-700 text-white py-2 rounded">
              Registrar
            </button>
          </form>
          <div className="mt-4 text-center">
            <span>¿Ya tienes cuenta? </span>
            <button onClick={() => setMode("login_residente")} className="text-blue-600 hover:underline">
              Inicia sesión aquí
            </button>
          </div>
        </div>
      )}

      {/* Sección de registro de paquetes (Conserje) */}
      {mode === "conserje" && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Registrar nuevo paquete</h2>
          <form action="/api/paquetes" method="POST" className="space-y-3">
            <div className="p-1">
              <input name="tracking_id" placeholder="Tracking ID" required className="form-control" />
            </div>
            <div className="p-1">
              <input name="destinatario" placeholder="Correo del destinatario" required className="form-control" />
            </div>
            <div className="p-1">
              <input name="departamento" placeholder="Departamento" required className="form-control" />
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

      {/* Sección de residente - resumen de paquetes */}
      {mode === "residente_home" && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Resumen de Paquetes Pendientes</h2>
          {pendingPackages.length > 0 ? (
            <ul className="list-unstyled">
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
      )}
    </div>
  );
}
