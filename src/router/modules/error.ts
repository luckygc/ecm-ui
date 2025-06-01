import type { RouteRecordRaw } from "vue-router";

// 错误页面路由模块
export const errorRoutes: Array<RouteRecordRaw> = [
  // 错误页面路由 - 隐藏在侧边栏中
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true, title: "页面未找到" },
  },
  // 通配符路由 - 处理未匹配的路径，重定向到404页面
  {
    path: "/:pathMatch(.*)*",
    name: "NotFoundRedirect",
    redirect: "/404",
    meta: { hidden: true },
  },
];
