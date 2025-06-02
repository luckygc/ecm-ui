import type { RouteRecordRaw } from "vue-router";
import { dashboard } from "./dashboard";
import { systemRoutes } from "./system";
import { nestedRoutes } from "./nested";
import { testRoutes } from "./test";
import { errorRoutes } from "./error";
import { authRoutes } from "./auth";

// 导出所有路由模块
export const routes: Array<RouteRecordRaw> = [
  ...authRoutes,
  ...dashboard,
  ...systemRoutes,
  ...nestedRoutes,
  ...testRoutes,
  ...errorRoutes,
];

// 按模块导出，方便按需引入
export {
  dashboard,
  systemRoutes,
  nestedRoutes,
  testRoutes,
  errorRoutes,
  authRoutes,
};
