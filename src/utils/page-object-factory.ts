import type { RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import type { PageObject } from "@/types/page-types";

/**
 * 页面对象工厂
 * 负责创建和管理 PageObject
 */

/**
 * 从路由记录创建页面对象
 */
export const createPageObjectFromRoute = (
  route: RouteRecordRaw,
  fullPath: string
): PageObject => {
  const meta = route.meta || {};

  const componentName = String(route.name || "");

  return {
    name: componentName,
    title: (meta.title as string) || componentName || "未命名页面",
    path: route.path,
    fullPath,
    key: componentName, // 默认使用组件名称作为key
    icon: meta.icon as string,
    hidden: !!meta.hidden,
    cached: false,
    active: false,
  };
};

/**
 * 从路由位置创建页面对象
 */
export const createPageObjectFromLocation = (
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
    cached: false,
    active: false,
  };
};

/**
 * 页面对象工厂
 */
export const pageObjectFactory = {
  createFromRoute: createPageObjectFromRoute,
  createFromLocation: createPageObjectFromLocation,
};
