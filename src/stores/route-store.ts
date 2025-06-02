import { routes } from "@/router";
import {
  buildFullPath,
  createRouteInfo,
  type RouteInfo,
  type RouteMeta,
} from "@/utils/routeHelper";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";

// 重新导出类型，保持向后兼容
export type { RouteInfo, RouteMeta } from "@/utils/routeHelper";

// 面包屑项接口
export interface BreadcrumbItem {
  title: string;
  path: string;
  icon?: string;
  clickable: boolean;
}

// 页面信息接口
export interface PageInfo {
  path: string;
  name?: string;
  title: string;
  icon?: string;
  affix?: boolean;
  noCache?: boolean;
  fullPath?: string;
  query?: Record<string, any>;
  params?: Record<string, any>;
  meta?: RouteMeta;
  // 新增：用于keepAlive的唯一组件名
  componentName?: string;
  // 新增：用于区分同一路由的不同实例
  instanceId?: string;
}

// ==================== 工具函数 ====================

/**
 * 生成路由实例的唯一ID
 * 基于路由路径和参数生成，确保同一路由的不同参数实例有不同的ID
 */
function generateInstanceId(route: RouteLocationNormalized): string {
  const { path, query, params } = route;

  // 将查询参数和路径参数序列化
  const queryStr = Object.keys(query).length > 0 ? JSON.stringify(query) : "";
  const paramsStr =
    Object.keys(params).length > 0 ? JSON.stringify(params) : "";

  // 生成基于路径和参数的哈希
  const content = `${path}${queryStr}${paramsStr}`;
  return btoa(encodeURIComponent(content))
    .replace(/[+/=]/g, "")
    .substring(0, 8);
}

/**
 * 生成用于keepAlive的唯一组件名
 * 格式：原组件名_实例ID
 */
function generateComponentName(routeName: string, instanceId: string): string {
  return `${routeName}_${instanceId}`;
}

/**
 * 生成页面标题，支持参数化显示
 */
function generatePageTitle(route: RouteLocationNormalized): string {
  const baseTitle = (route.meta?.title as string) || (route.name as string);

  // 如果有路径参数，添加到标题中
  if (route.params && Object.keys(route.params).length > 0) {
    const paramStr = Object.entries(route.params)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");
    return `${baseTitle}(${paramStr})`;
  }

  return baseTitle;
}

