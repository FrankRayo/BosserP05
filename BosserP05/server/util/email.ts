import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

export async function enviarCorreo(
  destinatarioEmail: string,
  departamento: string,
  tipoPaquete: string,
  fechaRecepcion: Date,
  trackingId: string
) {
  const fechaStr = fechaRecepcion.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: "conserjeriabosser@gmail.com",
        password: "gsfblkmvzmjsmevw", // clave visible (SOLO PARA DENO, IMPLEMENTAR .ENV PARA PRODUCCIÓN!!!!!!!!)
      },
    },
    pool: false,
    debug: { log: false },
    client: { warning: "log" },
  });

  await client.send({
    from: "conserjeriabosser@gmail.com",
    to: destinatarioEmail,
    subject: `📦 Paquete para dpto ${departamento}`,
    content:
      `Hola,\n\nTu paquete de tipo "${tipoPaquete}" llegó el ${fechaStr}\n\n` +
      `Tracking ID: ${trackingId}\n\n¡Gracias!`,
  });

  await client.close();

  console.log(`✅ Correo enviado a ${destinatarioEmail}`);
}
