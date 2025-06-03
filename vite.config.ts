import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {resolve} from "node:path";
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue(), vueDevTools()],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },
    };
});
