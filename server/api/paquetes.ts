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
  try {
    const { tracking_id, destinatario, departamento, tipo } =
      await ctx.request.body({ type: "json" }).value;

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

    try {
      await enviarCorreo(destinatario);
      await packages.updateOne({ _id: result }, { $set: { notificado: true } });
    } catch (error) {
      console.error("Error enviando el correo:", error);
    }

    ctx.response.status = 200;
    ctx.response.body = {
      message: `✅ Paquete recibido con ID: ${result}`,
    };
  } catch (err) {
    console.error("Error en handler /api/paquetes:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error en el registro del paquete" };
  }
};

export const getPaquetesResidente = async (ctx: RouterContext<"/api/paquetes/residente">) => {
  try {
    const user = ctx.state.user;
    let correo = user?.correo;
    let departamento = user?.departamento;

    if (!correo || !departamento) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Correo y departamento requeridos" };
      return;
    }

    // Normaliza los datos
    correo = correo.trim().toLowerCase();
    departamento = departamento.trim().toLowerCase();

    // Busca paquetes pendientes para ese residente y departamento
    const paquetes = await packages.find({
      destinatario: correo,
      departamento,
      estado: "Pendiente",
    }).limit(50).toArray(); // Limita a 50 resultados

    ctx.response.status = 200;
    ctx.response.body = paquetes;
  } catch (err) {
    console.error("Error en getPaquetesResidente:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error al buscar paquetes" };
  }
};