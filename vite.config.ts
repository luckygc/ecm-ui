import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
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
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({
        useSource: true,
      }),
      VueDevTools({
        launchEditor: 'cursor',
      }),
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `
            @use "~/styles/element/index.scss" as *;
          `,
        },
      },
    },
    build: {
      target: 'baseline-widely-available',
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
