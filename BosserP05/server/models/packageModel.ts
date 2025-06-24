import { Bson } from "../../deps.ts";

// Modelo de paquete para la base de datos
export interface Package {
  _id?: Bson.ObjectId;           // id interno de MongoDB
  tracking_id: string;           // identificador de seguimiento
  destinatario: string;          // nombre del destinatario
  departamento: string;          // número o identificador del departamento
  tipo: "Normal" | "Congelado" | "Frágil" | "Urgente"; // tipo de paquete
  estado: "Pendiente" | "Entregado"; // estado actual del paquete
  fecha_recepcion: Date;         // fecha en que se recibió el paquete
  notificado: boolean;           // si ya fue notificado al destinatario
  codigo_entrega: string;        // código para retirar el paquete
  ultima_notificacion?: Date;    // nuevo campo opcional
  retirado_por?: string;         // nombre de quien retira
  fecha_retiro?: Date;           // fecha de retiro
}
