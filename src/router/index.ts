import {createRouter, createWebHashHistory} from "vue-router";
import {routes} from "@/router/modules";

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
