import React from "react";

type Props = {
  active: "registro" | "historial";
  onSelect: (section: "registro" | "historial") => void;
};

export default function NavbarConserje({ active, onSelect }: Props) {
  return (
    <nav className="navbar-conserje d-flex justify-content-between align-items-center p-2">
      <span
        className={active === "registro" ? "fw-bold text-danger" : ""}
        role="button"
        onClick={() => onSelect("registro")}
      >
        Registro
      </span>
      <span
        className={active === "historial" ? "fw-bold text-danger" : ""}
        role="button"
        onClick={() => onSelect("historial")}
      >
        Historial
      </span>
    </nav>
  );
}