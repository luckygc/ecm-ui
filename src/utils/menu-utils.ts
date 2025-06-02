import type { RouteRecordRaw } from "vue-router";
import type { MenuItem, PageObject } from "@/types/page-types";

/**
 * 菜单构建工具
 * 负责从路由配置和页面对象构建菜单结构
 */

/**
 * 从页面对象构建扁平菜单
 */
export const buildFlatMenuFromPages = (
  pages: Map<string, PageObject>
): MenuItem[] => {
  return Array.from(pages.values())
    .filter((page) => !page.hidden)
    .map((page) => ({
      id: page.fullPath,
      title: page.title,
      path: page.path,
      icon: page.icon,
      hidden: page.hidden,
      meta: page.meta,
      // 页面对象本身就表示有实际页面，所以都是可点击的（除非明确设置noPage）
      clickable: !page.meta?.noPage,
    }));
};

/**
 * 从路由配置构建嵌套菜单
 */
export const buildNestedMenuFromRoutes = (
  routeList: RouteRecordRaw[],
  basePath = ""
): MenuItem[] => {
  const menuList: MenuItem[] = [];

  for (const route of routeList) {
    const meta = route.meta || {};

    // 跳过隐藏的路由
    if (meta.hidden) continue;

    const fullPath =
      basePath + (route.path.startsWith("/") ? route.path : "/" + route.path);

    const menuItem: MenuItem = {
      id: fullPath,
      title: (meta.title as string) || String(route.name || "") || "未命名",
      path: fullPath,
      icon: meta.icon as string,
      hidden: !!meta.hidden,
      meta: { ...meta },
      // 有children的路由或明确设置noPage的路由不可点击
      clickable:
        !meta.noPage &&
        !!route.component &&
        (!route.children || route.children.length === 0),
      children: [],
    };

    // 处理子路由
    if (route.children && route.children.length > 0) {
      const children = buildNestedMenuFromRoutes(route.children, fullPath);
      if (children.length > 0) {
        menuItem.children = children;
      }
    }

    menuList.push(menuItem);
  }

  return menuList;
};

/**
 * 在嵌套菜单中查找指定路径的菜单项
 */
export const findMenuItemByPath = (
  path: string,
  menuItems: MenuItem[]
): MenuItem | null => {
  for (const item of menuItems) {
    if (item.path === path) {
      return item;
    }

    if (item.children && item.children.length > 0) {
      const found = findMenuItemByPath(path, item.children);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

/**
 * 扁平化嵌套菜单结构
 */
export const flattenMenuItems = (menuItems: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = [];

  const flatten = (items: MenuItem[]) => {
    for (const item of items) {
      result.push({
        ...item,
        children: undefined, // 移除子菜单引用
      });

      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    }
  };

  flatten(menuItems);
  return result;
};

/**
 * 过滤菜单项
 */
export const filterMenuItems = (
  menuItems: MenuItem[],
  predicate: (item: MenuItem) => boolean
): MenuItem[] => {
  const result: MenuItem[] = [];

  for (const item of menuItems) {
    if (predicate(item)) {
      const filteredItem: MenuItem = { ...item };

      if (item.children && item.children.length > 0) {
        const filteredChildren = filterMenuItems(item.children, predicate);
        if (filteredChildren.length > 0) {
          filteredItem.children = filteredChildren;
        } else {
          filteredItem.children = [];
        }
      }

      result.push(filteredItem);
    }
  }

  return result;
};

/**
 * 菜单工具对象
 */
export const menuUtils = {
  buildFlatMenuFromPages,
  buildNestedMenuFromRoutes,
  findMenuItemByPath,
  flattenMenuItems,
  filterMenuItems,
};
