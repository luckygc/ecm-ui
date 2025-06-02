import Layout from "@/layout/Layout.vue";
import type { CustomRouterRecordRaw } from "@/types/router/router-types";

// 仪表盘路由模块
export const dashboard: Array<CustomRouterRecordRaw> = [
  {
    path: "/",
    name: "Root",
    component: Layout,
    redirect: { name: "Dashboard" },
    meta: { title: "首页", icon: "HomeFilled", menu: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/Dashboard.vue"),
        meta: { title: "仪表盘", icon: "Odometer", menu: true },
      },
      {
        path: "test/:id",
        name: "Test",
        component: () => import("@/views/dashboard/test.vue"),
        meta: { title: "测试页面", icon: "Document", menu: true },
      },
    ],
  },
];
