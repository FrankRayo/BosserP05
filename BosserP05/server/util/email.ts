import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "conserjeriabosser@gmail.com",
    pass: Deno.env.get("GMAIL_PASS") || "gsfblkmvzmjsmevw", // App Password SIN espacios
  },
});

/**
 * Envía un correo al residente con departamento en el asunto,
 * y en el cuerpo el tipo de paquete, hora de llegada y tracking ID.
 *
 * @param destinatarioEmail Email del residente
 * @param departamento Departamento del residente
 * @param tipoPaquete Tipo de paquete (ej: "Urgente", "Carta", etc.)
 * @param fechaRecepcion Date en que llegó el paquete
 * @param trackingId Identificador de seguimiento del paquete
 */
export async function enviarCorreo(
  destinatarioEmail: string,
  departamento: string,
  tipoPaquete: string,
  fechaRecepcion: Date,
  trackingId: string
) {
  const fechaStr = fechaRecepcion.toLocaleString("en-US", {
  year:   "numeric",
  month:  "2-digit",
  day:    "2-digit",
  hour:   "numeric",
  minute: "2-digit", //Queda mas bonito asi
  hour12: true
});
  const subject = `📦 Paquete para dpto ${departamento}`;
  const text =
    `Hola,\n\n` +
    `Tu paquete de tipo "${tipoPaquete}" llegó el ${fechaStr}\n\n` +
    `Tracking ID: ${trackingId}\n\n` +
    `¡Gracias!`;

  await transporter.sendMail({
    from: "conserjeriabosser@gmail.com",
    to: destinatarioEmail,
    subject,
    text,
  });
}
