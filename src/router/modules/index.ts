import type {RouteRecordRaw} from "vue-router";
import {dashboardRoutes} from "./dashboard-routes.ts";
import {systemRoutes} from "./system-routes.ts";
import {nestedRoutes} from "./nested-routes.ts";
import {testRoutes} from "./test-routes.ts";
import {errorRoutes} from "./error-routes.ts";
import {authRoutes} from "./auth-routes.ts";
import Layout from "@/layout/Layout.vue";

// 导出所有路由模块
export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/Index.vue'),
                name: 'Index',
                meta: {title: '首页', icon: 'HomeFilled'}
            }
        ]
    },

    ...authRoutes,
    ...dashboardRoutes,
    ...systemRoutes,
    ...nestedRoutes,
    ...testRoutes,
    ...errorRoutes,
];

// 按模块导出，方便按需引入
export {
    dashboardRoutes,
    systemRoutes,
    nestedRoutes,
    testRoutes,
    errorRoutes,
    authRoutes,
};
