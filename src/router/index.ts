import {createRouter, createWebHashHistory} from "vue-router";
import {routes} from "@/router/modules";
import {useStorage} from "@vueuse/core";
import {getConfig} from "@/utils/config-utils.ts";

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const token = useStorage(getConfig().tokenKey, null);

router.beforeEach(async (to, _, next) => {
    if (to.name === 'Login') {
        next();
        return;
    }

    if (!token.value) {
        next('/login');
        return;
    }

    next();
})
