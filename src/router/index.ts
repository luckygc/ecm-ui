import {createRouter, createWebHashHistory} from "vue-router";
import {routes} from "@/router/modules";
import {usePageStore} from "@/store/modules/page-store.ts";

export {routes} from "@/router/modules";

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.afterEach((to) => {
    usePageStore().afterRouteChange(to);
});

