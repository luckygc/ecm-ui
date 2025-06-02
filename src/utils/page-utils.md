# 页面工具 (page-utils.ts)

统一的页面组件包裹和缓存管理工具，按照您的思路实现的简化版本。

## 核心功能

### 1. 组件名称计算 (`computeComponentName`)

根据路由信息自动生成唯一的组件名称：

- **单实例组件**: 直接使用路由名称，如 `UserManagement`
- **多实例组件**: 路由名称 + 序号，如 `FormTest_1`, `FormTest_2`
- **不缓存组件**: 返回原始组件名或 `Anonymous`

```typescript
// 示例用法
const componentName = computeComponentName(route, component)
console.log(componentName) // 输出: "UserManagement" 或 "FormTest_1"
```

### 2. 组件包裹 (`wrapperComponent`)

创建包裹组件，动态设置组件名称：

```typescript
// 自动包裹组件并设置动态名称
const WrappedComponent = wrapperComponent(route, component)
```

包裹组件特性：

- 动态设置 `name` 属性用于 KeepAlive
- 使用 `fullPath` 作为 `key` 确保唯一性
- 传递路由信息给被包裹的组件

### 3. 页面管理工具 (`page`)

提供页面缓存的增删改查操作：

```typescript
// 添加页面到缓存
const componentName = page.add(route)

// 从缓存中移除页面
page.remove(route) // 或 page.remove(componentName)

// 检查页面是否在缓存中
const exists = page.has(route)

// 清理所有缓存
page.clear()

// 获取映射信息
const mapping = page.getMapping()
```

## 多实例支持

通过路由 meta 配置启用多实例：

```typescript
// 路由配置示例
{
  path: "form/:id",
  name: "FormEdit",
  component: () => import("@/views/form/edit.vue"),
  meta: { 
    title: "表单编辑", 
    multi: true,  // 启用多实例
    // 或者使用其他配置
    allowMultiple: true,
    formComponent: true,
    editableComponent: true,
    modalComponent: true,
    dynamicComponent: true
  }
}
```

## 缓存控制

通过路由 meta 控制缓存行为：

```typescript
// 不缓存的路由
{
  path: "login",
  name: "Login",
  component: () => import("@/views/login/index.vue"),
  meta: { 
    title: "登录", 
    keepalive: false  // 不缓存
  }
}
```

## 与 UnifiedMainContent 集成

在 `UnifiedMainContent.vue` 中使用：

```vue
<template>
  <keep-alive :include="includeList" :exclude="excludeList">
    <component 
      :is="wrapperComponent(route, Component)"
      :key="route.fullPath"
    />
  </keep-alive>
</template>
```

## 调试信息

工具会在控制台输出详细的调试信息：

```text
[PageUtils] 添加页面到缓存: UserManagement_1 (/system/user/123)
[PageUtils] 从缓存移除页面: UserManagement_1 (/system/user/123)
[PageUtils] 清理所有页面缓存
```

## 优势

1. **简化架构**: 删除了多余的布局组件，统一使用一套实现
2. **自定义命名**: 支持包裹组件的自定义命名
3. **多实例支持**: 智能处理带参数的路由多开
4. **缓存管理**: 完整的页面缓存增删改查
5. **调试友好**: 详细的日志输出和状态跟踪

## 注意事项

1. 确保路由配置中有正确的 `name` 属性
2. 多实例路由需要在 meta 中配置相应标识
3. 组件名称会被缓存，避免重复计算
4. 使用 `fullPath` 作为唯一标识，支持参数化路由
