import type { RouteRecordRaw } from "vue-router";

// 认证相关路由模块
export const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/authorization/login/Login.vue"),
    meta: {
      title: "登录",
    },
  },
];
