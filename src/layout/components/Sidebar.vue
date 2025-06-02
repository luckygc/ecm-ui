<script setup lang="ts">
import {routes} from '@/router'
import {useAppStore} from '@/stores/modules/app-store.ts'
import {Expand, Fold} from '@element-plus/icons-vue'
import {ElButton, ElIcon, ElMenu} from 'element-plus'
import {useRoute, useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import MenuItems from './MenuItems.vue'

const router = useRouter()

const appStore = useAppStore()
const {toggleSidebar} = appStore;
const {isSidebarOpened} = storeToRefs(appStore)

const route = useRoute();

// 处理菜单点击事件
function handleMenuSelect(routeName: string) {
  router.push({name: routeName})
}
</script>

<template>
  <div class="sidebar-wrapper">
    <!-- Logo区域 -->
    <div class="logo-container" :class="{ 'collapsed': !isSidebarOpened }">
      <div class="logo-content">
        <!-- Logo图片 -->
        <div class="logo-image" @click="!isSidebarOpened && toggleSidebar()">
          <img src="/logo.svg" alt="Logo" class="logo-img"/>
        </div>

        <!-- 展开状态：Logo文字和折叠按钮 -->
        <div v-if="isSidebarOpened" class="logo-text-wrapper">
          <span class="logo-text">Repodar</span>
          <ElButton :icon="Fold" @click="toggleSidebar()" class="collapse-btn" text size="small"/>
        </div>

        <!-- 折叠状态：展开提示 -->
        <div v-else class="expand-hint" @click="toggleSidebar()">
          <ElIcon class="expand-icon">
            <Expand/>
          </ElIcon>
        </div>
      </div>
    </div>

    <!-- 菜单区域 -->
    <div class="menu-container">
      <ElMenu :default-active="route.name as string" :collapse="!isSidebarOpened" mode="vertical"
              class="sidebar-menu"
              @select="handleMenuSelect">
        <MenuItems :routes="routes"/>
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
