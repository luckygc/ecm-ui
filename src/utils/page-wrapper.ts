import { defineComponent, h, type Component } from "vue";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { usePageStore } from "@/stores/page-store";

/**
 * 包裹组件，动态设置组件名称
 * 基于统一页面管理系统
 */
export const wrapperComponent = (
  route: RouteLocationNormalizedLoaded,
  component: Component
) => {
  const pageStore = usePageStore();

  // 获取或创建页面对象
  let page = pageStore.pageMap[route.fullPath];
  if (!page) {
    // 如果页面不存在，触发路由变化处理
    pageStore.handleRouteChange(route);
    page = pageStore.pageMap[route.fullPath];
  }

  if (!page) {
    console.warn("[PageWrapper] 无法获取页面对象:", route.fullPath);
    return component;
  }

  // 使用页面名称作为组件名称
  const componentName = page.name;

  // 创建包裹组件，动态设置name
  const Wrapper = defineComponent({
    name: componentName,
    setup(_, { attrs }) {
      return () =>
        h(component, {
          ...attrs,
          key: page!.key, // 使用页面的key属性
          // 传递页面信息给被包裹的组件
          pageInfo: {
            name: page!.name,
            title: page!.title,
            path: page!.path,
            fullPath: page!.fullPath,
            key: page!.key,
            icon: page!.icon,
            hidden: page!.hidden,
            cached: page!.cached,
          },
          // 兼容旧版本的routeInfo
          routeInfo: {
            name: route.name,
            fullPath: route.fullPath,
            params: route.params,
            query: route.query,
            meta: route.meta,
          },
        });
    },
  });

  return Wrapper;
};

/**
 * 计算组件名称（兼容旧版本）
 */
export const computeComponentName = (
  route: RouteLocationNormalizedLoaded
): string => {
  const pageStore = usePageStore();

  let page = pageStore.pageMap[route.fullPath];
  if (!page) {
    pageStore.handleRouteChange(route);
    page = pageStore.pageMap[route.fullPath];
  }

  return page?.name || "Anonymous";
};

/**
 * 页面管理工具（兼容旧版本）
 */
export const page = {
  /**
   * 添加页面到缓存
   */
  add: (route: RouteLocationNormalizedLoaded) => {
    const pageStore = usePageStore();
    pageStore.handleRouteChange(route);
    const pageObj = pageStore.pageMap[route.fullPath];

    return pageObj?.name || "";
  },

  /**
   * 从缓存中移除页面
   */
  remove: (route: RouteLocationNormalizedLoaded | string) => {
    const pageStore = usePageStore();

    if (typeof route === "string") {
      // 如果传入的是组件名或路径，查找对应页面
      const pageObj = pageStore.pages.find(
        (p) => p.name === route || p.fullPath === route
      );

      if (pageObj) {
        pageStore.removePageByFullPath(pageObj.fullPath);
        return pageObj.name;
      }
      return route;
    } else {
      // 如果传入的是路由对象
      const pageObj = pageStore.pageMap[route.fullPath];
      if (pageObj) {
        pageStore.removePageByFullPath(pageObj.fullPath);
        return pageObj.name;
      }
      return "";
    }
  },

  /**
   * 清理所有缓存
   */
  clear: () => {
    const pageStore = usePageStore();
    pageStore.pages.forEach((page) => {
      // 移除所有非固定页面（这里假设没有affix属性，移除所有页面）
      pageStore.removePageByFullPath(page.fullPath);
    });
    console.log("[PageWrapper] 清理所有页面缓存");
  },

  /**
   * 获取组件名称映射信息
   */
  getMapping: () => {
    const pageStore = usePageStore();
    const componentNameMap = new Map<string, string>();
    const routeFullPathMap: Record<string, string> = {};
    const multiComponentNumberMap: Record<string, number> = {};

    pageStore.pages.forEach((page) => {
      componentNameMap.set(page.fullPath, page.name);
      routeFullPathMap[page.name] = page.fullPath;

      // 提取实例序号
      const match = page.name.match(/^(.+)_(\d+)$/);
      if (match) {
        const baseName = match[1];
        const instanceNumber = parseInt(match[2]);
        multiComponentNumberMap[baseName] = Math.max(
          multiComponentNumberMap[baseName] || 0,
          instanceNumber
        );
      }
    });

    return {
      componentNameMap,
      routeFullPathMap,
      multiComponentNumberMap,
    };
  },

  /**
   * 检查页面是否在缓存中
   */
  has: (route: RouteLocationNormalizedLoaded | string): boolean => {
    const pageStore = usePageStore();

    if (typeof route === "string") {
      return (
        route in pageStore.pageMap ||
        pageStore.pages.some((p) => p.name === route)
      );
    }

    const pageObj = pageStore.pageMap[route.fullPath];
    return pageObj?.cached || false;
  },
};
