import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "conserjeriabosser@gmail.com",
    pass: "gsfblkmvzmjsmevw", //  App Password SIN espacios
  },
});

export async function enviarCorreo(destinatario: string) {
  await transporter.sendMail({
    from: "conserjeriabosser@gmail.com",
    to: destinatario,
    subject: "📦 ¡Tienes un paquete pendiente!",
    text: "Hola, tienes un paquete esperando en la conserjería. ¡Gracias!",
  });
}
