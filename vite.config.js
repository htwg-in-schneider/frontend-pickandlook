import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const repoName = '/frontend-pickandlook/'

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? repoName
    : '/',

  plugins: [
    vue(),
    vueDevTools()
  ]
})