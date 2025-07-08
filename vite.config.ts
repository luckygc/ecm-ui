import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.toLowerCase() === 'cap-widget',
          },
        },
      }),
      VueDevTools({
        launchEditor: 'webstorm',
      }),
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            'form-create-designer': ['@form-create/designer'],
            'form-create-element-ui': ['@form-create/element-ui'],
            'utils': ['axios', '@vueuse/core', '@vueuse/integrations'],
          },
        },
      },
    },
  }
})
