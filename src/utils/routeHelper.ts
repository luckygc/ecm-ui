import type { Router } from "vue-router";
import { useRouteStore } from "@/stores/route";

/**
 * 初始化路由助手
 * 设置路由监听和页面管理
 */
export function initRouteHelper(router: Router) {
  const routeStore = useRouteStore();

  // 初始化固定页面
  routeStore.initAffixPages();

  // 路由前置守卫 - 确保路由变化被正确处理
  router.beforeEach((_to, _from, next) => {
    // 继续路由导航
    next();
  });

  // 路由后置守卫 - 在路由完成后更新store
  router.afterEach((to) => {
    // 设置当前路由（setCurrentRoute 内部会自动调用 addVisitedPage）
    routeStore.setCurrentRoute(to);
  });

  // 处理初始路由 - 确保应用启动时的路由被正确添加
  const currentRoute = router.currentRoute.value;
  if (currentRoute && currentRoute.name) {
    routeStore.setCurrentRoute(currentRoute);
  }
}

/**
 * 获取页面标题
 */
export function getPageTitle(route: any): string {
  return route.meta?.title || route.name || "未命名页面";
}

/**
 * 检查路由是否需要缓存
 */
export function shouldCache(route: any): boolean {
  return !route.meta?.noCache;
}

/**
 * 检查路由是否为固定页面
 */
export function isAffixRoute(route: any): boolean {
  return !!route.meta?.affix;
}
