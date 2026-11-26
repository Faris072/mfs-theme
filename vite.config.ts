import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Standard Vite config for running the Documentation & Demo Website
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'mfs-theme': resolve(__dirname, './src/lib/index.ts')
    }
  },
  preview: {
    allowedHosts: ['ui.mfstechnology.co.id']
  }
})
