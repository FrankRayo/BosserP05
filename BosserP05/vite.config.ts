import { defineConfig } from "npm:vite";
import react from "npm:@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./client",
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
