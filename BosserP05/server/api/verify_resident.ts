// server/api/verify_resident.ts
import { RouterContext } from "../../deps.ts";
import { MongoClient } from "../../deps.ts";
import { Resident } from "../models/residentModel.ts"; 
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

// Conexión a MongoDB
const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("gestion_paquetes");
const residents = db.collection<Resident>("residents"); // Colección de usuarios

export const handler = async (ctx: RouterContext<"/api/verify_resident">) => {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

  // Verificar si el residente existe
  const resident = await residents.findOne({ email });

  if (!resident) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Credenciales incorrectas." };
    return;
  }

  // Comparar las contraseñas (encriptadas)
  const passwordMatch = await bcrypt.compare(password, resident.password);

  if (!passwordMatch) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Credenciales incorrectas." };
    return;
  }

  // Si las credenciales son correctas, devolvemos un mensaje de éxito
  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    message: "Login exitoso.",
  };
};
