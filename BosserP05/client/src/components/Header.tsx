import React from "react";

type HeaderProps = {
  onHomeClick: () => void;
};

export default function Header({ onHomeClick }: HeaderProps) {
  return (
<nav className="navbar navbar-expand-lg navbar-light bg-light px-4 rounded">

      <a className="navbar-brand fw-bold" href="#" onClick={(e) => { e.preventDefault(); onHomeClick(); }}>
        BosserP05
      </a>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button
              onClick={onHomeClick}
              className="btn btn-outline-primary"
            >
               Home
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
