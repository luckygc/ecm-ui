import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {resolve} from "node:path";
import VueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag) => tag === 'cap-widget',
                    },
                },
            }),
            VueDevTools({
                launchEditor: 'webstorm',
            })
        ],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        // 将Vue相关库分离
                        'vue-vendor': ['vue', 'vue-router', 'pinia'],

                        // 将Element Plus分离
                        'element-plus': ['element-plus', '@element-plus/icons-vue'],

                        // 将表单设计器分离
                        'form-create': ['@form-create/designer', '@form-create/element-ui'],

                        // 将工具库分离
                        'utils': ['axios', '@vueuse/core', '@vueuse/integrations'],

                        // 将样式库分离
                        'styles': ['normalize.css'],
                    }
                }
            },
            // 调整chunk大小警告限制（可选）
            // chunkSizeWarningLimit: 1000
        }
    };
});
