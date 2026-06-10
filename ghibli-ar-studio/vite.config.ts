import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// MediaPipe ships large wasm; we load those from CDN at runtime (see visionEngine.ts)
// so the bundle stays lean. Vite only bundles the small JS glue.
export default defineConfig({
  plugins: [svelte()],
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 900
  },
  server: { host: "127.0.0.1" },
  preview: { host: "127.0.0.1" },
  optimizeDeps: {
    include: ["@mediapipe/tasks-vision"]
  }
});
