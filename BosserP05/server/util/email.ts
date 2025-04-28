import nodemailer from "npm:nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tungtungsahurgpt@gmail.com",
    pass: "gqbcodsvpotjeecl", // 🔥 Nuevo App Password SIN espacios
  },
});

export async function enviarCorreo(destinatario: string) {
  await transporter.sendMail({
    from: "tungtungsahurgpt@gmail.com",
    to: destinatario,
    subject: "📦 ¡Tienes un paquete pendiente!",
    text: "Hola, tienes un paquete esperando en la conserjería. ¡Gracias!",
  });
}
