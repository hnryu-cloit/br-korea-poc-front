import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const DEV_PORT = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: DEV_PORT,
    strictPort: true,
    hmr: {
      port: DEV_PORT,
    },
  },
});
