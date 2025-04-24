import { Application, Router, oakCors } from "../deps.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { handler as verifyResident } from "./api/verify_resident.ts";
import { handler as registrarPaquete } from "./api/paquetes.ts";

const app = new Application();
const router = new Router();

// Rutas del backend
router.post("/api/verify_resident", verifyResident);
router.post("/api/paquetes", registrarPaquete);

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

console.log("Servidor en http://localhost:8000");
await app.listen({ port: 8000 });
