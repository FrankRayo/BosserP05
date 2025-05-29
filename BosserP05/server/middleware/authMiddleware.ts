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

export const authMiddleware = async (ctx: RouterContext, next: () => Promise<unknown>) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Token no proporcionado o inválido." };
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, jwtKey, "HS256");

    if (!payload || typeof payload !== "object" || !payload.correo || !payload.departamento) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Token inválido: datos insuficientes." };
      return;
    }

    ctx.state.user = payload;
    await next();
  } catch (err) {
    console.error("Error en authMiddleware:", err);
    ctx.response.status = 401;
    ctx.response.body = { message: "Token inválido." };
  }
};