// server/middleware/verifyToken.ts
import { verify } from "https://deno.land/x/djwt@v2.6/mod.ts"; // Librería para verificar el JWT
import { RouterContext } from "../../deps.ts";

// Clave secreta que usaste para firmar el JWT
const JWT_SECRET = Deno.env.get("JWT_SECRET") || "clave_super_secreta";

// Middleware para verificar el token JWT
export const verifyToken = async (ctx: RouterContext) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Token no proporcionado o inválido." };
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar el token
    const payload = await verify(token, JWT_SECRET, "HS256");
    
    // Agregar el payload al contexto para usarlo en otras rutas
    ctx.state.user = payload;  // Guardamos la información del usuario
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Token inválido." };
    return;
  }
};
