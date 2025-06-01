import type { RouteRecordRaw } from "vue-router";
import { dashboardRoutes } from "./dashboard";
import { systemRoutes } from "./system";
import { nestedRoutes } from "./nested";
import { errorRoutes } from "./error";

// 导出所有路由模块
export const allRoutes: Array<RouteRecordRaw> = [
  ...dashboardRoutes,
  ...systemRoutes,
  ...nestedRoutes,
  ...errorRoutes,
];

// 按模块导出，方便按需引入
export {
  dashboardRoutes,
  systemRoutes,
  nestedRoutes,
  errorRoutes,
};
