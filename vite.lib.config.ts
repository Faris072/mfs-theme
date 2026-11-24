import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// Vite Library mode build config for npm publishing
export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'MfsTheme',
      fileName: (format) => `mfs-theme.${format === 'es' ? 'js' : 'umd.cjs'}`,
      cssFileName: 'mfs-theme'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    }
  }
})
