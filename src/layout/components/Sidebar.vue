<script setup lang="ts">
import { routes } from '@/router'
import { buildFullPath } from '@/utils/routeHelper'
import { Expand, Fold } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMenu } from 'element-plus'
import { computed, ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import MenuItems from './MenuItems.vue'

const route = useRoute()

const sidebarOpened = ref(true);
const activeMenu = computed(() => route.fullPath)

// 递归过滤路由，只显示meta.menu=true的路由，并计算完整路径
function filterMenuRoutes(routeList: RouteRecordRaw[], parentPath = ''): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  for (const route of routeList) {
    const meta = route.meta || {}

    // 跳过隐藏的路由
    if (meta.hidden) continue

    // 只显示meta.menu=true的路由
    if (meta.menu === true) {
      console.debug(route.path);
      // 计算完整路径
      const fullPath = buildFullPath(route.path, parentPath)

      const newRoute = {
        ...route,
        // 将完整路径存储在path中，这样MenuItems组件就可以直接使用
        path: fullPath
      }

      // 处理子路由
      if (route.children && route.children.length > 0) {
        const children = filterMenuRoutes(route.children, fullPath)
        if (children.length > 0) {
          newRoute.children = children
        } else {
          newRoute.children = []
        }
      }

      result.push(newRoute)
    }
  }

  return result
}

// 获取菜单路由
const menuRoutes = filterMenuRoutes(routes);
</script>

<template>
  <div class="sidebar-wrapper">
    <!-- Logo区域 -->
    <div class="logo-container" :class="{ 'collapsed': !sidebarOpened }">
      <div class="logo-content">
        <!-- Logo图片 -->
        <div class="logo-image" @click="!sidebarOpened && (sidebarOpened = !sidebarOpened)">
          <img src="/logo.svg" alt="Logo" class="logo-img" />
        </div>

        <!-- 展开状态：Logo文字和折叠按钮 -->
        <div v-if="sidebarOpened" class="logo-text-wrapper">
          <span class="logo-text">Repodar</span>
          <ElButton :icon="Fold" @click="sidebarOpened = !sidebarOpened" class="collapse-btn" text size="small" />
        </div>

        <!-- 折叠状态：展开提示 -->
        <div v-else class="expand-hint" @click="sidebarOpened = !sidebarOpened">
          <ElIcon class="expand-icon">
            <Expand />
          </ElIcon>
        </div>
      </div>
    </div>

    <!-- 菜单区域 -->
    <div class="menu-container">
      <ElMenu :default-active="activeMenu" :collapse="!sidebarOpened" mode="vertical" class="sidebar-menu" router>
        <MenuItems :routes="menuRoutes" />
      </ElMenu>
    </div>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.logo-container {
  height: 60px;
  background-color: #fff;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease;
}

.logo-container.collapsed {
  cursor: pointer;
}

.logo-container.collapsed:hover {
  background-color: #f5f7fa;
}

.logo-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
}

.logo-image {
  flex-shrink: 0;
}

.logo-container.collapsed .logo-image {
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  transition: all 0.3s ease;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-btn {
  color: #606266;
  transition: all 0.3s ease;
  border-radius: 4px;
  padding: 4px;
  flex-shrink: 0;
}

.collapse-btn:hover {
  color: #409eff;
  background-color: #f5f7fa;
}

.expand-hint {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  margin: 0 4px;
  transition: all 0.3s ease;
}

.expand-icon {
  font-size: 16px;
  color: #606266;
  transition: all 0.3s ease;
}

.logo-container.collapsed:hover .expand-icon {
  color: #409eff;
  transform: scale(1.1);
}

.menu-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}
</style>
