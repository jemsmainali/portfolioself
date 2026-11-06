import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The lazy 3D chunk (three.js) is large by nature and loads after the text.
  build: { chunkSizeWarningLimit: 1100 },
})
