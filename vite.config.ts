// vite.config.ts
import { defineConfig } from "npm:vite";
import react from "npm:@vitejs/plugin-react";

export default defineConfig({
  root: "./client",
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Redirige todas las llamadas a /api/* a tu backend Deno
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
