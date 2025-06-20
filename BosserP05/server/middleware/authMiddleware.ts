import { verify } from "https://deno.land/x/djwt@v2.6/mod.ts";
import { RouterContext } from "../../deps.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "clave_super_secreta";
const keyBuf = new TextEncoder().encode(JWT_SECRET);
const jwtKey = await crypto.subtle.importKey(
  "raw",
  keyBuf,
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);

export const authMiddleware = async (
  ctx: RouterContext,
  next: () => Promise<unknown>
) => {
  console.log("🛡️ Entrando a authMiddleware...");

  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("🔒 Token no proporcionado o formato incorrecto");
    ctx.response.status = 401;
    ctx.response.body = { message: "Token no proporcionado o formato inválido." };
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, jwtKey, "HS256");

    if (!payload || typeof payload !== "object" || !payload.correo || !payload.tipo) {
      console.warn("❌ Token con estructura inválida:", payload);
      ctx.response.status = 401;
      ctx.response.body = { message: "Token inválido: estructura incompleta." };
      return;
    }

    const tipo = payload.tipo;
    const departamento = payload.departamento;

    if (
      tipo === "Residente" &&
      (!departamento || typeof departamento !== "string" || departamento.trim() === "")
    ) {
      console.warn("❌ Residente sin departamento:", payload);
      ctx.response.status = 401;
      ctx.response.body = { message: "Residente sin departamento válido." };
      return;
    }

    if (tipo !== "Residente" && tipo !== "Conserjeria" && tipo !== "Admin") {
      console.warn("❌ Tipo de usuario no permitido:", payload);
      ctx.response.status = 403;
      ctx.response.body = { message: "Tipo de usuario no autorizado." };
      return;
    }

    ctx.state.user = payload;
    console.log(`✅ Usuario autenticado: ${payload.correo} (${tipo})`);
    await next();
  } catch (err) {
    console.error("❌ Error verificando token:", err);
    ctx.response.status = 401;
    ctx.response.body = { message: "Token inválido o expirado." };
  }
};
