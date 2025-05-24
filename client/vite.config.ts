import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // This enables @/ to work
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
