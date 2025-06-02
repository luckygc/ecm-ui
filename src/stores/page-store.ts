import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";

export const usePageStore = defineStore("page", () => {
  // ==================== 状态定义 ====================

  // 页面管理数据 - 使用fullPath作为key
  const pages = ref<Map<string, RouteLocationNormalizedLoadedGeneric>>(
    new Map()
  );

  // 当前激活的页面fullPath
  const activePageFullPath = ref<string>("");

  // KeepAlive include列表 - 统一管理缓存
  const keepAliveInclude = ref<string[]>([]);

  // ==================== 计算属性 ====================

  // 获取页面列表
  const visitedPages = computed(() => Array.from(pages.value.values()));

  // 获取当前激活的页面对象
  const activePage = computed(() => {
    return activePageFullPath.value
      ? pages.value.get(activePageFullPath.value)
      : null;
  });

  // 获取页面映射表
  const pageMap = computed(() => pages.value);

  // ==================== 页面管理方法 ====================

  function generateComponentName(route: any): string {
    return route.fullPath.replace(/[^a-zA-Z0-9]/g, "_");
  }

  // 判断路由是否需要缓存
  function shouldCache(route: RouteLocationNormalizedLoadedGeneric): boolean {
    // 默认缓存，除非明确设置为false
    return route.meta?.keepAlive !== false;
  }

  // 添加到KeepAlive缓存
  function addToKeepAlive(componentName: string) {
    if (!keepAliveInclude.value.includes(componentName)) {
      keepAliveInclude.value.push(componentName);
      console.log("添加到KeepAlive缓存:", componentName);
    }
  }

  // 从KeepAlive缓存中移除
  function removeFromKeepAlive(componentName: string) {
    const index = keepAliveInclude.value.indexOf(componentName);
    if (index > -1) {
      keepAliveInclude.value.splice(index, 1);
      console.log("从KeepAlive缓存中移除:", componentName);
    }
  }

  // 延迟移除KeepAlive缓存（避免DOM操作冲突）
  function removeFromKeepAliveDelayed(componentName: string) {
    // 使用nextTick确保DOM更新完成后再移除缓存
    return new Promise<void>((resolve) => {
      // 使用更短的延迟，只是为了让当前的DOM操作完成
      setTimeout(() => {
        removeFromKeepAlive(componentName);
        resolve();
      }, 10); // 减少延迟时间
    });
  }

  // 创建路由对象的副本，避免响应式引用问题
  function createRouteSnapshot(
    route: RouteLocationNormalizedLoadedGeneric
  ): RouteLocationNormalizedLoadedGeneric {
    return {
      fullPath: route.fullPath,
      path: route.path,
      name: route.name,
      params: { ...route.params },
      query: { ...route.query },
      hash: route.hash,
      meta: { ...route.meta },
      matched: route.matched.map((record) => ({ ...record })),
      redirectedFrom: route.redirectedFrom,
    } as RouteLocationNormalizedLoadedGeneric;
  }

  // 添加页面
  function addPage(route: RouteLocationNormalizedLoadedGeneric) {
    const fullPath = route.fullPath;

    // 如果页面已存在，不重复添加
    if (pages.value.has(fullPath)) {
      return;
    }

    // 创建路由对象的副本并存储
    const routeSnapshot = createRouteSnapshot(route);
    pages.value.set(fullPath, routeSnapshot);

    // 如果页面需要缓存，添加到KeepAlive
    if (shouldCache(routeSnapshot)) {
      const componentName = generateComponentName(routeSnapshot);
      addToKeepAlive(componentName);
    }
  }

  // 切换到指定页面
  function switchToPage(fullPath: string) {
    activePageFullPath.value = fullPath;
  }

  function handleRouteChange(route: any) {
    // 跳过隐藏的路由或没有实际页面的路由
    if (route.meta?.hidden) {
      return;
    }

    // 跳过重定向路由（通常是父级路由）
    if (route.redirectedFrom) {
      return;
    }

    // 如果路由路径是根路径"/"，跳过（这通常是重定向路由）
    if (route.path === "/") {
      return;
    }

    const newFullPath = route.fullPath;
    console.log("路由变化:", newFullPath);

    // 检查页面是否已存在
    if (pages.value.has(newFullPath)) {
      // 存在则切换到该页面
      switchToPage(newFullPath);
    } else {
      // 不存在则添加新页面
      addPage(route);
      switchToPage(newFullPath);
    }
  }

  // 关闭指定页面
  async function closePage(fullPath: string) {
    const page = pages.value.get(fullPath);

    // 先从页面列表中移除
    pages.value.delete(fullPath);

    // 如果关闭的是当前激活的页面，先跳转到其他页面
    let redirectPath = null;
    if (activePageFullPath.value === fullPath) {
      redirectPath = toLastPage();
    }

    // 延迟移除KeepAlive缓存，避免DOM操作冲突
    if (page && shouldCache(page)) {
      const componentName = generateComponentName(page);
      // 异步移除缓存，不阻塞页面跳转
      removeFromKeepAliveDelayed(componentName);
    }

    return redirectPath;
  }

  // 跳转到最后一个页面
  function toLastPage() {
    const allPages = Array.from(pages.value.values());
    const latestPage = allPages[allPages.length - 1];
    if (latestPage) {
      activePageFullPath.value = latestPage.fullPath;
      return latestPage.fullPath;
    } else {
      // 如果没有页面，清空当前激活页面
      activePageFullPath.value = "";
      return "/";
    }
  }

  // 刷新当前页面
  function refreshCurrentPage() {
    const currentPage = activePage.value;
    if (currentPage) {
      // 返回组件名称用于刷新
      return currentPage.name;
    }
    return null;
  }

  // 关闭其他页面
  async function closeOtherPages() {
    const currentFullPath = activePageFullPath.value;
    const currentPage = pages.value.get(currentFullPath);

    // 收集需要移除的组件名称
    const componentsToRemove: string[] = [];
    pages.value.forEach((page, fullPath) => {
      if (fullPath !== currentFullPath && shouldCache(page)) {
        const componentName = generateComponentName(page);
        componentsToRemove.push(componentName);
      }
    });

    // 清空所有页面，只保留当前页面
    pages.value.clear();
    if (currentPage) {
      pages.value.set(currentFullPath, currentPage);
    }

    // 延迟移除KeepAlive缓存
    componentsToRemove.forEach((componentName) => {
      removeFromKeepAliveDelayed(componentName);
    });
  }

  // 关闭所有页面
  async function closeAllPages() {
    // 收集需要移除的组件名称
    const componentsToRemove: string[] = [];
    pages.value.forEach((page) => {
      if (shouldCache(page)) {
        const componentName = generateComponentName(page);
        componentsToRemove.push(componentName);
      }
    });

    pages.value.clear();
    activePageFullPath.value = "";

    // 延迟移除KeepAlive缓存
    componentsToRemove.forEach((componentName) => {
      removeFromKeepAliveDelayed(componentName);
    });
  }

  // 根据fullPath获取页面
  function getPageByFullPath(
    fullPath: string
  ): RouteLocationNormalizedLoadedGeneric | undefined {
    return pages.value.get(fullPath);
  }

  // 检查页面是否存在
  function hasPage(fullPath: string): boolean {
    return pages.value.has(fullPath);
  }

  return {
    // 状态
    pages: pageMap,
    activePageFullPath,
    keepAliveInclude,

    // 计算属性
    visitedPages,
    activePage,
    pageMap,

    // 方法
    addPage,
    switchToPage,
    handleRouteChange,
    closePage,
    toLastPage,
    refreshCurrentPage,
    closeOtherPages,
    closeAllPages,
    getPageByFullPath,
    hasPage,
    generateComponentName,
    addToKeepAlive,
    removeFromKeepAlive,
    removeFromKeepAliveDelayed,

    // 兼容性方法
    removePage: closePage,
  };
});
