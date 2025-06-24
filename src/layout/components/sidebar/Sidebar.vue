<script setup lang="ts">
import {routes} from '@/router'
import {useAppStore} from '@/stores/modules/layout-store.ts'
import {ElMenu} from 'element-plus'
import {type RouteRecordRaw, useRoute, useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import MenuItems from './MenuItems.vue'

const router = useRouter()
const route = useRoute()

const appStore = useAppStore()
const {isSidebarOpened} = storeToRefs(appStore)

// 处理菜单点击事件
function handleMenuSelect(routeName: string) {
  router.push({name: routeName})
}

const finalRenderRoutes = routes.filter(route => route.meta?.['sidebar'] === true || route.path === '/')
.flatMap(route => {
  if (route.path === '/') {
    return route.children;
  }

  return route;
}) as RouteRecordRaw[];

</script>

<template>
  <div class="sidebar-wrapper">
    <!-- 菜单区域 -->
    <div class="menu-container">
      <ElMenu :default-active="route.name as string" :collapse="!isSidebarOpened" mode="vertical"
              class="sidebar-menu"
              @select="handleMenuSelect">
        <MenuItems :routes="finalRenderRoutes"/>
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

.menu-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu {
  height: 100%;
}
</style>
