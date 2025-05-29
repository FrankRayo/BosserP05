import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [tipoUsuario, setTipoUsuario] = useState<"Residente" | "Conserjeria" | "">("");

  // Campos comunes y específicos
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      tipo: tipoUsuario,
      correo,
      nombre,
      telefono,
      password, // 🔐 ahora siempre se envía
    };

    if (tipoUsuario === "Residente") {
      payload.departamento = departamento;
    }

    try {
      const res = await fetch("/api/admin/crear_usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("✅ Usuario creado exitosamente");
        setCorreo("");
        setNombre("");
        setTelefono("");
        setDepartamento("");
        setPassword("");
        setTipoUsuario("");
      } else {
        toast.error(result.message || "❌ Error al registrar usuario");
      }
    } catch (error) {
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Panel de Administración</h2>

      {tipoUsuario === "" && (
        <div className="text-center">
          <p>¿Qué tipo de usuario deseas registrar?</p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-success"
              onClick={() => setTipoUsuario("Residente")}
            >
              Registrar Residente
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setTipoUsuario("Conserjeria")}
            >
              Registrar Conserje
            </button>
          </div>
        </div>
      )}

      {tipoUsuario && (
        <>
          <h4 className="mt-4">Formulario para {tipoUsuario}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            {tipoUsuario === "Residente" && (
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Campo de contraseña para ambos */}
            <div className="mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3">
              Registrar {tipoUsuario}
            </button>

            <div className="text-center mt-3">
              <button
                className="btn btn-link"
                onClick={() => setTipoUsuario("")}
              >
                Volver
              </button>
            </div>
          </form>
        </>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
}
