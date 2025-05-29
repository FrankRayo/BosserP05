import { Application, Router, oakCors } from "../deps.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { handler as verifyResident } from "./api/verify_resident.ts";
import { handler as registrarPaquete, getPaquetesResidente } from "./api/paquetes.ts";
import { handler as signupResident } from "./api/signup_resident.ts";
import { loginHandler } from "./api/login.ts";
import { crearUsuarioHandler } from "./api/admin/crear_usuario.ts"; // ✅ NUEVO
import { authMiddleware } from "./middleware/authMiddleware.ts";

const app = new Application();
const router = new Router();

// Rutas del backend
router.post("/api/verify_resident", verifyResident);
router.post("/api/login", loginHandler);
router.post("/api/paquetes", registrarPaquete);
router.post("/api/signup_resident", signupResident);
router.post("/api/admin/crear_usuario", crearUsuarioHandler); // ✅ NUEVO
router.get("/api/paquetes/residente", authMiddleware, getPaquetesResidente); // Nueva ruta GET

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(
  routeStaticFilesFrom([
    `${Deno.cwd()}/client/dist`,
    `${Deno.cwd()}/client/public`,
  ])
);

console.log("Servidor en http://localhost:8000");
await app.listen({ port: 8000 });
