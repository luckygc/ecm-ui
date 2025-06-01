import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import pinia from "@/stores";
import { initRouteHelper } from "@/utils/routeHelper";
import "normalize.css";
import "element-plus/dist/index.css";
import "@/assets/tailwind.css";

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

// 在应用挂载前初始化路由助手，确保路由监听能正确工作
initRouteHelper(router);

app.mount("#app");
