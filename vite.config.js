import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // three.js lives in its own lazy-loaded chunk (~225 kB gzip), which is expected
    chunkSizeWarningLimit: 900,
  },
})
