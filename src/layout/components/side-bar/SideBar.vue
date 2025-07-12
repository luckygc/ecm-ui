<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { routes } from '~/router/router'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import MenuItems from './MenuItems.vue'

const route = useRoute()

const layoutStore = useLayoutStore()

const finalRenderRoutes = routes
  .filter(r => r.name === 'Index')
  .flatMap(r => r.children) as RouteRecordRaw[]
</script>

<template>
  <div class="ecm-side-bar">
    <ElMenu router :default-active="route.path" :collapse="layoutStore.isAsideCollapsed" mode="vertical">
      <MenuItems :routes="finalRenderRoutes" />
    </ElMenu>
  </div>
</template>

<style>
.ecm-side-bar {
  height: 100%;
  width: var(--ecm-aside-width);
  background-color: transparent;
  transition: width var(--el-transition-duration);
  --el-menu-bg-color: transparent;
  overflow-y: auto;
  overflow-x: hidden;
}

.ecm-side-bar .el-menu {
  border-right: none;
  background-color: transparent;
}
</style>
