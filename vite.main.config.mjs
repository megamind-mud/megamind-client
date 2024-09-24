import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    sourcemap: "inline",
    minify: false,
    rollupOptions: {
      output: {
        format: "cjs",
      },
    },
  },
});
