import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedType: string;
};

export function ProtectedRoute({ children, allowedType }: ProtectedRouteProps) {
  const tipo = localStorage.getItem("userType");

  return tipo === allowedType ? <>{children}</> : <Navigate to="/" />;
}
