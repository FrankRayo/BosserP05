import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const result = await res.json();

      if (res.ok && result.tipo) {
        localStorage.setItem("userType", result.tipo);
        localStorage.setItem("correo", result.correo);
        if (result.token) localStorage.setItem("token", result.token);
        if (result.departamento) localStorage.setItem("departamento", result.departamento);

        toast.success("¡Inicio de sesión exitoso!");

        setCorreo("");
        setPassword("");

        setTimeout(() => {
          if (result.tipo === "Admin") {
            navigate("/admin");
          } else if (result.tipo === "Residente") {
            navigate("/residente");
          } else if (result.tipo === "Conserjeria") {
            navigate("/conserjeria");
          } else {
            toast.error("Tipo de usuario no reconocido");
          }
        }, 1000);
      } else if (result.message) {
        toast.error(result.message);
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch (_error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{ backgroundColor: "#F4F4F4" }}
    >
      <div className="login-wrapper p-4">
        <h1 className="mb-4" style={{ color: "#990000" }}>
          Inicio de Sesión - Sistema de Encomiendas
        </h1>

        <div
          className="p-4 rounded shadow"
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#FFFFFF",
            margin: "0 auto"
          }}
        >
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label" style={{ color: "#A9A9A9" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ color: "#A9A9A9" }}>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "#DD3D33", color: "#000", fontWeight: "bold" }}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}
