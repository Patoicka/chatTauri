import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Asegúrate de que `host` esté definida, con un valor predeterminado si no lo está.
const host = process.env.TAURI_DEV_HOST || 'localhost'; // Si no hay valor en `TAURI_DEV_HOST`, se usa 'localhost'.

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.cjs",
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: true, // Se asegura de que se permita el host
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      '/socket.io': {
        target: 'http://localhost:4000', // Asegúrate de que el puerto sea el correcto.
        changeOrigin: true,
        secure: false,
        ws: true,  // Habilita WebSockets
      },
    },

  },
});
