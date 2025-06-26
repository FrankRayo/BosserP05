export interface Package {
  _id?: string;
  tracking_id: string;
  destinatario: string;
  departamento: string;
  tipo: string;
  estado: string;
  fecha_recepcion: string | Date;
  notificado?: boolean;
  codigo_entrega: string;
  ultima_notificacion?: string | Date;
  retirado_por?: string;
  fecha_retiro?: string | Date;
}