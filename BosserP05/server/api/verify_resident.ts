// server/api/verify_resident.ts
import { RouterContext } from "../../deps.ts";
import { MongoClient } from "../../deps.ts";
import { Resident } from "../models/residentModel.ts"; 
import { create } from "https://deno.land/x/djwt@v2.6/mod.ts"; // Importamos el generador de JWT
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

// Clave secreta para la firma del token (debe ser segura y guardarse en variables de entorno)
const JWT_SECRET = Deno.env.get("JWT_SECRET") || "clave_super_secreta"; // Guarda esta clave en una variable de entorno

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

  // Generar el token JWT
  const payload = { email: resident.email, departamento: resident.departamento };
  const token = await create({ alg: "HS256", typ: "JWT" }, payload, JWT_SECRET);

  // Devolver el token JWT al cliente
  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    message: "Login exitoso.",
    token, // Incluimos el token en la respuesta
  };
};
