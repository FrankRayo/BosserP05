<<<<<<< Updated upstream
import { RouterContext, MongoClient } from "../../deps.ts";
import { Package } from "../models/packageModel.ts";
=======
// server/api/verify_resident.ts
import { RouterContext } from "../../deps.ts";
import { MongoClient } from "../../deps.ts";
import { Resident } from "../models/residentModel.ts"; 
import { Package } from "../models/packageModel.ts"; // <--- también importa Package
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.6/mod.ts"; // Importamos el generador de JWT
>>>>>>> Stashed changes

// Conexión a MongoDB
const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("gestion_paquetes");
const packages = db.collection<Package>("packages");

export const handler = async (ctx: RouterContext<"/api/verify_resident">) => {
  try {
    const { email, password } = await ctx.request.body({ type: "json" }).value;

<<<<<<< Updated upstream
  // 🔒 NOTA: Esto no verifica password real, solo se asegura que haya paquetes pendientes
  const results = await packages.find({ destinatario: email, estado: "Pendiente" }).toArray();

  ctx.response.status = 200;
  ctx.response.body = results.length > 0
    ? { success: true, packages: results }
    : { success: false };
=======
    // Buscar al residente
    const resident = await residents.findOne({ email });

    if (!resident) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Credenciales incorrectas." };
      return;
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, resident.password);

    if (!passwordMatch) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Credenciales incorrectas." };
      return;
    }

    // Asignar una clave fija para el usuario (userKey)
    const userKey = "1"; // Valor fijo para la clave

    // Buscar los paquetes PENDIENTES asociados al departamento del residente
    const pendingPackages = await packages.find({
      departamento: resident.departamento,
      estado: "Pendiente",
    }).toArray(); // <-- conviértelo a array

    // Responder con éxito, el valor fijo para userKey y los paquetes
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      message: "Login exitoso.",
      userKey, // Devolvemos la clave fija aquí
      departamento: resident.departamento,
      packages: pendingPackages, // <- devolvemos los paquetes aquí
    };
  } catch (error) {
    // Manejo de errores en el servidor
    console.error("Error en la verificación de residente:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno en el servidor." };
  }
>>>>>>> Stashed changes
};
