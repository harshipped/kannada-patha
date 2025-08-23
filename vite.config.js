import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configure headers for WASM files during development
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  optimizeDeps: {
    // Exclude sql.js from dependency optimization
    exclude: ['sql.js']
  },
  build: {
    // Ensure WASM files are copied correctly
    assetsInclude: ['**/*.wasm'],
    rollupOptions: {
      output: {
        // Handle large database files
        manualChunks: {
          sqljs: ['sql.js']
        }
      }
    }
  },
  // Configure asset handling
  assetsInclude: ['**/*.db', '**/*.wasm']
})