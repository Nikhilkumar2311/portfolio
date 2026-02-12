import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sitemapPlugin } from './scripts/generate-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  server: {
    hmr: {
      overlay: false, // Disable error overlay
    },
  },
  logLevel: 'error', // Only show errors, not HMR updates
})
