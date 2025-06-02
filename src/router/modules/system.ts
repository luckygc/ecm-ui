import Layout from "@/layout/Layout.vue";
import type { RouteRecordRaw } from "vue-router";

// 系统管理路由模块
export const systemRoutes: Array<RouteRecordRaw> = [
  {
    path: "/system",
    component: Layout,
    name: "System",
    meta: { title: "系统管理", icon: "Setting", sideBar: true },
    children: [
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/UserManagement.vue"),
        meta: { title: "用户管理", icon: "User", sideBar: true },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/RoleManagement.vue"),
        meta: { title: "角色管理", icon: "UserFilled", sideBar: true },
      },
    ],
  },
];
