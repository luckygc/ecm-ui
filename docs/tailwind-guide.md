# Tailwind CSS v4 使用指南

## 简介

本项目已集成 Tailwind CSS v4，这是一个全新版本的框架，针对性能和灵活性进行了优化，具有重新设计的配置和自定义体验。

## 基本用法

Tailwind CSS 的核心理念是通过组合各种工具类来构建界面，而不是编写自定义 CSS。例如：

```html
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-xl font-bold text-gray-800">标题</h2>
  <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    按钮
  </button>
</div>
```

## Tailwind CSS v4 新特性

### 简化的安装和配置

- **单行 CSS 导入**：只需 `@import "tailwindcss"` 即可开始使用
- **零配置**：无需配置文件即可开始使用框架
- **自动内容检测**：自动发现所有模板文件，无需配置

### CSS-first 配置

v4 使用 CSS 而不是 JavaScript 来配置项目：

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --color-brand-500: oklch(0.84 0.18 117.33);
}
```

### 高性能引擎

- 完整构建速度提升 3.5 倍以上
- 增量构建速度提升 8 倍以上
- 无新 CSS 的增量构建速度提升 100 倍以上

## 与 Element Plus 的兼容性

本项目同时使用了 Tailwind CSS v4 和 Element Plus。为了避免样式冲突，我们已经在 Tailwind 配置中禁用了 preflight（预设样式重置）。

这意味着：

1. Element Plus 组件的样式不会被 Tailwind 覆盖
2. 可以在 Element Plus 组件上使用 Tailwind 的工具类来进行微调

例如：

```html
<el-button type="primary" class="mt-4 shadow-md hover:shadow-lg">
  带有 Tailwind 样式的按钮
</el-button>
```

## 自定义工具类和组件

我们已经创建了一些自定义的 Tailwind 组件和工具类，位于 `src/assets/tailwind-utils.css`。在 v4 中，我们使用新的 `@utility` 指令来定义自定义工具类。

### 自定义组件

```html
<!-- 卡片组件 -->
<div class="tw-card">
  卡片内容
</div>

<!-- 按钮组件 -->
<button class="tw-btn-primary">主要按钮</button>
<button class="tw-btn-success">成功按钮</button>
<button class="tw-btn-warning">警告按钮</button>
<button class="tw-btn-danger">危险按钮</button>
```

### 自定义工具类

```html
<!-- 文字阴影 -->
<h2 class="text-shadow">带阴影的文字</h2>

<!-- 过渡效果 -->
<div class="transition-fast hover:scale-105">
  快速过渡效果
</div>
<div class="transition-normal hover:scale-105">
  普通过渡效果
</div>
<div class="transition-slow hover:scale-105">
  缓慢过渡效果
</div>
```

## 响应式设计

Tailwind 提供了强大的响应式设计工具，可以根据不同的屏幕尺寸应用不同的样式：

```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- 在小屏幕上宽度为100%，中等屏幕为50%，大屏幕为33.33% -->
</div>
```

响应式前缀：
- `sm:` - 640px 以上
- `md:` - 768px 以上
- `lg:` - 1024px 以上
- `xl:` - 1280px 以上
- `2xl:` - 1536px 以上

## 深色模式

如果需要支持深色模式，可以使用 `dark:` 前缀：

```html
<div class="bg-white text-black dark:bg-gray-800 dark:text-white">
  <!-- 在浅色模式下背景为白色，文字为黑色；在深色模式下背景为深灰色，文字为白色 -->
</div>
```

## 更多资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Tailwind CSS 速查表](https://tailwindcomponents.com/cheatsheet/)
- [Tailwind UI](https://tailwindui.com/) - 官方组件库（部分付费）
