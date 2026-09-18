import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  console.log('ABOUT VITE CONFIG LOADED:', mode)
  const isMfe = mode === 'mfe'

  return {
    plugins: [
      vue({
        customElement: true,
      })
    ],

    base: isMfe ? 'http://localhost:4173/' : '/',

    server: {
      port: isMfe ? 4173 : 5176,
      strictPort: true,

      hmr: isMfe ? false : undefined,
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(
        mode === 'production' || isMfe
          ? 'production'
          : 'development',
      ),

    },

    build: isMfe
      ? {
        lib: {
          entry: fileURLToPath(
            new URL('./src/bootstrap.ts', import.meta.url),
          ),
          formats: ['es'],
          fileName: 'home',
        },

        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          },
        },
      }
      : undefined,
  }
})