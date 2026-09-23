import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Big libraries get their own long-cached chunks
const VENDOR_CHUNKS = {
  react: ["react", "react-dom", "react-router", "scheduler"],
  mui: ["@mui", "@emotion"],
  supabase: ["@supabase"],
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          for (const [chunk, packages] of Object.entries(VENDOR_CHUNKS)) {
            if (packages.some((pkg) => id.replaceAll("\\", "/").includes(`/node_modules/${pkg}/`))) {
              return chunk;
            }
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    env: {
      VITE_SUPABASE_URL: "http://localhost:54321",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
    },
  },
});
