import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@helpers': fileURLToPath(new URL('./src/assets/styles/helpers', import.meta.url)),
      '@var': fileURLToPath(new URL('./src/assets/styles/helpers/var', import.meta.url)),
      '@function': fileURLToPath(
        new URL('./src/assets/styles/helpers/_function.scss', import.meta.url),
      ),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: '@use "@/assets/styles/helpers/index.scss" as *;',
      },
    },
    devSourcemap: true,
  },
})
