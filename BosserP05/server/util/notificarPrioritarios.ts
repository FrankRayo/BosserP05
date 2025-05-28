<<<<<<< HEAD:BosserP05/server/util/notificarPrioritarios.ts
import db from "../config/db.ts";
import { obtenerPaquetesPrioritarios } from "./prioridadPaquetes.ts";
import { enviarCorreo } from "./email.ts";

/**
 * Revisa paquetes pendientes y envía recordatorios con detalles correctos.
 */
export async function notificarPrioritarios() {
  // 1. Obtener todos los paquetes
  const paquetes = await db.collection("paquetes").find({}).toArray();
  // 2. Filtrar los prioritarios (>=5 min sin notificar)
  const lista = obtenerPaquetesPrioritarios(paquetes);

  for (const pkg of lista) {
    // 3. Asegurar la fecha de recepción correcta
    const fechaRecepcion = pkg.fecha_recepcion instanceof Date
      ? pkg.fecha_recepcion
      : new Date(pkg.fecha_recepcion);

    // 4. Enviar correo con departamento, tipo, fecha y tracking ID
    await enviarCorreo(
      pkg.destinatario,
      pkg.departamento,
      pkg.tipo,
      fechaRecepcion,
      pkg.tracking_id
    );

    // 5. Marcar como notificado para no repetir
    await db.collection("paquetes").updateOne(
      { tracking_id: pkg.tracking_id },
      { $set: { notificado: true } }
    );
  }
}
=======
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
>>>>>>> b4f0bc6 (P05-47 Se implementa funcion que notifica de manera insistente paquetes de acuerdo a su prioridad y tiempo en recepsion):server/util/notificarPrioritarios.ts
