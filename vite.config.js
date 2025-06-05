import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Base public path (for deployment)
  base: '/',
  css: {
    devSourcemap: true  // Enable CSS source maps in development
  },
  // Development server options
  server: {
    port: 3000,
    open: true,  // Automatically open browser
    strictPort: true, // Exit if port 3000 is in use
    host: true,  // Enable network access
    cors: true   // Enable CORS
  },

  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,  // Clean dist folder before build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')  // Entry point
      },
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',  // Hashed assets
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    minify: 'terser',  // Minify JS
    sourcemap: true    // Generate source maps
  },

  // Plugin options
  plugins: [],

  // Resolve aliases (optional)
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components')
    }
  },

  // CSS options (optional)
  css: {
    devSourcemap: true  // CSS source maps in development
  }
})