import {createRouter, createWebHashHistory} from "vue-router";
import {routes} from "@/router/modules";
import {useStorage} from "@vueuse/core";
import {getConfig} from "@/utils/config-utils.ts";

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, _, next) => {
    const token = useStorage<string>(getConfig().tokenName, null);
    if (to.name === 'Login' && token.value) {
        next('/');
        return;
    }

    if (!token.value) {
        next('/login')
        return;
    }

    next();
})
