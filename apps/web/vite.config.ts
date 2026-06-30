import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Load env from the monorepo root .env (one source of truth). Only VITE_*
  // vars are exposed to client code.
  envDir: new URL("../../", import.meta.url).pathname,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/trpc": "http://localhost:3000",
      "/api": "http://localhost:3000",
    },
  },
});
