import { RouterContext } from "../../../deps.ts";
import { hash } from "https://deno.land/x/bcrypt/mod.ts";
import { Usuario } from "../../models/userModel.ts";
import { usuarios } from "../../config/db.ts"; // <-- Usa la colección centralizada

export const crearUsuarioHandler = async (ctx: RouterContext<"/api/admin/crear_usuario">) => {
  console.log("🟢 POST /api/admin/crear_usuario");

  const { correo, nombre, telefono, tipo, departamento, password } = await ctx.request.body({ type: "json" }).value;

  // Validación común
  if (!correo || !nombre || !telefono || !tipo || !password) {
    ctx.response.status = 400;
    ctx.response.body = { message: "❌ Faltan campos obligatorios." };
    return;
  }

  // Validar tipo permitido
  if (tipo !== "Residente" && tipo !== "Conserjeria") {
    ctx.response.status = 400;
    ctx.response.body = { message: "❌ Tipo de usuario no válido." };
    return;
  }

  // Validar que el correo no exista
  const existente = await usuarios.findOne({ correo });
  if (existente) {
    ctx.response.status = 409;
    ctx.response.body = { message: "⚠️ El correo ya está registrado." };
    return;
  }

  // Encriptar contraseña
  const hashedPassword = await hash(password);

  // Construir objeto de usuario
  const nuevoUsuario: Usuario = {
    correo,
    nombre,
    telefono,
    tipo,
    password: hashedPassword,
    ...(tipo === "Residente" ? { departamento } : {}),
  };

  await usuarios.insertOne(nuevoUsuario);

  console.log("✅ Usuario creado:", correo, tipo);
  ctx.response.status = 201;
  ctx.response.body = { message: "✅ Usuario creado exitosamente." };
};
