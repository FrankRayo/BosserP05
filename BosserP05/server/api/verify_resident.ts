// server/api/verify_resident.ts
import { RouterContext } from "../../deps.ts";
import { MongoClient } from "../../deps.ts";
import { Resident } from "../models/residentModel.ts"; 
import { Package } from "../models/packageModel.ts"; // <--- también importa Package
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

// Conexión a MongoDB
const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("gestion_paquetes");
const residents = db.collection<Resident>("residents");
const packages = db.collection<Package>("packages"); // <--- también conecta a "packages"

export const handler = async (ctx: RouterContext<"/api/verify_resident">) => {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

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

  // Buscar los paquetes PENDIENTES asociados al departamento del residente
  const pendingPackages = await packages.find({
    departamento: resident.departamento,
    estado: "Pendiente",
  }).toArray(); // <-- conviértelo a array

  // Responder con éxito y los paquetes
  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    message: "Login exitoso.",
    departamento: resident.departamento,
    packages: pendingPackages, // <- devolvemos los paquetes aquí
  };
};
