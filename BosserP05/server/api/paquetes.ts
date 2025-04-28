import { RouterContext } from "../../deps.ts";
import { MongoClient } from "../../deps.ts";
import { Package } from "../models/packageModel.ts";
import { enviarCorreo } from "../util/email.ts"; // Importamos la función de email

// Conexión a MongoDB
const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("gestion_paquetes");
const packages = db.collection<Package>("packages");

// Ruta para registrar un paquete (sin verificación de token)
export const handler = async (ctx: RouterContext<"/api/paquetes">) => {
  const body = await ctx.request.body({ type: "form"}).value;
 
  const tracking_id = body.get("tracking_id") ?? "";
  const destinatario = body.get("destinatario") ?? ""; // Valor predeterminado vacío
  const departamento = body.get("departamento") ?? "";
  const tipo = (body.get("tipo") as "Normal" | "Congelado" | "Frágil" | "Urgente") ?? "Normal";

  // Validación de campos obligatorios vacíos
  if (!tracking_id || !destinatario || !departamento || !tipo) {
    ctx.response.status = 400;
    ctx.response.body = { message: "❌ Todos los campos son obligatorios." };
    return;
  }

  const newPackage: Package = {
    tracking_id,
    destinatario,
    departamento,
    tipo,
    estado: "Pendiente",
    fecha_recepcion: new Date(),
    notificado: false,
  };

  const result = await packages.insertOne(newPackage);

  // Enviar correo después de guardar el paquete
  try {
    await enviarCorreo(destinatario);
    // Si el correo se envía correctamente, marcamos el paquete como notificado
    await packages.updateOne(
      { _id: result },
      { $set: { notificado: true } }
    );
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }

  ctx.response.status = 200;
  ctx.response.body = {
    message: `✅ Paquete recibido con ID: ${result}`,
  };
};
