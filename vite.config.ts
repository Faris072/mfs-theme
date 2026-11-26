import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Standard Vite config for running the Documentation & Demo Website
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const parsedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(',').map((h) => h.trim()).filter(Boolean)
    : []

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        'mfs-theme': resolve(__dirname, './src/lib/index.ts')
      }
    },
    preview: {
      allowedHosts: parsedHosts.length > 0 ? parsedHosts : ['localhost', '127.0.0.1']
    }
  }
})
