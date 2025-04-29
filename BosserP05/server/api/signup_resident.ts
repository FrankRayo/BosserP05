// server/api/signup_resident.ts
import { RouterContext } from "../../deps.ts";
import { MongoClient } from "../../deps.ts";
import { Resident } from "../models/residentModel.ts"; 
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

// Conexión a MongoDB
const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("gestion_paquetes");
const residents = db.collection<Resident>("residents");

export const handler = async (ctx: RouterContext<"/api/signup_resident">) => {
  const { nombre, telefono, email, password, departamento } = await ctx.request.body({ type: "json" }).value;

  // Verificar si el email ya está registrado
  const existingResident = await residents.findOne({ email });
  if (existingResident) {
    ctx.response.status = 400;
    ctx.response.body = { message: "El correo electrónico ya está registrado." };
    return;
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password);

  // Crear el nuevo residente
  const newResident: Resident = {
    nombre,
    telefono,
    email,
    password: hashedPassword,
    departamento,
  };

  // Insertar el nuevo residente en la base de datos
  const result = await residents.insertOne(newResident);

  // Responder con el resultado
  if (result) {
    ctx.response.status = 201;
    ctx.response.body = { message: "Residente registrado exitosamente." };
  } else {
    ctx.response.status = 500;
    ctx.response.body = { message: "Hubo un error al registrar al residente." };
  }
};
