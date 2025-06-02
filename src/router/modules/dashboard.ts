import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";

// 仪表盘路由模块
export const dashboard: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Root",
    component: Layout,
    redirect: { name: "Dashboard" },
    meta: { title: "首页", icon: "HomeFilled" },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "仪表盘", icon: "Odometer", affix: true },
      },
      {
        path: "test/:id",
        name: "Test",
        component: () => import("@/views/dashboard/test.vue"),
        meta: { title: "测试页面", icon: "Document" },
      },
    ],
  },
];
