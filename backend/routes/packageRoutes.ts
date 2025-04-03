import { Router } from "../deps.ts";
import { MongoClient } from "../deps.ts";
import { Package } from "../models/packageModel.ts";

// Conexión Mongo
const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("gestion_paquetes");
const packagesCollection = db.collection<Package>("packages");

const router = new Router();

// Ruta GET /formulario que genera HTML desde backend
router.get("/formulario", (ctx) => {
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = `
    <!DOCTYPE html>
    <html lang="es">
    <head><title>Formulario</title></head>
    <body>
      <h1>Recepcion de Paquete</h1>
      <form action="/paquetes" method="POST">
        <label>Tracking ID: <input type="text" name="tracking_id" required /></label><br />
        <label>Destinatario: <input type="text" name="destinatario" required /></label><br />
        <label>Departamento: <input type="text" name="departamento" required /></label><br />
        <label>Tipo:
          <select name="tipo">
            <option value="Normal">Normal</option>
            <option value="Congelado">Congelado</option>
            <option value="Frágil">Frágil</option>
            <option value="Urgente">Urgente</option>
          </select>
        </label><br />
        <button type="submit">Registrar Paquete</button>
      </form>
    </body>
    </html>
  `;
});

// Ruta POST /paquetes que recibe el formulario
router.post("/paquetes", async (ctx) => {
  const body = ctx.request.body({ type: "form" });
  const formData = await body.value;

  const newPackage: Package = {
    tracking_id: formData.get("tracking_id"),
    destinatario: formData.get("destinatario"),
    departamento: formData.get("departamento"),
    tipo: formData.get("tipo"),
    estado: "Pendiente",
    fecha_recepcion: new Date(),
    notificado: false,
  };

  const result = await packagesCollection.insertOne(newPackage);
  ctx.response.body = `✅ Paquete recibido con ID: ${result}`;
});

export default router;
