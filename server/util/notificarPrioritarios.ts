import { obtenerPaquetesPrioritarios } from "./prioridadPaquetes.ts";
import { enviarCorreo } from "./email.ts";
import type { Package } from "../models/packageModel.ts";

// Recibe todos los paquetes y notifica a los destinatarios prioritarios
export async function notificarPaquetesPrioritarios(paquetes: Package[]) {
  const prioritarios = obtenerPaquetesPrioritarios(paquetes);

  for (const pkg of prioritarios) {
    try {
      await enviarCorreo(pkg.destinatario);
      // Aquí podrías actualizar el campo notificado en la base de datos si lo deseas
      console.log(`Correo enviado a ${pkg.destinatario} por paquete ${pkg.tracking_id}`);
    } catch (err) {
      console.error(`Error enviando correo a ${pkg.destinatario}:`, err);
    }
  }
}