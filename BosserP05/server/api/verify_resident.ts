// server/api/verify_resident.ts
import { RouterContext } from "../../deps.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { residents, packages } from "../config/db.ts"; // <-- Usa la conexión centralizada

export const handler = async (ctx: RouterContext<"/api/verify_resident">) => {
  try {
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

    // Asignar un valor fijo de 1 para el userKey
    const userKey = "1"; // Fijamos el valor de la clave a "1"

    // Buscar los paquetes PENDIENTES asociados al departamento del residente
    const pendingPackages = await packages.find({
      departamento: resident.departamento,
      estado: "Pendiente",
    }).toArray();

    // Responder con éxito, la clave generada (userKey) y los paquetes
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      message: "Login exitoso.",
      userKey,
      departamento: resident.departamento,
      packages: pendingPackages,
    };
  } catch (error) {
    // Manejo de errores en el servidor
    console.error("Error en la verificación de residente:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno en el servidor." };
  }
};
