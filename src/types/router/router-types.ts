import type { RouteRecordRaw } from "vue-router";

export type RouterMeta = {
  // 页面标题
  title: string;
  // 页面图标
  icon?: string;
  // 是否隐藏在菜单中
  hidden?: boolean;
  // 是否缓存页面,默认缓存 (兼容旧版本)
  keepalive?: boolean;
  // 是否不缓存页面 (兼容旧版本)
  noCache?: boolean;
  // 是否为固定页面
  affix?: boolean;
  // 是否为无实际页面的路由（如父级路由）
  noPage?: boolean;

  // ==================== 多实例配置 ====================
  // 是否允许创建多个实例
  allowMultiple?: boolean;
  // 兼容性配置：是否支持多实例
  multipleInstances?: boolean;
  // 是否为表单组件（自动启用多实例）
  formComponent?: boolean;
  // 是否为可编辑组件（自动启用多实例）
  editableComponent?: boolean;
  // 是否为弹窗组件（自动启用多实例）
  modalComponent?: boolean;
  // 是否为动态组件（自动启用多实例）
  dynamicComponent?: boolean;
};

export type CustomRouterRecordRaw = RouteRecordRaw & {
  meta: RouterMeta;
};
