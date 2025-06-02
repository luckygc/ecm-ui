import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { PageObject } from "@/types/page-types";

export const usePageStore = defineStore("page", () => {
  // ==================== 状态定义 ====================

  // 页面管理数据 - 使用fullPath作为key
  const pages = ref<Map<string, PageObject>>(new Map());

  // 当前激活的页面fullPath
  const activePageFullPath = ref<string>("");

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

  // 创建页面对象
  function createPageObject(route: any): PageObject {
    return {
      name: route.name || "Unknown",
      title: route.meta?.title || route.name || "未知页面",
      path: route.path,
      fullPath: route.fullPath,
      icon: route.meta?.icon,
      hidden: route.meta?.hidden || false,
      cached: route.meta?.keepAlive !== false,
    };
  }

  // 添加页面
  function addPage(route: any) {
    const fullPath = route.fullPath;

    // 如果页面已存在，不重复添加
    if (pages.value.has(fullPath)) {
      return;
    }

    const pageObject = createPageObject(route);
    pages.value.set(fullPath, pageObject);
    console.log("添加页面:", pageObject.title, fullPath);
  }

  // 切换到指定页面
  function switchToPage(fullPath: string) {
    activePageFullPath.value = fullPath;
    console.log("切换到页面:", fullPath);
  }

  // 处理路由变化
  function handleRouteChange(route: any) {
    // 跳过隐藏的路由
    if (route.meta?.hidden) {
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
  function closePage(fullPath: string) {
    pages.value.delete(fullPath);

    // 如果关闭的是当前激活的页面
    if (activePageFullPath.value === fullPath) {
      const lastPagePath = toLastPage();
      return lastPagePath; // 返回需要跳转的路径
    }
    return null;
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
  function closeOtherPages() {
    const currentFullPath = activePageFullPath.value;
    const currentPage = pages.value.get(currentFullPath);

    // 清空所有页面，只保留当前页面
    pages.value.clear();
    if (currentPage) {
      pages.value.set(currentFullPath, currentPage);
    }
  }

  // 关闭所有页面
  function closeAllPages() {
    pages.value.clear();
    activePageFullPath.value = "";
  }

  // 根据fullPath获取页面
  function getPageByFullPath(fullPath: string): PageObject | undefined {
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

    // 兼容性方法
    removePage: closePage,
  };
});
