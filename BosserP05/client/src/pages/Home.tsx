<<<<<<< Updated upstream
import { useState } from "react";
=======
// client/src/pages/Home.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> Stashed changes
import type { Package } from "../../../server/models/packageModel.ts";


export default function Home() {
  const [mode, setMode] = useState<"inicio" | "conserje" | "login_residente" | "residente_home">("inicio");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< Updated upstream
=======
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [departamento, setDepartamento] = useState("");
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      setMode("residente_home");
      setMessage(`Tienes ${result.packages.length} paquete(s) pendiente(s).`);
    } else {
      setMessage("Correo incorrecto o sin paquetes pendientes.");
=======
      localStorage.setItem("pendingPackages", JSON.stringify(result.packages));
      localStorage.setItem("departamento", result.departamento);
      localStorage.setItem("userKey", "1"); // Guarda el valor "1" como la clave
      notifySuccess("¡Login exitoso! 🎉");
      setPendingPackages(result.packages); // Guardamos los paquetes pendientes
      navigate("/paquetes"); // Redirigimos a la página de paquetes después de un login exitoso
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
      toast.error("Correo incorrecto.", {
        position: "top-center",
        autoClose: 3000,
      });
      setMessage("");
>>>>>>> Stashed changes
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="max-w-3xl mx-auto p-4">
      {mode === "inicio" && (
=======
    <div className="container py-4">
      <Sidebar onHomeClick={() => setMode("inicio")} />
      
      {/* Toast container para mostrar los toasts */}
      <ToastContainer aria-label="Notification container" />

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
          {message && <p className="mt-4 text-red-500">{message}</p>}

          {/* Botón para cambiar a la vista de Signup */}
          <div className="mt-4 text-center">
            <span>¿No tienes cuenta? </span>
            <button
              onClick={() => setMode("signup")}
              className="text-blue-600 hover:underline"
            >
              Regístrate aquí
            </button>
          </div>
        </div>
      )}

      {mode === "signup" && (
>>>>>>> Stashed changes
        <div>
          <h1 className="text-2xl font-bold mb-4">Selecciona Modo de Ingreso</h1>
          <button
            type="button"
            onClick={() => setMode("conserje")}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
          >
            Modo Conserjería
          </button>
          <button
            type="button"
            onClick={() => setMode("login_residente")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Modo Residente
          </button>
        </div>
      )}

      {mode === "login_residente" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Ingreso de Residente</h2>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">
              Ingresar
            </button>
          </form>
          {message && <p className="mt-4 text-red-500">{message}</p>}
<<<<<<< Updated upstream
        </div>
      )}

=======

          {/* Botón para cambiar a la vista de Login */}
          <div className="mt-4 text-center">
            <span>¿Ya tienes cuenta? </span>
            <button
              onClick={() => setMode("login_residente")}
              className="text-blue-600 hover:underline"
            >
              Inicia sesión aquí
            </button>
          </div>
        </div>
      )}

      {/* Sección de conserje */}
>>>>>>> Stashed changes
      {mode === "conserje" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Registrar nuevo paquete</h2>
<<<<<<< Updated upstream
          <form
            action="/api/paquetes"
            method="POST"
            className="space-y-4"
          >
            <input name="tracking_id" placeholder="Tracking ID" required className="w-full p-2 border rounded" />
            <input name="destinatario" placeholder="Correo del destinatario" required className="w-full p-2 border rounded" />
            <input name="departamento" placeholder="Departamento" required className="w-full p-2 border rounded" />
            <select name="tipo" className="w-full p-2 border rounded">
              <option value="Normal">Normal</option>
              <option value="Congelado">Congelado</option>
              <option value="Frágil">Frágil</option>
              <option value="Urgente">Urgente</option>
            </select>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
=======
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
>>>>>>> Stashed changes
              Registrar Paquete
            </button>
          </form>
        </div>
      )}

<<<<<<< Updated upstream
=======
      {/* Sección de residente y resumen de paquetes */}
>>>>>>> Stashed changes
      {mode === "residente_home" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Resumen de Paquetes Pendientes</h2>
<<<<<<< Updated upstream
          {message && <p className="mb-2">{message}</p>}
=======
          {message && <p className="mb-3">{message}</p>}
>>>>>>> Stashed changes
          {pendingPackages.length > 0 ? (
            <ul className="list-disc list-inside">
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
