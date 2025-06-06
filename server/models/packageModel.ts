import { Bson } from "../../deps.ts";

export interface Package {
  _id?: Bson.ObjectId;
  tracking_id: string;
  destinatario: string;
  departamento: string;
  tipo: "Normal" | "Congelado" | "Frágil" | "Urgente";
  estado: "Pendiente" | "Entregado";
  fecha_recepcion: Date;
  notificado: boolean;  // Si ya se notificó al destinatario
}
