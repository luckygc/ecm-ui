import Layout from "@/layout/Layout.vue";
import type {CustomRouterRecordRaw} from "@/types/router/router-types";

// 仪表盘路由模块
export const dashboardRoutes: Array<CustomRouterRecordRaw> = [
    {
        path: "/admin",
        name: "Admin",
        component: Layout,
        meta: {title: "管理", icon: "Odometer", sidebar: true},
        children: [
            {
                path: "dashboardRoutes",
                name: "Dashboard",
                component: () => import("@/views/dashboard/Dashboard.vue"),
                meta: {
                    title: "仪表盘",
                    icon: "Odometer",
                    sidebar: true,
                    keepAlive: false,
                },
            },
        ],
    },
];
