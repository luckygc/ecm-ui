import type { RouteRecordRaw } from "vue-router";

export type RouterMeta = {
  // 页面标题
  title: string;
  // 页面图标
  icon?: string;
  // 是否隐藏在菜单中
  hidden?: boolean;
  // 是否缓存页面,默认缓存
  keepalive?: boolean;
};

export type CustomRouterRecordRaw = RouteRecordRaw & {
  meta: RouterMeta;
};
