import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El proxy evita problemas de CORS: /productos se redirige al backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/productos": "http://localhost:3000",
      "/usuarios": "http://localhost:3000",
      "/mesas": "http://localhost:3000",
      "/reservas": "http://localhost:3000",
      "/pedidos": "http://localhost:3000"
    }
  }
});
