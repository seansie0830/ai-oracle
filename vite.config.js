import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
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
          // === VENDOR CHUNKS ===
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

          // === FEATURE CHUNKS ===
          // Tarot components and utilities (only loaded when needed)
          if (id.includes('/components/Tarot') || id.includes('/utils/tarot')) {
            return 'feature-tarot'
          }

          // LLM services
          if (id.includes('/services/llm/')) {
            return 'feature-llm'
          }

          // Pinia stores
          if (id.includes('/stores/')) {
            return 'feature-stores'
          }

          // Modal components
          if (id.includes('Modal.vue')) {
            return 'feature-modals'
          }
        }
      }
    }
  }
})
