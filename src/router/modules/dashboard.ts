import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";

// 仪表盘路由模块
export const dashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Root",
    component: Layout,
    redirect: "/dashboard",
    meta: { title: "首页", icon: "HomeFilled", noPage: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "仪表盘", icon: "Odometer", affix: true },
      },
    ],
  },
];
