import { RouterContext } from "../../deps.ts";
import { hash } from "https://deno.land/x/bcrypt/mod.ts"; // Usamos bcrypt para encriptar la contraseña
import { Resident } from "../models/residentModel.ts"; // Modelo de residente
import { residents } from "../config/db.ts"; // <-- Usa la colección centralizada

export const handler = async (ctx: RouterContext<"/api/signup_resident">) => {
  const { nombre, telefono, email, password, departamento } = await ctx.request.body({ type: "json" }).value;

  // Validar que todos los campos estén presentes
  if (!nombre || !telefono || !email || !password || !departamento) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Todos los campos son obligatorios." };
    return;
  }

  // Encriptar la contraseña antes de guardarla
  const hashedPassword = await hash(password);

  // Crear el nuevo residente
  const newResident: Resident = {
    nombre,
    telefono,
    email,
    password: hashedPassword, // Guardamos la contraseña encriptada
    departamento,
  };

  // Insertar el residente en la base de datos
  const result = await residents.insertOne(newResident);

  // Responder con un mensaje de éxito o error
  if (result) {
    ctx.response.status = 201;
    ctx.response.body = { message: "Residente registrado exitosamente." };
  } else {
    ctx.response.status = 500;
    ctx.response.body = { message: "Hubo un error al registrar al residente." };
  }
};
