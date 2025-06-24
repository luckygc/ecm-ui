import {createRouter, createWebHashHistory} from "vue-router";
import {routes} from "@/router/modules";
import {usePageStore} from "@/stores/modules/page-store.ts";

export {routes} from "@/router/modules";

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((_to, _from, next) => {
    // TODO 检查登录状态
    next();
});

router.afterEach((to) => {
    usePageStore().afterRouteChange(to);
})
