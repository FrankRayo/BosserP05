import { Bson } from "../../deps.ts";

// Modelo actualizado de Resident
export interface Resident {
  _id?: Bson.ObjectId;
  nombre: string;       // Nombre del residente
  departamento: string; // Número del departamento
  telefono: string;    // Número de teléfono del residente
  email: string;       // Correo electrónico del residente
  password: string;    // Contraseña encriptada
}