export const useRouteStore = defineStore("route", () => {
  // ==================== 状态定义 ====================

  // 当前路由信息
  const currentRoute = ref<RouteLocationNormalized | null>(null);

  // 访问过的页面列表
  const visitedPages = ref<PageInfo[]>([]);

  // 缓存的页面列表（用于 keep-alive）
  const cachedPages = ref<string[]>([]);

  // 固定的页面列表（不能关闭的页面）
  const affixPages = ref<PageInfo[]>([]);

  // ==================== 计算属性 ====================

  // 扁平化的路由列表
  const flatRoutes = computed(() => {
    const flatten = (
      routes: RouteRecordRaw[],
      parentPath = ""
    ): RouteInfo[] => {
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

        // 添加当前路由
        result.push(routeInfo);

        // 递归处理子路由（只添加子路由到结果中，不重复添加父路由）
        if (route.children && route.children.length > 0) {
          const children = flatten(route.children, fullPath);
          result.push(...children);
        }
      }

      return result;
    };

    return flatten(routes);
  });

  // 侧边栏菜单路由
  const sidebarRoutes = computed(() => {
    const buildMenuTree = (
      routes: RouteRecordRaw[],
      parentPath = ""
    ): RouteInfo[] => {
      const result: RouteInfo[] = [];

      for (const route of routes) {
        // 跳过隐藏的路由
        if (route.meta?.hidden) continue;

        // 构建完整路径
        const fullPath = buildFullPath(route.path, parentPath);

        // 创建路由信息（侧边栏不需要所有属性）
        const meta = route.meta as RouteMeta;
        const routeInfo: RouteInfo = {
          path: fullPath,
          name: route.name as string,
          title: meta?.title || (route.name as string) || "未命名",
          icon: meta?.icon,
          meta,
          noPage: meta?.noPage,
        };

        // 处理子路由
        if (route.children && route.children.length > 0) {
          const children = buildMenuTree(route.children, fullPath);
          if (children.length > 0) {
            routeInfo.children = children;
          }
        }

        result.push(routeInfo);
      }

      return result;
    };

    return buildMenuTree(routes);
  });

  // 面包屑导航
  const breadcrumbs = computed((): BreadcrumbItem[] => {
    if (!currentRoute.value) return [];

    const breadcrumbList: BreadcrumbItem[] = [];
    const currentPath = currentRoute.value.path;

    // 查找首页路由（标记为 affix 的路由通常是首页）
    const homeRoute = flatRoutes.value.find((route) => route.affix);

    // 如果不在首页且找到了首页路由，添加首页作为第一个面包屑
    if (homeRoute && currentPath !== homeRoute.path && currentPath !== "/") {
      breadcrumbList.push({
        title: homeRoute.title,
        path: homeRoute.path,
        icon: homeRoute.icon,
        clickable: true,
      });
    }

    // 处理当前路由的匹配路径
    const matched = currentRoute.value.matched.filter((item) => {
      // 过滤掉根路径，保留有标题的路由
      return (
        item.path !== "/" && item.meta && item.meta.title && !item.meta.hidden
      );
    });

    // 构建面包屑路径
    for (let i = 0; i < matched.length; i++) {
      const routeItem = matched[i];
      const meta = routeItem.meta as RouteMeta;

      if (meta && meta.title) {
        const isLast = i === matched.length - 1;
        const isCurrentPath = routeItem.path === currentPath;

        breadcrumbList.push({
          title: meta.title,
          path: routeItem.path,
          icon: meta.icon,
          // 最后一个面包屑或当前路径或没有实际页面的路由不可点击
          clickable: !isLast && !isCurrentPath && !meta.noPage,
        });
      }
    }

    return breadcrumbList;
  });

  // ==================== 页面管理方法 ====================

  // 添加访问的页面
  const addVisitedPage = (route: RouteLocationNormalized) => {
    const { name, path, meta, fullPath, query, params } = route;

    // 跳过隐藏的路由和没有实际页面的路由
    if (!name || meta?.hidden) {
      return;
    }

    // 生成实例ID和组件名
    const instanceId = generateInstanceId(route);
    const componentName = generateComponentName(name as string, instanceId);
    const title = generatePageTitle(route);

    const pageInfo: PageInfo = {
      path,
      name: name as string,
      title,
      icon: meta?.icon as string,
      affix: meta?.affix as boolean,
      noCache: meta?.noCache as boolean,
      fullPath,
      query: { ...query },
      params: { ...params },
      meta: { ...meta },
      componentName,
      instanceId,
    };

    // 检查是否已存在相同的fullPath（支持参数化路由的多实例）
    const existingIndex = visitedPages.value.findIndex(
      (page) => page.fullPath === fullPath
    );
    if (existingIndex > -1) {
      // 更新现有页面信息
      visitedPages.value[existingIndex] = pageInfo;
    } else {
      // 添加新页面
      visitedPages.value.push(pageInfo);
    }

    // 添加到缓存（如果不是 noCache）
    if (!pageInfo.noCache && pageInfo.componentName) {
      addCachedPage(pageInfo.componentName);
    }
  };

  // 删除访问的页面
  const delVisitedPage = (page: PageInfo) => {
    const index = visitedPages.value.findIndex(
      (p) => p.fullPath === page.fullPath
    );
    if (index > -1) {
      visitedPages.value.splice(index, 1);
    }

    // 从缓存中删除
    if (page.componentName) {
      delCachedPage(page.componentName);
    }
  };

  // 删除其他页面
  const delOtherVisitedPages = (page: PageInfo) => {
    visitedPages.value = visitedPages.value.filter(
      (p) => p.affix || p.fullPath === page.fullPath
    );

    // 更新缓存
    const cacheNames = visitedPages.value
      .filter((p) => !p.noCache && p.componentName)
      .map((p) => p.componentName!);
    cachedPages.value = cacheNames;
  };

  // 删除所有页面
  const delAllVisitedPages = () => {
    // 保留固定页面
    visitedPages.value = visitedPages.value.filter((p) => p.affix);

    // 更新缓存，保留固定页面的缓存
    const affixCacheNames = visitedPages.value
      .filter((p) => !p.noCache && p.componentName)
      .map((p) => p.componentName!);
    cachedPages.value = affixCacheNames;
  };

  // 添加缓存页面
  const addCachedPage = (name: string) => {
    if (!cachedPages.value.includes(name)) {
      cachedPages.value.push(name);
    }
  };

  // 删除缓存页面
  const delCachedPage = (name: string) => {
    const index = cachedPages.value.indexOf(name);
    if (index > -1) {
      cachedPages.value.splice(index, 1);
    }
  };

  // 删除所有缓存页面
  const delAllCachedPages = () => {
    cachedPages.value = [];
  };

  // ==================== 路由工具方法 ====================

  // 设置当前路由
  const setCurrentRoute = (route: RouteLocationNormalized) => {
    currentRoute.value = route;
    addVisitedPage(route);
  };

  // 根据路径查找路由信息
  const findRouteByPath = (path: string): RouteInfo | undefined => {
    return flatRoutes.value.find((route) => route.path === path);
  };

  // 根据名称查找路由信息
  const findRouteByName = (name: string): RouteInfo | undefined => {
    return flatRoutes.value.find((route) => route.name === name);
  };

  // 根据fullPath查找页面信息
  const findPageByFullPath = (fullPath: string): PageInfo | undefined => {
    return visitedPages.value.find((page) => page.fullPath === fullPath);
  };

  // ==================== 返回接口 ====================

  return {
    // 状态
    currentRoute,
    visitedPages,
    cachedPages,
    affixPages,

    // 计算属性
    flatRoutes,
    sidebarRoutes,
    breadcrumbs,

    // 页面管理方法
    addVisitedPage,
    delVisitedPage,
    delOtherVisitedPages,
    delAllVisitedPages,
    addCachedPage,
    delCachedPage,
    delAllCachedPages,

    // 路由工具方法
    setCurrentRoute,
    findRouteByPath,
    findRouteByName,
    findPageByFullPath,
  };
});
