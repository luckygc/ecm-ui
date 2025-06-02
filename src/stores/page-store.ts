import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Router, RouteLocationNormalized } from "vue-router";
import type { PageObject } from "@/types/page-types";
import { createPageObjectFromLocation } from "@/utils/page-object-factory";

/**
 * 页面管理Store - 简化版
 * 只管理页面对象、当前激活页面、keepAliveInclude
 */
export const usePageStore = defineStore("page", () => {
  // ==================== 状态定义 ====================

  // 所有页面对象映射 - key: fullPath, value: PageObject
  const pages = ref<Map<string, PageObject>>(new Map());

  // 当前激活的页面
  const activePage = ref<PageObject | null>(null);

  // 路由实例
  let router: Router | null = null;

  // ==================== 计算属性 ====================

  // keepalive的include列表 - 从pages中获取已缓存的页面
  const keepAliveInclude = computed(() => {
    return Array.from(pages.value.values())
      .filter((page) => page.cached)
      .map((page) => page.name); // 使用页面名称作为组件名
  });

  // ==================== 核心方法 ====================

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

    console.log("[PageStore] 页面管理系统已初始化");
  };

  /**
   * 设置路由监听器
   */
  const setupRouteWatcher = () => {
    if (!router) return;

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
    let page = pages.value.get(fullPath);

    // 如果页面不存在，动态创建
    if (!page) {
      page = createPageObjectFromLocation(route);
      pages.value.set(fullPath, page);
    }

    // 设置为激活页面
    setActivePage(page);

    // 默认开启缓存（可以通过meta.noCache关闭）
    if (!route.meta?.noCache) {
      page.cached = true;
    }
  };

  /**
   * 设置激活页面
   */
  const setActivePage = (page: PageObject) => {
    // 取消之前的激活状态
    if (activePage.value) {
      activePage.value.active = false;
    }

    // 设置新的激活页面
    page.active = true;
    activePage.value = page;
  };

  /**
   * 根据路径查找页面
   */
  const findPageByPath = (path: string): PageObject | undefined => {
    return Array.from(pages.value.values()).find((page) => page.path === path);
  };

  /**
   * 刷新当前激活页面
   */
  const refreshActivePage = () => {
    if (!activePage.value) {
      return;
    }

    const oldKey = activePage.value.key;
    if (oldKey.endsWith("__")) {
      activePage.value.key = oldKey.slice(0, -2);
    } else {
      activePage.value.key += "__";
    }
  };

  /**
   * 根据路由名称删除页面
   */
  const removePageByRouteName = (routeName: string) => {
    const page = Array.from(pages.value.values()).find(
      (p) => p.name === routeName
    );
    if (page) {
      removePageInternal(page);
    }
  };

  /**
   * 根据路由全路径删除页面
   */
  const removePageByFullPath = (fullPath: string) => {
    const page = pages.value.get(fullPath);
    if (page) {
      removePageInternal(page);
    }
  };

  /**
   * 内部删除页面方法
   */
  const removePageInternal = (page: PageObject) => {
    // 从页面映射中移除
    pages.value.delete(page.fullPath);

    console.log(`[PageStore] 移除页面: ${page.title} (${page.fullPath})`);
  };

  return {
    // 状态 - 只读访问
    pages: computed(() => pages.value),
    activePage: computed(() => activePage.value),

    // 计算属性
    keepAliveInclude,

    // 初始化方法
    initializePageSystem,

    // 核心公共方法
    refreshActivePage,
    removePageByRouteName,
    removePageByFullPath,

    // 查找方法（用于面包屑等工具）
    findPageByPath,

    // 内部方法（用于路由变化处理）
    handleRouteChange,
  };
});
