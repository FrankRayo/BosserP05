// client/src/pages/Home.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Package } from "../../../server/models/packageModel.ts";

export default function Home() {
  const [mode, setMode] = useState<"inicio" | "conserje" | "login_residente" | "residente_home" | "signup">("inicio");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [message, setMessage] = useState("");
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);

  const navigate = useNavigate(); // Usamos useNavigate para redirigir

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
      // Almacenar el token en el localStorage
      localStorage.setItem("authToken", result.token); // Guarda el token en localStorage
  
      setPendingPackages(result.packages); // Guardamos los paquetes pendientes
      navigate("/paquetes"); // Redirigimos a la página de paquetes después de un login exitoso
    } else {
      setMessage("Credenciales incorrectas.");
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

    if (result.message) {
      setMessage(result.message); // Mensaje de éxito
      setMode("login_residente"); // Cambiar a login después de registro
      navigate("/"); // Redirigir al login después de un registro exitoso
    } else {
      setMessage("Hubo un error al registrar.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {mode === "inicio" && (
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
          {message && <p className="mt-4 text-red-500">{message}</p>}

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

      {mode === "conserje" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Registrar nuevo paquete</h2>
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
              Registrar Paquete
            </button>
          </form>
        </div>
      )}

      {mode === "residente_home" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Resumen de Paquetes Pendientes</h2>
          {message && <p className="mb-2">{message}</p>}
          {pendingPackages.length > 0 ? (
            <ul className="list-disc list-inside">
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
