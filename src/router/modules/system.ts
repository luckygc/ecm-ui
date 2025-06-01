import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";

// 系统管理路由模块
export const systemRoutes: Array<RouteRecordRaw> = [
  {
    path: "/system",
    component: Layout,
    name: "System",
    meta: { title: "系统管理", icon: "Setting", noPage: true },
    children: [
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "用户管理", icon: "User" },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/index.vue"),
        meta: { title: "角色管理", icon: "UserFilled" },
      },
      {
        path: "page-manager",
        name: "PageManager",
        component: () => import("@/components/PageManager/index.vue"),
        meta: { title: "页面管理", icon: "Document" },
      },
      {
        path: "route-test",
        name: "RouteTest",
        component: () => import("@/views/test/route-test.vue"),
        meta: { title: "路由测试", icon: "Tools" },
      },
    ],
  },
];
