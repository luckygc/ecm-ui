import type { Router, RouteRecordRaw } from "vue-router";
import { useRouteStore } from "@/stores/route-store";

// 路由元信息接口
export interface RouteMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
  affix?: boolean;
  noCache?: boolean;
  noPage?: boolean;
  [key: string]: any;
}

// 路由信息接口
export interface RouteInfo {
  path: string;
  name?: string;
  title: string;
  icon?: string;
  component?: any;
  children?: RouteInfo[];
  meta?: RouteMeta;
  hidden?: boolean;
  affix?: boolean;
  noCache?: boolean;
  noPage?: boolean;
}

/**
 * 构建完整路径
 * @param routePath 路由路径
 * @param parentPath 父级路径
 * @returns 完整路径
 */
export function buildFullPath(routePath: string, parentPath = ""): string {
  if (routePath.startsWith("/")) {
    return routePath;
  }
  return `${parentPath}/${routePath}`.replace(/\/+/g, "/");
}

/**
 * 根据组件名称构建完整路径
 * @param componentName 组件名称
 * @param parentPath 父级路径
 * @returns 完整路径
 */
export function buildFullPathByComponentName(
  componentName: string,
  parentPath = ""
): string {
  // 将组件名称转换为路径格式（驼峰转短横线）
  const routePath = componentName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
  return buildFullPath(`/${routePath}`, parentPath);
}

/**
 * 创建路由信息对象
 * @param route 路由记录
 * @param fullPath 完整路径
 * @returns 路由信息
 */
export function createRouteInfo(
  route: RouteRecordRaw,
  fullPath: string
): RouteInfo {
  const meta = route.meta as RouteMeta;
  return {
    path: fullPath,
    name: route.name as string,
    title: meta?.title || (route.name as string) || "未命名",
    icon: meta?.icon,
    component: route.component,
    meta: meta as any, // 临时解决类型兼容性问题
    hidden: meta?.hidden,
    affix: meta?.affix,
    noCache: meta?.noCache,
    noPage: meta?.noPage,
  };
}

/**
 * 初始化路由助手
 * 设置路由监听和页面管理
 */
export function initRouteHelper(router: Router) {
  const routeStore = useRouteStore();

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

/**
 * 扁平化路由列表
 * @param routes 路由记录数组
 * @param parentPath 父级路径
 * @returns 扁平化的路由信息数组
 */
export function flatternRoutes(
  routes: RouteRecordRaw[],
  parentPath = ""
): RouteInfo[] {
  const result: RouteInfo[] = [];

  for (const route of routes) {
    // 跳过隐藏的路由
    if (route.meta?.hidden) {
      continue;
    }

    // 构建完整路径 - 使用 route.path 而不是 route.name
    const fullPath = buildFullPath(route.path, parentPath);

    // 创建路由信息
    const routeInfo = createRouteInfo(route, fullPath);

    // 添加当前路由到结果中
    result.push(routeInfo);

    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      result.push(...flatternRoutes(route.children, fullPath));
    }
  }

  return result;
}

/**
 * 根据路由名称查找路由信息
 * @param routes 路由记录数组
 * @param routeName 路由名称
 * @returns 路由信息或undefined
 */
export function findRouteByName(
  routes: RouteRecordRaw[],
  routeName: string
): RouteInfo | undefined {
  const flatRoutes = flatternRoutes(routes);
  return flatRoutes.find((route) => route.name === routeName);
}

/**
 * 根据路径查找路由信息
 * @param routes 路由记录数组
 * @param routePath 路由路径
 * @returns 路由信息或undefined
 */
export function findRouteByPath(
  routes: RouteRecordRaw[],
  routePath: string
): RouteInfo | undefined {
  const flatRoutes = flatternRoutes(routes);
  return flatRoutes.find((route) => route.path === routePath);
}

/**
 * 根据组件名称查找路由信息
 * @param routes 路由记录数组
 * @param componentName 组件名称
 * @returns 路由信息或undefined
 */
