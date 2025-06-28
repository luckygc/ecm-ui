import App from "@/App.vue";
import {router} from "@/router";
import pinia from "@/store";
import FcDesigner from '@form-create/designer';
import formCreate from '@form-create/element-ui';
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "@/assets/css/base.css";
import "normalize.css";
import "@/assets/css/element-plus.css";

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
app.use(FcDesigner)
app.use(formCreate);

app.mount("#app");
