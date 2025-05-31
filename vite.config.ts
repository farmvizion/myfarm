import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/myfarm/',
  build: {
    manifest: true, // generates manifest.json for cache busting if needed
    chunkSizeWarningLimit: 1000, // in kB

  }
})
