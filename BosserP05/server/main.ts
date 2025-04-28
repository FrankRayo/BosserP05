import { Application, Router, oakCors } from "../deps.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { handler as verifyResident } from "./api/verify_resident.ts";
import { handler as registrarPaquete } from "./api/paquetes.ts"; // Ruta de paquetes sin verificación de token
import { handler as signupResident } from "./api/signup_resident.ts"; 

const app = new Application();
const router = new Router();

// Rutas del backend
router.post("/api/verify_resident", verifyResident);  // Verificación del residente (requiere token)
router.post("/api/paquetes", registrarPaquete);  // Ruta para registrar paquetes (sin verificación de token)
router.post("/api/signup_resident", signupResident); 

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([`${Deno.cwd()}/client/dist`, `${Deno.cwd()}/client/public`]));

console.log("Servidor en http://localhost:8000");
await app.listen({ port: 8000 });
