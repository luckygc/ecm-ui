# 统一页面管理系统

## 概述

本项目实现了一个统一的页面管理系统，通过页面对象来管理路由、缓存、菜单、面包屑等所有页面相关功能。

## 核心特性

### 1. 统一页面对象管理
- 所有页面信息统一存储在页面对象中
- 支持页面的创建、更新、删除、缓存管理
- 自动处理多实例组件的命名和缓存

### 2. 智能路由处理
- 自动扁平化路由配置
- 动态创建页面对象
- 支持带参数的路由多开

### 3. KeepAlive 缓存管理
- 基于组件名称的精确缓存控制
- 支持最大缓存数量限制
- 自动清理过期缓存

### 4. 多实例组件支持
- 自动为多实例组件生成唯一名称
- 支持表单、弹窗、编辑等场景的多开
- 每个实例独立缓存和管理

### 5. UI组件统一渲染
- 页签栏基于页面对象渲染
- 侧边栏菜单支持嵌套结构
- 面包屑导航自动生成

## 文件结构

```
src/
├── types/
│   └── page-types.ts          # 页面对象类型定义
├── stores/
│   └── page-store.ts          # 统一页面管理store
├── utils/
│   └── page-wrapper.ts        # 页面包裹组件工具
├── layout/
│   ├── Layout.vue             # 主布局组件
│   └── components/
│       ├── UnifiedMainContent.vue  # 统一主内容区
│       ├── TabBar.vue         # 页签栏
│       ├── Sidebar.vue        # 侧边栏
│       └── Navbar.vue         # 导航栏（面包屑）
└── views/
    └── test/
        └── page-manager-test.vue  # 页面管理测试页面
```

## 核心API

### PageStore

```typescript
// 初始化页面管理系统
pageStore.initializePageSystem(router)

// 处理路由变化
pageStore.handleRouteChange(route)

// 页面操作
pageStore.addToCache(page)
pageStore.removeFromCache(page)
pageStore.removePage(page)
pageStore.closeOtherPages(page)
pageStore.closeAllPages()

// 状态获取
pageStore.activePage        // 当前激活页面
pageStore.visitedPages      // 已访问页面列表
pageStore.cachedPages       // 已缓存页面列表
pageStore.keepAliveInclude  // KeepAlive include列表
pageStore.breadcrumbs       // 面包屑导航
pageStore.nestedMenuItems   // 嵌套菜单项
```

### 页面对象 (PageObject)

```typescript
interface PageObject {
  id: string                    // 唯一标识符
  name: string                  // 路由名称
  title: string                 // 页面标题
  path: string                  // 路由路径
  fullPath: string              // 完整路径
  componentName: string         // 组件名称
  icon?: string                 // 图标
  keepalive: boolean            // 是否缓存
  cached: boolean               // 当前是否已缓存
  allowMultiple: boolean        // 是否允许多实例
  visited: boolean              // 是否已访问
  affix: boolean                // 是否固定
  active: boolean               // 是否当前激活
  meta: Record<string, any>     // 路由meta信息
  params: Record<string, any>   // 路由参数
  query: Record<string, any>    // 查询参数
  createdAt: number             // 创建时间
  lastVisitedAt: number         // 最后访问时间
}
```

## 路由配置

### 基础路由配置

```typescript
{
  path: "user",
  name: "User",
  component: () => import("@/views/system/user/UserManagement.vue"),
  meta: { 
    title: "用户管理", 
    icon: "User",
    keepalive: true  // 默认缓存
  }
}
```

### 多实例路由配置

```typescript
{
  path: "form-test",
  name: "FormTest",
  component: () => import("@/views/test/form-test.vue"),
  meta: {
    title: "表单测试页",
    icon: "Edit",
    allowMultiple: true,     // 允许多实例
    formComponent: true,     // 表单组件标识
  }
}
```

### 不缓存路由配置

```typescript
{
  path: "no-cache-test",
  name: "NoCacheTest",
  component: () => import("@/views/test/no-cache-test.vue"),
  meta: { 
    title: "不缓存测试页", 
    icon: "Warning", 
    keepalive: false  // 不缓存
  }
}
```

## 组件命名规范

为了避免Vue组件名称冲突，所有组件文件都使用具体的名称而不是`index.vue`：

- ✅ `UserManagement.vue`
- ✅ `RoleManagement.vue`
- ✅ `Dashboard.vue`
- ❌ `index.vue`

每个组件都应该在`<script setup>`中指定`name`属性：

```vue
<script setup lang="ts" name="UserManagement">
// 组件逻辑
</script>
```

## KeepAlive 修复

修复了KeepAlive组件的嵌套问题：

```vue
<!-- ✅ 正确的结构 -->
<keep-alive :include="includeList">
  <transition name="fade-transform" mode="out-in">
    <component :is="Component" :key="componentKey" />
  </transition>
</keep-alive>

<!-- ❌ 错误的结构 -->
<transition name="fade-transform" mode="out-in">
  <keep-alive :include="includeList">
    <component :is="Component" :key="componentKey" />
  </keep-alive>
</transition>
```

## 使用示例

### 1. 初始化系统

```typescript
// 在 Layout.vue 中
import { usePageStore } from '@/stores/page-store'

const pageStore = usePageStore()

onMounted(() => {
  pageStore.initializePageSystem(router)
})
```

### 2. 页面操作

```typescript
// 关闭其他页面
pageStore.closeOtherPages(currentPage)

// 关闭所有页面
pageStore.closeAllPages()

// 刷新页面缓存
pageStore.removeFromCache(currentPage)
```

### 3. 获取页面信息

```typescript
// 当前激活页面
const activePage = computed(() => pageStore.activePage)

// 已访问页面列表
const visitedPages = computed(() => pageStore.visitedPages)

// 面包屑导航
const breadcrumbs = computed(() => pageStore.breadcrumbs)
```

## 测试页面

访问 `/system/page-manager-test` 可以查看页面管理系统的详细状态和进行各种操作测试。

## 优势

1. **统一管理**：所有页面相关功能集中在一个store中管理
2. **类型安全**：完整的TypeScript类型定义
3. **性能优化**：智能的缓存管理和清理机制
4. **易于扩展**：清晰的架构便于添加新功能
5. **调试友好**：详细的日志和测试页面

## 兼容性

系统保持了与旧版本API的兼容性，原有的`page-utils.ts`中的方法仍然可以使用，但建议逐步迁移到新的页面管理系统。
