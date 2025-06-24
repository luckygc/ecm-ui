import App from "@/App.vue";
import {router} from "@/router";
import pinia from "@/stores";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "@/assets/base.css";
import "normalize.css";
import "@/assets/element-plus.css";
import {createApp} from "vue";

const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus, {
    locale: zhCn,
});
app.use(pinia);
app.use(router);

app.mount("#app");
