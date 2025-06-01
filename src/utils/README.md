# RouteHelper 路由助手工具

## 概述

`routeHelper.ts` 是一个强大的路由管理工具，提供了统一的路由操作接口，支持按组件名称构建路径、路由查找、路径拼接等功能。

## 主要功能

### 1. 路径构建

#### 基础路径构建
```typescript
import { buildFullPath } from '@/utils/routeHelper';

// 相对路径拼接
buildFullPath('user', '/system'); // 输出: /system/user

// 绝对路径处理
buildFullPath('/dashboard', '/system'); // 输出: /dashboard
```

#### 根据组件名称构建路径
```typescript
import { buildFullPathByComponentName } from '@/utils/routeHelper';

// 驼峰命名转换为路径格式
buildFullPathByComponentName('UserManagement'); // 输出: /user-management
buildFullPathByComponentName('PageManager', '/system'); // 输出: /system/page-manager
```

### 2. 路由查找

#### 多种查找方式
```typescript
import { 
  findRouteByName, 
  findRouteByPath, 
  findRouteByComponentName 
} from '@/utils/routeHelper';
import { routes } from '@/router';

// 根据名称查找
const userRoute = findRouteByName(routes, 'User');

// 根据路径查找
const dashboardRoute = findRouteByPath(routes, '/dashboard');

// 根据组件名称查找
const roleRoute = findRouteByComponentName(routes, 'Role');
```

### 3. 路由结构处理

#### 扁平化路由列表
```typescript
import { flatternRoutes } from '@/utils/routeHelper';

const flatRoutes = flatternRoutes(routes);
console.log(`总共有 ${flatRoutes.length} 个路由`);
```

#### 构建路由树结构
```typescript
import { buildRouteTree } from '@/utils/routeHelper';

const routeTree = buildRouteTree(routes);
// 保持原有的层级关系
```

#### 面包屑路径生成
```typescript
import { getBreadcrumbPath } from '@/utils/routeHelper';

const breadcrumbs = getBreadcrumbPath(routes, '/system/user');
// 返回从根路径到当前路径的完整面包屑
```

### 4. RouteHelper 类

提供面向对象的路由操作接口：

```typescript
import { RouteHelper } from '@/utils/routeHelper';
import { routes } from '@/router';

const routeHelper = new RouteHelper(routes);

// 获取扁平化路由
const flatRoutes = routeHelper.getFlatRoutes();

// 获取路由树
const routeTree = routeHelper.getRouteTree();

// 查找路由
const route = routeHelper.findByName('User');

// 获取面包屑
const breadcrumbs = routeHelper.getBreadcrumbs('/system/user');

// 获取特定类型的路由
const accessibleRoutes = routeHelper.getAccessibleRoutes(); // 非隐藏路由
const affixRoutes = routeHelper.getAffixRoutes(); // 固定页面
const cacheableRoutes = routeHelper.getCacheableRoutes(); // 需要缓存的路由

// 根据组件名称构建路径
const path = routeHelper.buildPathByComponentName('NewComponent', '/custom');
```

## 实际应用场景

### 1. 动态菜单生成
```typescript
function generateMenu() {
  const routeHelper = new RouteHelper(routes);
  const menuRoutes = routeHelper.getAccessibleRoutes().filter(route => !route.noPage);
  
  return menuRoutes.map(route => ({
    label: route.title,
    path: route.path,
    icon: route.icon
  }));
}
```

### 2. 页面标题管理
```typescript
function getPageTitle(currentPath: string): string {
  const routeHelper = new RouteHelper(routes);
  const route = routeHelper.findByPath(currentPath);
  return route ? route.title : "未知页面";
}
```

### 3. 权限检查
```typescript
function hasPermission(routeName: string, userPermissions: string[]): boolean {
  const routeHelper = new RouteHelper(routes);
  const route = routeHelper.findByName(routeName);
  
  if (!route) return false;
  
  const requiredPermission = route.meta?.permission;
  if (!requiredPermission) return true;
  
  return userPermissions.includes(requiredPermission);
}
```

### 4. 路由缓存管理
```typescript
function getCacheKeys(): string[] {
  const routeHelper = new RouteHelper(routes);
  return routeHelper.getCacheableRoutes()
    .map(route => route.name)
    .filter(name => name) as string[];
}
```

## 类型定义

### RouteMeta
```typescript
interface RouteMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
  affix?: boolean;
  noCache?: boolean;
  noPage?: boolean;
  [key: string]: any;
}
```

### RouteInfo
```typescript
interface RouteInfo {
  path: string;
  name?: string;
  title: string;
  icon?: string;
  component?: any;
  children?: RouteInfo[];
  meta?: RouteMeta;
  hidden?: boolean;
  affix?: boolean;
  noCache?: boolean;
  noPage?: boolean;
}
```

## 与现有代码的集成

### route-store.ts 集成
`routeHelper.ts` 已经与现有的 `route-store.ts` 完全集成：

- 移除了重复的工具函数和类型定义
- 通过导入使用统一的路径构建和路由信息创建逻辑
- 保持了向后兼容性

### 使用建议

1. **新项目**：直接使用 `RouteHelper` 类进行路由操作
2. **现有项目**：可以逐步迁移到新的工具函数，保持向后兼容
3. **性能考虑**：对于频繁调用的场景，建议缓存 `RouteHelper` 实例

## 示例文件

查看 `src/utils/routeHelper.example.ts` 获取更多详细的使用示例和高级用法。

## 主要改进

1. **修复了路径构建逻辑**：使用 `route.path` 而不是 `route.name` 构建路径
2. **添加了组件名称路径构建**：支持根据组件名称自动生成路径
3. **提供了统一的工具函数**：避免代码重复，提高可维护性
4. **增加了面向对象接口**：`RouteHelper` 类提供更便捷的操作方式
5. **完善了类型定义**：提供完整的 TypeScript 类型支持
6. **增强了查找功能**：支持多种查找方式和过滤条件
