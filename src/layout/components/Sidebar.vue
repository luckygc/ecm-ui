<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const sidebarOpened = computed(() => appStore.getSidebarStatus)
const activeMenu = computed(() => route.path)

function toggleSidebar() {
  appStore.toggleSidebar()
}

const routes = computed(() => {
  return router.options.routes.filter((route) => {
    return !(route.meta && route.meta.hidden)
  })
})

function handleMenuSelect(index: string) {
  router.push(index)
}

// 路径解析函数
function resolvePath(basePath: string, routePath: string) {
  // 如果是绝对路径，直接返回
  if (routePath.startsWith('/')) {
    return routePath
  }

  // 简单的路径合并逻辑
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  const path = routePath.startsWith('/') ? routePath : `/${routePath}`

  // 确保路径格式正确
  return `${base}${path}`
}
</script>

<template>
  <div class="sidebar-wrapper">
    <!-- Logo区域 -->
    <div class="logo-container" :class="{ 'collapsed': !sidebarOpened }">
      <div class="logo-content">
        <!-- Logo图片 -->
        <div class="logo-image" @click="!sidebarOpened && toggleSidebar()">
          <img src="/logo.svg" alt="Logo" class="logo-img" />
        </div>

        <!-- 展开状态：Logo文字和折叠按钮 -->
        <div v-if="sidebarOpened" class="logo-text-wrapper">
          <span class="logo-text">Repodar</span>
          <ElButton :icon="Fold" @click="toggleSidebar" class="collapse-btn" text size="small" />
        </div>

        <!-- 折叠状态：展开提示 -->
        <div v-else class="expand-hint" @click="toggleSidebar">
          <ElIcon class="expand-icon">
            <Expand />
          </ElIcon>
        </div>
      </div>
    </div>

    <!-- 菜单区域 -->
    <div class="menu-container">
      <ElMenu :default-active="activeMenu" :collapse="!sidebarOpened" mode="vertical" class="sidebar-menu"
        @select="handleMenuSelect">
        <template v-for="route in routes" :key="route.path">
          <!-- 没有子菜单或子菜单为空的路由 -->
          <ElMenuItem v-if="!route.children || route.children.length === 0" :index="route.path">
            <ElIcon v-if="route.meta && route.meta.icon">
              <component :is="route.meta.icon" />
            </ElIcon>
            <template #title>
              <span v-if="route.meta">{{ route.meta.title }}</span>
            </template>
          </ElMenuItem>

          <!-- 有子菜单的路由 -->
          <template v-else>
            <ElSubMenu :index="route.path">
              <template #title>
                <ElIcon v-if="route.meta && route.meta.icon">
                  <component :is="route.meta.icon" />
                </ElIcon>
                <span v-if="route.meta">{{ route.meta.title }}</span>
              </template>

              <!-- 递归渲染子菜单 -->
              <template v-for="child in route.children.filter(child => !(child.meta && child.meta.hidden))"
                :key="child.path">
                <!-- 没有子菜单的子路由 -->
                <ElMenuItem v-if="!child.children || child.children.length === 0"
                  :index="resolvePath(route.path, child.path)">
                  <ElIcon v-if="child.meta && child.meta.icon">
                    <component :is="child.meta.icon" />
                  </ElIcon>
                  <template #title>
                    <span v-if="child.meta">{{ child.meta.title }}</span>
                  </template>
                </ElMenuItem>

                <!-- 有子菜单的子路由 -->
                <ElSubMenu v-else :index="resolvePath(route.path, child.path)">
                  <template #title>
                    <ElIcon v-if="child.meta && child.meta.icon">
                      <component :is="child.meta.icon" />
                    </ElIcon>
                    <span v-if="child.meta">{{ child.meta.title }}</span>
                  </template>

                  <!-- 渲染三级菜单 -->
                  <ElMenuItem v-for="grandChild in child.children.filter(gc => !(gc.meta && gc.meta.hidden))"
                    :key="grandChild.path" :index="resolvePath(resolvePath(route.path, child.path), grandChild.path)">
                    <ElIcon v-if="grandChild.meta && grandChild.meta.icon">
                      <component :is="grandChild.meta.icon" />
                    </ElIcon>
                    <template #title>
                      <span v-if="grandChild.meta">{{ grandChild.meta.title }}</span>
                    </template>
                  </ElMenuItem>
                </ElSubMenu>
              </template>
            </ElSubMenu>
          </template>
        </template>
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
  /* 禁止横向滚动 */
}

/* Logo区域样式 */
.logo-container {
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease;
}

/* 折叠状态下的logo容器样式 */
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

/* 折叠状态下logo图片可点击 */
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

/* 展开提示样式 */
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

/* 工具提示样式 */
.tooltip {
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #303133;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.tooltip::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-right-color: #303133;
}

/* 当悬停整个logo容器时显示工具提示 */
.logo-container.collapsed:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

/* 菜单容器样式 */
.menu-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
  overflow-x: hidden;
  /* 确保菜单本身也不会横向滚动 */
}

/* 确保菜单项文本不会溢出 */
.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 折叠状态下的样式优化 */
.sidebar-menu.el-menu--collapse {
  width: 64px;
}

/* 确保图标在折叠状态下居中显示 */
.sidebar-menu.el-menu--collapse .el-menu-item,
.sidebar-menu.el-menu--collapse .el-sub-menu__title {
  text-align: center;
  padding: 0 20px;
}
</style>
