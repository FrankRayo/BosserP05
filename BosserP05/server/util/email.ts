import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

/**
 * Envía un correo de notificación o recordatorio.
 */
export async function enviarCorreo(
  destinatarioEmail: string,
  departamento: string,
  tipoPaquete: string,
  fechaRecepcion: Date,
  trackingId: string,
  codigo_entrega: string, // <--- nombre igual que en paquetes.ts
  esRecordatorio = false // ✅ nuevo parámetro opcional
) {
  const fechaStr = fechaRecepcion.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const asunto = esRecordatorio
    ? `🔔 Recordatorio: Paquete aún pendiente en dpto ${departamento}`
    : `📦 Paquete para dpto ${departamento}`;

  const contenido = esRecordatorio
    ? `Hola,\n\nTe recordamos que aún tienes un paquete de tipo "${tipoPaquete}" recibido el ${fechaStr}.\n\n` +
      `Tracking ID: ${trackingId}\nCódigo de entrega: ${codigo_entrega}\n\nPor favor, acércate a retirarlo lo antes posible.`
    : `Hola,\n\nTu paquete de tipo "${tipoPaquete}" llegó el ${fechaStr}.\n\n` +
      `Tracking ID: ${trackingId}\nCódigo de entrega: ${codigo_entrega}\n\n¡Gracias!`;

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: "conserjeriabosser@gmail.com",
        password: "gsfblkmvzmjsmevw", // ⚠️ Reemplazar con variable de entorno en producción
      },
    },
    pool: false,
    debug: { log: false },
    client: { warning: "log" },
  });

  await client.send({
    from: "conserjeriabosser@gmail.com",
    to: destinatarioEmail,
    subject: asunto,
    content: contenido,
  });

  await client.close();

  console.log(`✅ Correo ${esRecordatorio ? "recordatorio" : "nuevo"} enviado a ${destinatarioEmail}`);
}
