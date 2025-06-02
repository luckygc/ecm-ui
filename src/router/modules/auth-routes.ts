import type { RouteRecordRaw } from "vue-router";

// 认证相关路由模块
export const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue"),
    meta: {
      title: "登录",
      hidden: true, // 不在菜单中显示
    },
  },
];
