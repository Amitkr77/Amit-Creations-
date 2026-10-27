import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Also expose WEB3FORMS_* to client code; the Web3Forms access key is public by design
  envPrefix: ['VITE_', 'WEB3FORMS_'],
  build: {
    // three.js lives in its own lazy-loaded chunk (~225 kB gzip), which is expected
    chunkSizeWarningLimit: 900,
  },
})
