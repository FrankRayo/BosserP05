// Oak (servidor HTTP y router)
export { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
export type { RouterContext, Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// MongoDB (cliente y tipos)
export { MongoClient, Bson } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

// CORS middleware
export { oakCors } from "https://deno.land/x/cors@v1.2.1/mod.ts";

// bcrypt para encriptación de contraseñas
