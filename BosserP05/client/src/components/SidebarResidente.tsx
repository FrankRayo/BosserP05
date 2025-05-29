import React from "react";

type Props = {
  active: "pendientes" | "historial";
  onSelect: (section: "pendientes" | "historial") => void;
};

export default function SidebarResidente({ active, onSelect }: Props) {
  return (
    <div className="sidebar-conserje">
      <h5 className="fw-bold mb-4">Residente</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <span
            className={`nav-link ${active === "pendientes" ? "active sidebar-active" : "text-dark"}`}
            role="button"
            onClick={() => onSelect("pendientes")}
          >
            Paquetes Pendientes
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
