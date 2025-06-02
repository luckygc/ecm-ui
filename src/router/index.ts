import {createRouter, createWebHashHistory} from "vue-router";
import {routes} from "./modules";
import {useUserStore} from "@/stores/user";
import {usePageStore} from "@/stores/route-store.ts";

export {routes} from "./modules";

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 路由守卫
router.beforeEach((to, _from, next) => {
    const userStore = useUserStore();

    // 恢复登录状态
    if (!userStore.isLoggedIn) {
        userStore.restoreLoginState();
    }

    // 如果访问登录页面且已登录，重定向到首页
    if (to.name === "Login" && userStore.isLoggedIn) {
        next("/");
        return;
    }

    // 如果访问需要登录的页面但未登录，重定向到登录页
    if (to.name !== "Login" && !userStore.isLoggedIn) {
        next("/login");
        return;
    }

    next();
});

router.afterEach((to) => {
    let routeStore = usePageStore();
    routeStore.handleRouteChange(to);
})

export default router;
