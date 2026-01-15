import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "./",   // THIS fixes relative paths for nested deploys
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name]-[hash].js`,
        assetFileNames: `[name]-[hash][extname]`,
      },
    },
  },
})
