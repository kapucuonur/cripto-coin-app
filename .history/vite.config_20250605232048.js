// vite.config.js 
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  css: { // Only keep one css configuration block
    devSourcemap: true
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    host: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    minify: 'terser',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components')
    }
  }
})