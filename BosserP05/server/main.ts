import { Application, Router, oakCors } from "../deps.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";

// Controladores
import { handler as verifyResident } from "./api/verify_resident.ts"; // Verifica existencia de residente
import { handler as registrarPaquete, getPaquetesResidente, marcarPaqueteRecibido, notificarPaquetesPrioritarios, getHistorialResidente, getTodosLosPaquetes } from "./api/paquetes.ts"; // Funciones relacionadas a paquetes
import { handler as signupResident } from "./api/signup_resident.ts"; // Registro de nuevos residentes
import { loginHandler } from "./api/login.ts"; // Inicio de sesión
import { crearUsuarioHandler } from "./api/admin/crear_usuario.ts"; // Crear usuario por Admin
import { authMiddleware } from "./middleware/authMiddleware.ts"; // Middleware de autenticación

const app = new Application();
const router = new Router();

// ==== Rutas de autenticación ====
router.post("/api/login", loginHandler);                         // Iniciar sesión
router.post("/api/signup_resident", signupResident);             // Registrar un nuevo residente
router.post("/api/verify_resident", verifyResident);             // Verificar si un residente existe

// ==== Rutas de administración ====
router.post("/api/admin/crear_usuario", crearUsuarioHandler);    // Crear usuarios (admin)

// ==== Rutas de paquetes ====
router.post("/api/paquetes", registrarPaquete);                  // Registrar nuevo paquete (sin auth)
router.get("/api/paquetes/residente", authMiddleware, getPaquetesResidente); // Obtener paquetes pendientes de un residente
router.get("/api/paquetes/historial", authMiddleware, getHistorialResidente); // Obtener historial de paquetes de un residente
router.get("/api/paquetes/all", authMiddleware, getTodosLosPaquetes);         // Obtener todos los paquetes (vista conserjería)
router.put("/api/paquetes/:id/recibido", authMiddleware, marcarPaqueteRecibido); // Marcar paquete como recibido
router.get("/api/paquetes/notificar-prioritarios", notificarPaquetesPrioritarios); // Notificar por email paquetes prioritarios

// ==== Servir archivos estáticos (frontend) ====
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(
  routeStaticFilesFrom([
    `${Deno.cwd()}/client/dist`,     // Aplicación compilada
    `${Deno.cwd()}/client/public`,   // Recursos públicos (favicon, imágenes, etc.)
  ])
);

console.log("Servidor en http://localhost:8000");
await app.listen({ port: 8000 });
