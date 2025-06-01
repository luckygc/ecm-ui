# App Store 使用指南

## 概述

优化后的 App Store 使用 Vue 3 组合API重写，提供了更强大的组件刷新功能和更清晰的状态管理。

## 主要功能

### 1. 侧边栏管理
- 支持打开/关闭/切换侧边栏
- 支持动画控制
- 移动设备自动关闭侧边栏

### 2. 设备和主题管理
- 设备类型检测（桌面/移动）
- 主题切换（亮色/暗色）
- 响应式状态管理

### 3. 组件刷新系统
- 支持单个组件刷新
- 支持批量组件刷新
- 支持 KeepAlive 组件刷新
- 动态组件键管理

## API 参考

### 状态属性

```typescript
// 侧边栏配置
sidebarConfig: Ref<SidebarConfig>
deviceType: Ref<DeviceType>
themeType: Ref<ThemeType>
mainContentKey: Ref<string>
componentKeys: Ref<ComponentKeys>
```

### 计算属性

```typescript
// 侧边栏状态
isSidebarOpened: ComputedRef<boolean>
currentDevice: ComputedRef<DeviceType>
currentTheme: ComputedRef<ThemeType>
currentMainContentKey: ComputedRef<string>
allComponentKeys: ComputedRef<ComponentKeys>
isMobileDevice: ComputedRef<boolean>
isDarkTheme: ComputedRef<boolean>
```

### 方法

#### 侧边栏操作
```typescript
toggleSidebar(): void              // 切换侧边栏状态
closeSidebar(withoutAnimation?: boolean): void  // 关闭侧边栏
openSidebar(withoutAnimation?: boolean): void   // 打开侧边栏
```

#### 设备和主题
```typescript
setDeviceType(device: DeviceType): void  // 设置设备类型
setTheme(theme: ThemeType): void         // 设置主题
toggleTheme(): void                      // 切换主题
```

#### 组件刷新
```typescript
refreshMainContent(): void                           // 刷新主内容区域
refreshComponent(componentName: string): void        // 刷新指定组件
getComponentKey(componentName: string): string       // 获取组件刷新键
refreshMultipleComponents(componentNames: string[]): void  // 批量刷新组件
refreshAllComponents(): void                         // 刷新所有组件
addComponentKey(componentName: string, initialKey?: string): void  // 添加组件键
removeComponentKey(componentName: string): void      // 移除组件键
```

## 使用示例

### 基础使用

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 获取状态
const isSidebarOpen = computed(() => appStore.isSidebarOpened)
const currentTheme = computed(() => appStore.currentTheme)

// 操作方法
const toggleSidebar = () => appStore.toggleSidebar()
const switchTheme = () => appStore.toggleTheme()
</script>
```

### KeepAlive 组件刷新

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 获取组件刷新键
const componentKey = computed(() => appStore.getComponentKey('dashboard'))

// 刷新组件
const refreshComponent = () => {
  appStore.refreshComponent('dashboard')
}
</script>

<template>
  <keep-alive>
    <component 
      :is="DashboardComponent" 
      :key="componentKey"
    />
  </keep-alive>
</template>
```

### 批量刷新组件

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 刷新多个相关组件
const refreshRelatedComponents = () => {
  appStore.refreshMultipleComponents([
    'user-list',
    'user-detail',
    'user-statistics'
  ])
}

// 刷新所有组件（除了侧边栏、标签栏、头部）
const refreshAllContent = () => {
  appStore.refreshAllComponents()
}
</script>
```

## 最佳实践

### 1. 组件命名规范
- 使用 kebab-case 命名组件键
- 组件键应该与路由名称保持一致
- 避免使用特殊字符

### 2. 刷新策略
- 单个组件更新：使用 `refreshComponent()`
- 相关组件更新：使用 `refreshMultipleComponents()`
- 全局刷新：使用 `refreshAllComponents()`

### 3. 性能优化
- 避免频繁调用刷新方法
- 合理使用批量刷新
- 及时清理不需要的组件键

### 4. 兼容性
- 保留了原有的 API 方法以确保向后兼容
- 新项目建议使用新的 API
- 旧项目可以逐步迁移

## 迁移指南

### 从旧版本迁移

```typescript
// 旧版本
appStore.getSidebarStatus  // ✅ 仍然可用
appStore.getDevice         // ✅ 仍然可用
appStore.getTheme          // ✅ 仍然可用
appStore.getRefreshKey     // ✅ 仍然可用

// 新版本（推荐）
appStore.isSidebarOpened   // ✨ 新的推荐方式
appStore.currentDevice     // ✨ 新的推荐方式
appStore.currentTheme      // ✨ 新的推荐方式
appStore.currentMainContentKey  // ✨ 新的推荐方式
```

### 新功能使用

```typescript
// 组件刷新功能
appStore.refreshComponent('dashboard')
appStore.getComponentKey('user-management')
appStore.addComponentKey('new-feature')

// 主题切换
appStore.toggleTheme()
appStore.isDarkTheme

// 设备检测
appStore.isMobileDevice
appStore.setDeviceType('mobile')
```

## 注意事项

1. **组件键管理**：确保组件键的唯一性，避免冲突
2. **内存管理**：及时清理不再使用的组件键
3. **性能考虑**：避免在高频操作中使用刷新功能
4. **类型安全**：充分利用 TypeScript 类型检查
