import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Supabase gets its own long-cached chunk. React and MUI stay together:
// splitting them apart creates a circular import that crashes at startup.
const VENDOR_CHUNKS = {
  supabase: ["@supabase"],
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // React + MUI in one entry chunk is ~520 kB (~165 kB gzipped); pages are lazy-loaded
    chunkSizeWarningLimit: 600,
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
