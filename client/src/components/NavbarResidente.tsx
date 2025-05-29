import React from "react";

type Props = {
  active: "pendientes" | "historial";
  onSelect: (section: "pendientes" | "historial") => void;
};

export default function NavbarResidente({ active, onSelect }: Props) {
  return (
    <nav className="navbar-conserje d-flex justify-content-center align-items-center">
      <span
        className={active === "pendientes" ? "fw-bold active" : ""}
        role="button"
        onClick={() => onSelect("pendientes")}
      >
        Paquetes Pendientes
      </span>
      <span
        className={active === "historial" ? "fw-bold active" : ""}
        role="button"
        onClick={() => onSelect("historial")}
      >
        Historial de Paquetes
      </span>
    </nav>
  );
}