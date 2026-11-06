import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The built site is written to the repo root (index.html + static/), so any host
// that serves the repo as-is (Render with publish path ".", GitHub Pages from main)
// shows the real site. base "./" keeps every URL relative, so it also works under
// a sub-path like jemsmainali.github.io/portfolioself/.
export default defineConfig({
  root: 'src',
  base: './',
  publicDir: '../public',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '..',
    emptyOutDir: false,
    assetsDir: 'static',
    // The lazy 3D chunk (three.js) is large by nature and loads after the text.
    chunkSizeWarningLimit: 1100,
  },
})
