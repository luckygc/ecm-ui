import type {RouteRecordRaw} from "vue-router";
import {errorRoutes} from "./error-routes.ts";
import {authRoutes} from "./auth-routes.ts";
import {metadataRoutes} from "./metadata-router.ts";
import Layout from "@/layout/Layout.vue";
import {testRoutes} from "@/router/modules/test-routes.ts";

// 导出所有路由模块
export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Layout,
        name: 'Index',
        meta: {title: '首页'},
        children: [
            {
                path: '/workbench',
                component: () => import('@/views/Workbench.vue'),
                name: 'Workbench',
                meta: {title: '工作台', icon: 'HomeFilled', sidebar: true, keepAlive: true},
            },

            ...metadataRoutes,
            ...testRoutes
        ]
    },

    ...authRoutes,
    ...errorRoutes,
];
