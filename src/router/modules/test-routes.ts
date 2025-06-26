import type {RouteRecordRaw} from "vue-router";

export const testRoutes: Array<RouteRecordRaw> = [
    {
        path: "/test/formCreate",
        name: "TestFormCreate",
        component: () => import("@/views/test/TestFormCreate.vue"),
        meta: {
            title: "FormCreate",
            sidebar: true,
            keepAlive: true,
        },
    },
];
