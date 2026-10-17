import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const LOCAL_BACKEND_URL = "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, "./local-test-env"),
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(LOCAL_BACKEND_URL),
  },
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
