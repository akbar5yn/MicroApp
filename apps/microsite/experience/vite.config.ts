import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isMfe = mode === "mfe";

  return {
    plugins: [react()],

    base: isMfe ? "http://localhost:4174/" : "/",

    server: {
      port: isMfe ? 4174 : 5174,
      strictPort: true,
      hmr: isMfe ? false : undefined,
    },

    build: isMfe
      ? {
        lib: {
          entry: "src/bootstrap.tsx",
          formats: ["es"],
          fileName: "experience",
        },

        rollupOptions: {
          external: [],

          output: {
            inlineDynamicImports: true,
          },
        },
      }
      : undefined,
  };
});