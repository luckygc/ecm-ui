import {createRouter, createWebHashHistory} from "vue-router";
import {routes} from "./modules";
import {usePageStore} from "@/stores/modules/page-store.ts";

export {routes} from "./modules";

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 路由守卫
router.beforeEach((_to, _from, next) => {
    next();
});

router.afterEach((to, from) => {
    let routeStore = usePageStore();
    routeStore.afterRouteChange(to,from);
})

export default router;
