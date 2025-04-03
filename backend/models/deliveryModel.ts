import { Bson } from "../deps.ts"; 

export interface Delivery {
  _id?: Bson.ObjectId;
  paquete_id: string;
  retirado_por: string;
  metodo_verificacion: "QR" | "Código Único";
  fecha_retiro: Date;
}
