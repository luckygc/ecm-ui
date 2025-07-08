<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { ElMenu } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '~/router/modules'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import routeMetaUtils from '~/utils/route/route-meta-utils'
import MenuItems from './MenuItems.vue'

const route = useRoute()
const router = useRouter()

const layoutStore = useLayoutStore()
// 处理菜单点击事件
const handleMenuSelect = (routeName: string) => {
  router.push({ name: routeName })
}

const finalRenderRoutes = routes
  .filter(r => routeMetaUtils.isSideBar(r) || r.name === 'Index')
  .flatMap((route) => {
    if (route.path === '/') {
      return route.children
    }

    return route
  }) as RouteRecordRaw[]
</script>

<template>
  <div class="sidebar-wrapper">
    <div class="menu-container">
      <el-scrollbar>
        <ElMenu
          :default-active="route.name as string" :collapse="layoutStore.isSideBarCollapsed" mode="vertical"
          @select="handleMenuSelect"
        >
          <MenuItems :routes="finalRenderRoutes" />
        </ElMenu>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color-grey);
  background-color: transparent;
}

.sidebar-wrapper:not(:has(.el-menu--collapse)) .el-menu {
  width: var(--layout-aside-width);
}

.el-menu {
  flex: 1;
  border-right: none;
  background-color: transparent;
  --el-transition-duration: var(--el-transition-duration-fast);
}

.menu-container {
  flex: 1;
  overflow: hidden;
}
</style>
