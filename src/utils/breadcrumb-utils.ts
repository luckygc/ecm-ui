import type { BreadcrumbItem, PageObject } from "@/types/page-types";

/**
 * 面包屑工具
 * 负责构建面包屑导航
 */

/**
 * 从当前页面构建面包屑导航
 */
export const buildBreadcrumbs = (
  activePage: PageObject | null,
  findPageByPath: (path: string) => PageObject | undefined
): BreadcrumbItem[] => {
  if (!activePage) return [];

  const crumbs: BreadcrumbItem[] = [];
  const pathSegments = activePage.path.split("/").filter(Boolean);
  let currentPath = "";

  // 添加首页
  if (activePage.path !== "/dashboard") {
    crumbs.push({
      title: "首页",
      path: "/dashboard",
      icon: "HomeFilled",
      clickable: true,
    });
  }

  // 构建面包屑路径
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += "/" + pathSegments[i];
    const page = findPageByPath(currentPath);

    if (page && !page.hidden) {
      crumbs.push({
        title: page.title,
        path: page.path,
        icon: page.icon,
        clickable: i < pathSegments.length - 1 && !page.meta?.noPage,
      });
    }
  }

  return crumbs;
};

/**
 * 从路径数组构建面包屑
 */
export const buildBreadcrumbsFromPaths = (
  paths: string[],
  findPageByPath: (path: string) => PageObject | undefined
): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = [];

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const page = findPageByPath(path);

    if (page && !page.hidden) {
      crumbs.push({
        title: page.title,
        path: page.path,
        icon: page.icon,
        clickable: i < paths.length - 1 && !page.meta?.noPage,
      });
    }
  }

  return crumbs;
};

/**
 * 自定义面包屑构建
 */
export const buildCustomBreadcrumbs = (
  items: Array<{
    title: string;
    path?: string;
    icon?: string;
    clickable?: boolean;
  }>
): BreadcrumbItem[] => {
  return items.map((item) => ({
    title: item.title,
    path: item.path || "",
    icon: item.icon,
    clickable: item.clickable !== false && !!item.path,
  }));
};

/**
 * 面包屑工具对象
 */
export const breadcrumbUtils = {
  buildBreadcrumbs,
  buildBreadcrumbsFromPaths,
  buildCustomBreadcrumbs,
};
