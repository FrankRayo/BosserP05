import { Bson } from "../../deps.ts";

export interface Usuario {
  _id?: Bson.ObjectId;
  correo: string;
  nombre: string;
  telefono: string;
  tipo: "Admin" | "Conserjeria" | "Residente";
  password: string; // obligatorio ahora para ambos
  departamento?: string; // solo para residentes
}
