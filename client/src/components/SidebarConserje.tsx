// src/components/SidebarConserje.tsx
import React from "react";

type Props = {
  active: "registro" | "historial";
  onSelect: (section: "registro" | "historial") => void;
};

export default function SidebarConserje({ active, onSelect }: Props) {
  return (
    <div className="sidebar-conserje">
      <h5 className="fw-bold mb-4">Conserjería</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <span
            className={`nav-link ${active === "registro" ? "active sidebar-active" : "text-dark"}`}
            role="button"
            onClick={() => onSelect("registro")}
          >
            Registro de Paquetes
          </span>
        </li>
        <li className="nav-item">
          <span
            className={`nav-link ${active === "historial" ? "active sidebar-active" : "text-dark"}`}
            role="button"
            onClick={() => onSelect("historial")}
          >
            Historial de Paquetes
          </span>
        </li>
      </ul>
    </div>
  );
}
