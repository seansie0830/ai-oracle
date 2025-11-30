import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    ViteImageOptimizer({
       png: { quality: 80 },
       jpeg: { quality: 75 },
       svg: { multipass: true },
     })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // === VENDOR CHUNKS ONLY ===
          // Only split vendor libraries to avoid circular dependencies in app code
          if (id.includes('node_modules')) {
            // LangChain ecosystem (likely the largest dependency)
            if (id.includes('langchain') || id.includes('@langchain')) {
              return 'vendor-langchain'
            }

            // Vue ecosystem
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-vue'
            }

            // i18n library
            if (id.includes('vue-i18n')) {
              return 'vendor-i18n'
            }

            // Markdown rendering
            if (id.includes('marked')) {
              return 'vendor-markdown'
            }

            // Other vendor libraries
            return 'vendor-other'
          }

          // === NO FEATURE CHUNKS ===
          // Removed feature chunking to prevent circular dependencies.
          // App code (components, services, stores, utils) will be in the main chunk
          // to maintain proper initialization order.
        }
      }
    }
  }
})
