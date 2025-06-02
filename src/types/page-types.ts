/**
 * 页面对象接口 - 统一的页面信息管理
 */
export interface PageObject {
  // 基础信息
  name: string; // 路由名称
  title: string; // 页面标题
  path: string; // 路由路径
  fullPath: string; // 完整路径（包含参数）
  key: string; // 组件key，用于强制刷新

  // 显示信息
  icon?: string; // 图标
  hidden?: boolean; // 是否隐藏

  // 页面状态
  cached: boolean; // 当前是否已缓存
  active: boolean; // 是否当前激活
}

/**
 * 菜单项接口 - 用于侧边栏菜单
 */
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  hidden?: boolean;
  children?: MenuItem[];
  meta?: Record<string, any>;
  clickable: boolean; // 是否可点击（有实际页面）
}

/**
 * 面包屑项接口
 */
export interface BreadcrumbItem {
  title: string;
  path: string;
  icon?: string;
  clickable: boolean;
}

/**
 * 页面管理配置
 */
export interface PageManagerConfig {
  maxCacheSize: number; // 最大缓存数量
  defaultKeepAlive: boolean; // 默认是否缓存
  enableMultiInstance: boolean; // 是否启用多实例
}

/**
 * 路由扁平化选项
 */
export interface FlattenRouteOptions {
  includeHidden?: boolean; // 是否包含隐藏路由
  includeNoPage?: boolean; // 是否包含无页面路由
  basePath?: string; // 基础路径
}

/**
 * 页面操作类型
 */
export enum PageActionType {
  ADD = "add",
  REMOVE = "remove",
  UPDATE = "update",
  ACTIVATE = "activate",
  CACHE = "cache",
  UNCACHE = "uncache",
}

/**
 * 页面操作事件
 */
export interface PageActionEvent {
  type: PageActionType;
  page: PageObject;
  timestamp: number;
}