export function findRouteByComponentName(
  routes: RouteRecordRaw[],
  componentName: string
): RouteInfo | undefined {
  const flatRoutes = flatternRoutes(routes);
  return flatRoutes.find((route) => route.name === componentName);
}

/**
 * 构建路由树结构（保持层级关系）
 * @param routes 路由记录数组
 * @param parentPath 父级路径
 * @returns 路由树结构
 */
export function buildRouteTree(
  routes: RouteRecordRaw[],
  parentPath = ""
): RouteInfo[] {
  const result: RouteInfo[] = [];

  for (const route of routes) {
    // 跳过隐藏的路由
    if (route.meta?.hidden) {
      continue;
    }

    // 构建完整路径
    const fullPath = buildFullPath(route.path, parentPath);

    // 创建路由信息
    const routeInfo = createRouteInfo(route, fullPath);

    // 处理子路由
    if (route.children && route.children.length > 0) {
      const children = buildRouteTree(route.children, fullPath);
      if (children.length > 0) {
        routeInfo.children = children;
      }
    }

    result.push(routeInfo);
  }

  return result;
}

/**
 * 获取路由面包屑路径
 * @param routes 路由记录数组
 * @param currentPath 当前路径
 * @returns 面包屑路径数组
 */
export function getBreadcrumbPath(
  routes: RouteRecordRaw[],
  currentPath: string
): RouteInfo[] {
  const breadcrumbs: RouteInfo[] = [];
  const flatRoutes = flatternRoutes(routes);

  // 查找当前路由
  const currentRoute = flatRoutes.find((route) => route.path === currentPath);
  if (!currentRoute) return breadcrumbs;

  // 构建面包屑路径
  const pathSegments = currentPath.split("/").filter((segment) => segment);
  let currentSegmentPath = "";

  for (const segment of pathSegments) {
    currentSegmentPath += `/${segment}`;
    const route = flatRoutes.find((r) => r.path === currentSegmentPath);
    if (route && !route.hidden) {
      breadcrumbs.push(route);
    }
  }

  return breadcrumbs;
}

/**
 * 路由助手类 - 提供统一的路由操作接口
 */
export class RouteHelper {
  private routes: RouteRecordRaw[];

  constructor(routes: RouteRecordRaw[]) {
    this.routes = routes;
  }

  /**
   * 根据组件名称构建完整路径
   */
  buildPathByComponentName(componentName: string, parentPath = ""): string {
    return buildFullPathByComponentName(componentName, parentPath);
  }

  /**
   * 获取扁平化的路由列表
   */
  getFlatRoutes(): RouteInfo[] {
    return flatternRoutes(this.routes);
  }

  /**
   * 获取路由树结构
   */
  getRouteTree(): RouteInfo[] {
    return buildRouteTree(this.routes);
  }

  /**
   * 根据名称查找路由
   */
  findByName(routeName: string): RouteInfo | undefined {
    return findRouteByName(this.routes, routeName);
  }

  /**
   * 根据路径查找路由
   */
  findByPath(routePath: string): RouteInfo | undefined {
    return findRouteByPath(this.routes, routePath);
  }

  /**
   * 根据组件名称查找路由
   */
  findByComponentName(componentName: string): RouteInfo | undefined {
    return findRouteByComponentName(this.routes, componentName);
  }

  /**
   * 获取面包屑路径
   */
  getBreadcrumbs(currentPath: string): RouteInfo[] {
    return getBreadcrumbPath(this.routes, currentPath);
  }

  /**
   * 获取所有可访问的路由（非隐藏）
   */
  getAccessibleRoutes(): RouteInfo[] {
    return this.getFlatRoutes().filter((route) => !route.hidden);
  }

  /**
   * 获取所有固定页面路由
   */
  getAffixRoutes(): RouteInfo[] {
    return this.getFlatRoutes().filter((route) => route.affix);
  }

  /**
   * 获取所有需要缓存的路由
   */
  getCacheableRoutes(): RouteInfo[] {
    return this.getFlatRoutes().filter((route) => !route.noCache);
  }
}
