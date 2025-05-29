// Oak (servidor HTTP y router)
export { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
export type { RouterContext, Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// MongoDB (cliente y tipos)
export { MongoClient, Bson } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

// CORS middleware
export { oakCors } from "https://deno.land/x/cors@v1.2.1/mod.ts";

// bcrypt para encriptación de contraseñas
export { compare, hash } from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

// JWT para autenticación
export { create, verify, getNumericDate } from "https://deno.land/x/djwt@v2.6/mod.ts";
export type { Payload } from "https://deno.land/x/djwt@v2.6/mod.ts";
