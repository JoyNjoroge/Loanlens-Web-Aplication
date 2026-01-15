import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),          // handles JSX + TSX
    tsconfigPaths(),  // handles TS path aliases if you use them
    tailwindcss(),    // your existing Tailwind plugin
  ],
  build: {
    outDir: 'dist',   // Netlify needs this as publish folder
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name]-[hash].js`,
        assetFileNames: `[name]-[hash][extname]`,
      },
    },
  },
  server: {
    port: 5173,       // optional, for local dev
  },
})
