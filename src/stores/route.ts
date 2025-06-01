import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import { allRoutes } from "@/router/modules";

// 路由信息接口
export interface RouteInfo {
  path: string;
  name?: string;
  title: string;
  icon?: string;
  component?: any;
  children?: RouteInfo[];
  meta?: any;
  hidden?: boolean;
  affix?: boolean;
  noCache?: boolean;
  noPage?: boolean;
}

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
  query?: any;
  params?: any;
  meta?: any;
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
        // 构建完整路径
        const fullPath = route.path.startsWith("/")
          ? route.path
          : `${parentPath}/${route.path}`.replace(/\/+/g, "/");

        // 跳过隐藏的路由
        if (route.meta?.hidden) continue;

        const routeInfo: RouteInfo = {
          path: fullPath,
          name: route.name as string,
          title: route.meta?.title || (route.name as string) || "未命名",
          icon: route.meta?.icon,
          component: route.component,
          meta: route.meta,
          hidden: route.meta?.hidden,
          affix: route.meta?.affix,
          noCache: route.meta?.noCache,
          noPage: route.meta?.noPage,
        };

        // 处理子路由
        if (route.children && route.children.length > 0) {
          const children = flatten(route.children, fullPath);
          if (children.length > 0) {
            routeInfo.children = children;
            result.push(routeInfo);
            result.push(...children);
          } else {
            result.push(routeInfo);
          }
        } else {
          result.push(routeInfo);
        }
      }

      return result;
    };

    return flatten(allRoutes);
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

        const fullPath = route.path.startsWith("/")
          ? route.path
          : `${parentPath}/${route.path}`.replace(/\/+/g, "/");

        const routeInfo: RouteInfo = {
          path: fullPath,
          name: route.name as string,
          title: route.meta?.title || (route.name as string) || "未命名",
          icon: route.meta?.icon,
          meta: route.meta,
          noPage: route.meta?.noPage, // 添加 noPage 标识
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

    return buildMenuTree(allRoutes);
  });

  // 面包屑导航
  const breadcrumbs = computed((): BreadcrumbItem[] => {
    if (!currentRoute.value) return [];

    const breadcrumbList: BreadcrumbItem[] = [];
    const currentPath = currentRoute.value.path;

    // 如果不在首页，添加首页作为第一个面包屑
    if (currentPath !== "/dashboard" && currentPath !== "/") {
      breadcrumbList.push({
        title: "首页",
        path: "/dashboard",
        icon: "HomeFilled",
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
      const meta = routeItem.meta;

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
    if (!name || meta?.hidden || meta?.noPage) return;

    const pageInfo: PageInfo = {
      path,
      name: name as string,
      title: meta?.title || (name as string),
      icon: meta?.icon,
      affix: meta?.affix,
      noCache: meta?.noCache,
      fullPath,
      query: { ...query },
      params: { ...params },
      meta: { ...meta },
    };

    // 检查是否已存在
    const existingIndex = visitedPages.value.findIndex(
      (page) => page.path === path
    );
    if (existingIndex > -1) {
      // 更新现有页面信息
      visitedPages.value[existingIndex] = pageInfo;
    } else {
      // 添加新页面
      visitedPages.value.push(pageInfo);
    }

    // 添加到缓存（如果不是 noCache）
    if (!pageInfo.noCache && pageInfo.name) {
      addCachedPage(pageInfo.name);
    }
  };

  // 删除访问的页面
  const delVisitedPage = (page: PageInfo) => {
    const index = visitedPages.value.findIndex((p) => p.path === page.path);
    if (index > -1) {
      visitedPages.value.splice(index, 1);
    }

    // 从缓存中删除
    if (page.name) {
      delCachedPage(page.name);
    }
  };

  // 删除其他页面
  const delOtherVisitedPages = (page: PageInfo) => {
    visitedPages.value = visitedPages.value.filter(
      (p) => p.affix || p.path === page.path
    );

    // 更新缓存
    const cacheNames = visitedPages.value
      .filter((p) => !p.noCache && p.name)
      .map((p) => p.name!);
    cachedPages.value = cacheNames;
  };

  // 删除所有页面
  const delAllVisitedPages = () => {
    // 保留固定页面
    visitedPages.value = visitedPages.value.filter((p) => p.affix);

    // 清空缓存
    cachedPages.value = [];
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

  // 初始化固定页面
  const initAffixPages = () => {
    const affixRoutes = flatRoutes.value.filter((route) => route.affix);
    affixPages.value = affixRoutes.map((route) => ({
      path: route.path,
      name: route.name,
      title: route.title,
      icon: route.icon,
      affix: route.affix,
      noCache: route.noCache,
      meta: route.meta,
    }));

    // 将固定页面添加到访问列表
    affixPages.value.forEach((page) => {
      if (!visitedPages.value.find((p) => p.path === page.path)) {
        visitedPages.value.push(page);
      }
    });
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
    initAffixPages,
  };
});
