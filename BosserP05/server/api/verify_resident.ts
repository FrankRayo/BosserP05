import { RouterContext, MongoClient } from "../../deps.ts";
import { Package } from "../models/packageModel.ts";

// Conexión a MongoDB
const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("gestion_paquetes");
const packages = db.collection<Package>("packages");

export const handler = async (ctx: RouterContext<"/api/verify_resident">) => {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

  // 🔒 NOTA: Esto no verifica password real, solo se asegura que haya paquetes pendientes
  const results = await packages.find({ destinatario: email, estado: "Pendiente" }).toArray();

  ctx.response.status = 200;
  ctx.response.body = results.length > 0
    ? { success: true, packages: results }
    : { success: false };
};
