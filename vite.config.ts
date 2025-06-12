import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {resolve} from "node:path";
import VueDevTools from 'vite-plugin-vue-devtools';
import oxlintPlugin from 'vite-plugin-oxlint';

// https://vite.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            vue(),
            VueDevTools({
                launchEditor: 'webstorm',
            }),
            oxlintPlugin()
        ],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },
    };
});
