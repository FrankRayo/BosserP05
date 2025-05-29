import { Context, Next } from "../../deps.ts";

// Devuelve middleware que intenta servir archivos estáticos desde múltiples rutas
export default function routeStaticFilesFrom(staticPaths: string[]) {
  return async (context: Context, next: Next) => {
    for (const path of staticPaths) {
      try {
        await context.send({ root: path, index: "index.html" });
        return;
      } catch {
        continue;
      }
    }
    await next();
  };
}
