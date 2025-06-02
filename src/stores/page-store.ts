import { defineStore } from "pinia";
import { ref, computed, defineComponent, h, type Component } from "vue";
import type { Router, RouteLocationNormalized } from "vue-router";
import type { PageObject } from "@/types/page-types";

/**
 * 从路由位置创建页面对象
 */
const createPageObjectFromLocation = (
  route: RouteLocationNormalized
): PageObject => {
  const meta = route.meta || {};

  const componentName = String(route.name || "");

  return {
    name: componentName,
    title: (meta.title as string) || componentName || "未命名页面",
    path: route.path,
    fullPath: route.fullPath,
    key: componentName, // 默认使用组件名称作为key
    icon: meta.icon as string,
    hidden: !!meta.hidden,
    cached: meta.cached === false ? false : true,
  };
};

export const usePageStore = defineStore("page", () => {
  // ==================== 状态定义 ====================

  const pages = ref<PageObject[]>([]);
  const keepAliveInclude = ref<string[]>([]);
  // 当前激活的页面
  const activePage = ref<PageObject | null>(null);

  // 路由实例
  let router: Router | null = null;

  /**
   * 初始化页面管理系统
   */
  const initializePageSystem = (routerInstance: Router) => {
    router = routerInstance;

    // 监听路由变化
    setupRouteWatcher();

    // 处理当前路由
    const currentRoute = router.currentRoute.value;
    if (currentRoute.name) {
      handleRouteChange(currentRoute);
    }
  };

  /**
   * 设置路由监听器
   */
  const setupRouteWatcher = () => {
    if (!router) {
      return;
    }

    router.afterEach((to) => {
      handleRouteChange(to);
    });
  };

  /**
   * 处理路由变化
   */
  const handleRouteChange = (route: RouteLocationNormalized) => {
    // 如果是隐藏路由，不处理
    if (route.meta?.hidden) {
      return;
    }

    const fullPath = route.fullPath;
    let page = findPageByFullPath(fullPath);

    // 如果页面不存在，动态创建
    if (!page) {
      page = createPageObjectFromLocation(route);
      addPage(page);
    }

    // 设置当前激活页面
    activePage.value = page;
  };

  const addPage = (page: PageObject) => {
    pages.value.push(page);
    // 只有缓存的页面才加入keepAlive
    if (page.cached) {
      keepAliveInclude.value.push(page.name);
    }
  };

  const removePage = (page: PageObject | undefined) => {
    if (!page) {
      console.warn("[PageStore] 无法删除页面: 未找到页面对象");
      return;
    }

    // 从页面数组中移除
    const index = pages.value.findIndex((p) => p.fullPath === page.fullPath);
    if (index > -1) {
      pages.value.splice(index, 1);
    }

    // 从keepAlive中移除
    const keepAliveIndex = keepAliveInclude.value.indexOf(page.name);
    if (keepAliveIndex > -1) {
      keepAliveInclude.value.splice(keepAliveIndex, 1);
    }

    // 如果删除的是当前激活页面，需要切换到其他页面
    if (activePage.value?.fullPath === page.fullPath) {
      activePage.value =
        pages.value.length > 0 ? pages.value[pages.value.length - 1] : null;
    }
  };

  const findPageByFullPath = (fullPath: string): PageObject | undefined => {
    return pages.value.find((page) => page.fullPath === fullPath);
  };

  /**
   * 刷新当前激活页面
   */
  const refreshActivePage = () => {
    if (!activePage.value) {
      return;
    }

    const oldKey = activePage.value.key;
    const page = findPageByFullPath(activePage.value.fullPath)!;

    if (oldKey.endsWith("__")) {
      page.key = oldKey.slice(0, -2);
    } else {
      page.key += "__";
    }
  };

  /**
   * 根据路由名称删除页面
   */
  const removePageByRouteName = (routeName: string) => {
    const page = pages.value.find((p) => p.name === routeName);
    removePage(page);
  };

  /**
   * 根据路由全路径删除页面
   */
  const removePageByFullPath = (fullPath: string) => {
    const page = findPageByFullPath(fullPath);
    removePage(page);
  };

  /**
   * 包裹组件，使用页面对象的自定义名称和key
   */
  const wrapComponent = (
    route: RouteLocationNormalized,
    component: Component
  ) => {
    // 获取页面对象（此时页面对象应该已经在路由变化时创建）
    const page = findPageByFullPath(route.fullPath);

    if (!page) {
      console.warn("[PageStore] 无法获取页面对象:", route.fullPath);
      return component;
    }

    // 使用页面名称作为组件名称
    const componentName = page.name;

    // 创建包裹组件，动态设置name和key
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

  // 计算属性：页面映射表
  const pageMap = computed(() => {
    const map: Record<string, PageObject> = {};
    pages.value.forEach((page) => {
      map[page.fullPath] = page;
    });
    return map;
  });

  return {
    pages,
    pageMap,
    activePage,

    // 计算属性
    keepAliveInclude,

    // 初始化方法
    initializePageSystem,

    // 路由处理方法
    handleRouteChange,

    // 组件包裹方法
    wrapComponent,

    // 核心公共方法
    refreshActivePage,
    removePageByRouteName,
    removePageByFullPath,
  };
});
