import type {RouteRecordRaw} from "vue-router";

export const testRoutes: Array<RouteRecordRaw> = [
    {
        path: "/test/formCreate",
        name: "TestFormCreate",
        component: () => import("@/views/test/TestFormCreate.vue"),
        meta: {
            icon: "Setting",
            title: "FormCreate",
            sidebar: true,
            keepAlive: true,
        },
    }, {
        path: "/test/formCreateDesigner",
        name: "TestFormCreateDesigner",
        component: () => import("@/views/test/TestFormCreateDesigner.vue"),
        meta: {
            icon: "Setting",
            title: "FormCreateDesigner",
            sidebar: true,
            keepAlive: true,
        },
    },
];
