import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Production: App liegt unter /frontend-pickandlook/ auf GitHub Pages
// Development: App läuft auf localhost:5173/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'production' ? '/frontend-pickandlook/' : '/',
  server: {
    port: 5173
  }
}))
