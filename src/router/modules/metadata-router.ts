import type {RouteRecordRaw} from "vue-router";

// 认证相关路由模块
export const metadataRoutes: Array<RouteRecordRaw> = [
    {
        path: "/metadata",
        name: "Metadata",
        component: () => import("@/pages/metadata/Metadata.vue"),
        meta: {
            title: "元数据管理",
            icon: "Setting",
            isSideBar: true,
            isKeepAlive: false,
        },
    },
];