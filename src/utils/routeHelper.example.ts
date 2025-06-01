/**
 * RouteHelper 使用示例
 * 
 * 这个文件展示了如何使用 routeHelper.ts 中的各种功能
 */

import { routes } from "@/router";
import { 
  RouteHelper,
  buildFullPath,
  buildFullPathByComponentName,
  flatternRoutes,
  findRouteByName,
  findRouteByPath,
  findRouteByComponentName,
  buildRouteTree,
  getBreadcrumbPath
} from "./routeHelper";

// ==================== 基础路径构建示例 ====================

// 1. 基础路径构建
console.log("基础路径构建:");
console.log(buildFullPath("user", "/system")); // 输出: /system/user
console.log(buildFullPath("/dashboard", "/system")); // 输出: /dashboard (绝对路径)

// 2. 根据组件名称构建路径
console.log("\n根据组件名称构建路径:");
console.log(buildFullPathByComponentName("UserManagement")); // 输出: /user-management
console.log(buildFullPathByComponentName("PageManager", "/system")); // 输出: /system/page-manager

// ==================== 路由查找示例 ====================

// 3. 扁平化路由列表
console.log("\n扁平化路由列表:");
const flatRoutes = flatternRoutes(routes);
console.log(`总共有 ${flatRoutes.length} 个路由`);
flatRoutes.forEach(route => {
  console.log(`- ${route.title} (${route.path})`);
});

// 4. 根据名称查找路由
console.log("\n根据名称查找路由:");
const userRoute = findRouteByName(routes, "User");
if (userRoute) {
  console.log(`找到用户管理路由: ${userRoute.title} - ${userRoute.path}`);
}

// 5. 根据路径查找路由
console.log("\n根据路径查找路由:");
const dashboardRoute = findRouteByPath(routes, "/dashboard");
if (dashboardRoute) {
  console.log(`找到仪表盘路由: ${dashboardRoute.title} - ${dashboardRoute.path}`);
}

// 6. 根据组件名称查找路由
console.log("\n根据组件名称查找路由:");
const roleRoute = findRouteByComponentName(routes, "Role");
if (roleRoute) {
  console.log(`找到角色管理路由: ${roleRoute.title} - ${roleRoute.path}`);
}

// ==================== 路由树结构示例 ====================

// 7. 构建路由树结构
console.log("\n路由树结构:");
const routeTree = buildRouteTree(routes);
function printRouteTree(routes: any[], level = 0) {
  const indent = "  ".repeat(level);
  routes.forEach(route => {
    console.log(`${indent}- ${route.title} (${route.path})`);
    if (route.children && route.children.length > 0) {
      printRouteTree(route.children, level + 1);
    }
  });
}
printRouteTree(routeTree);

// ==================== 面包屑路径示例 ====================

// 8. 获取面包屑路径
console.log("\n面包屑路径示例:");
const breadcrumbs = getBreadcrumbPath(routes, "/system/user");
console.log("当前路径 /system/user 的面包屑:");
breadcrumbs.forEach((crumb, index) => {
  console.log(`${index + 1}. ${crumb.title} (${crumb.path})`);
});

// ==================== RouteHelper 类使用示例 ====================

// 9. 使用 RouteHelper 类
console.log("\n使用 RouteHelper 类:");
const routeHelper = new RouteHelper(routes);

// 获取所有可访问的路由
const accessibleRoutes = routeHelper.getAccessibleRoutes();
console.log(`可访问的路由数量: ${accessibleRoutes.length}`);

// 获取所有固定页面
const affixRoutes = routeHelper.getAffixRoutes();
console.log(`固定页面数量: ${affixRoutes.length}`);
affixRoutes.forEach(route => {
  console.log(`- 固定页面: ${route.title} (${route.path})`);
});

// 获取所有需要缓存的路由
const cacheableRoutes = routeHelper.getCacheableRoutes();
console.log(`需要缓存的路由数量: ${cacheableRoutes.length}`);

// 根据组件名称构建路径
const componentPath = routeHelper.buildPathByComponentName("NewComponent", "/custom");
console.log(`新组件路径: ${componentPath}`); // 输出: /custom/new-component

// ==================== 实际应用场景示例 ====================

// 10. 实际应用场景
console.log("\n实际应用场景:");

// 场景1: 动态菜单生成
function generateMenu() {
  const menuRoutes = routeHelper.getAccessibleRoutes().filter(route => !route.noPage);
  return menuRoutes.map(route => ({
    label: route.title,
    path: route.path,
    icon: route.icon
  }));
}

// 场景2: 页面标题生成
function getPageTitle(currentPath: string): string {
  const route = routeHelper.findByPath(currentPath);
  return route ? route.title : "未知页面";
}

// 场景3: 权限检查
function hasPermission(routeName: string, userPermissions: string[]): boolean {
  const route = routeHelper.findByName(routeName);
  if (!route) return false;
  
  // 假设路由的 meta 中有 permission 字段
  const requiredPermission = route.meta?.permission;
  if (!requiredPermission) return true; // 无权限要求的路由默认可访问
  
  return userPermissions.includes(requiredPermission);
}

// 场景4: 路由缓存管理
function getCacheKeys(): string[] {
  return routeHelper.getCacheableRoutes()
    .map(route => route.name)
    .filter(name => name) as string[];
}

console.log("动态菜单项:", generateMenu().slice(0, 3)); // 显示前3个菜单项
console.log("页面标题:", getPageTitle("/dashboard"));
console.log("缓存键:", getCacheKeys().slice(0, 3)); // 显示前3个缓存键

// ==================== 高级用法示例 ====================

// 11. 高级用法：路由匹配和过滤
console.log("\n高级用法:");

// 按图标分组路由
function groupRoutesByIcon() {
  const routes = routeHelper.getAccessibleRoutes();
  const grouped: Record<string, any[]> = {};
  
  routes.forEach(route => {
    const icon = route.icon || "default";
    if (!grouped[icon]) {
      grouped[icon] = [];
    }
    grouped[icon].push(route);
  });
  
  return grouped;
}

// 查找相似路径的路由
function findSimilarRoutes(targetPath: string) {
  const routes = routeHelper.getFlatRoutes();
  const pathSegments = targetPath.split("/").filter(s => s);
  
  return routes.filter(route => {
    const routeSegments = route.path.split("/").filter(s => s);
    return pathSegments.some(segment => 
      routeSegments.some(routeSegment => 
        routeSegment.includes(segment) || segment.includes(routeSegment)
      )
    );
  });
}

const groupedByIcon = groupRoutesByIcon();
console.log("按图标分组的路由数量:", Object.keys(groupedByIcon).length);

const similarRoutes = findSimilarRoutes("/system");
console.log("与 /system 相似的路由:", similarRoutes.map(r => r.path));

export {
  routeHelper,
  generateMenu,
  getPageTitle,
  hasPermission,
  getCacheKeys,
  groupRoutesByIcon,
  findSimilarRoutes
};
