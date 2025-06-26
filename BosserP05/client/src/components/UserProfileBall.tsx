// src/components/UserProfileBall.tsx
import React, { useState } from "react";
import type { Package } from "../types/package.ts";

type Props = {
  tipo: "conserje" | "residente";
  nombre: string;
  departamento?: string;
  onLogout: () => void;
  notificaciones?: Package[]; // nuevo prop opcional
};

export default function UserProfileBall({ tipo, nombre, departamento, onLogout, notificaciones }: Props) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);
  const handleLogout = () => {
    setOpen(false);
    // Eliminar token de sesión y datos de usuario
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("correo");
    localStorage.removeItem("userType");
    onLogout();
    // Redirigir a la raíz absoluta
    globalThis.location.href = "http://localhost:3000/";
  };

  const displayText = tipo === "conserje" ? nombre[0].toUpperCase() : departamento;

  return (
    <div className="user-profile-container">
      {open && (
        <div className="user-menu">
          <p className="user-name">{nombre}</p>
          {tipo === "residente" && (
            <>
              <p className="user-noti">
                🔔 Tienes {notificaciones?.length ?? 0} notificaciones
              </p>
              {notificaciones && notificaciones.length > 0 && (
                <ul style={{ fontSize: "0.85rem", paddingLeft: "1rem" }}>
                  {notificaciones.map((pkg) => (
                    <li key={pkg._id}>
                      📦 {pkg.tipo} – depto {pkg.departamento}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          <button className="logout-btn" type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}

      <div className="profile-ball" onClick={handleToggle}>
        {displayText}
        {notificaciones && notificaciones.length > 0 && (
          <span className="notification-dot">❗</span>
        )}
      </div>
    </div>
  );
}
