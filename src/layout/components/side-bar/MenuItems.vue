<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { ElIcon, ElMenuItem, ElSubMenu } from 'element-plus'
import routeMetaUtils from '~/utils/route/route-meta-utils'

interface Props {
  routes: RouteRecordRaw[]
}

defineProps<Props>()

function shouldRenderMenuItem(route: RouteRecordRaw) {
  return routeMetaUtils.isSideBar(route) && (!route.children || route.children.length === 0)
}

function shouldRenderSubMenu(route: RouteRecordRaw) {
  return routeMetaUtils.isSideBar(route) && route.children && route.children.length > 0
}
</script>

<template>
  <template v-for="route in routes" :key="route.name">
    <!-- 没有子菜单或子菜单为空的菜单项 -->
    <ElMenuItem v-if="shouldRenderMenuItem(route)" :index="route.path">
      <ElIcon v-if="routeMetaUtils.getIcon(route)">
        <component :is="routeMetaUtils.getIcon(route)" />
      </ElIcon>
      <template #title>
        <span>{{ routeMetaUtils.getTitle(route) }}</span>
      </template>
    </ElMenuItem>

    <!-- 有子菜单的菜单项 -->
    <ElSubMenu v-else-if="shouldRenderSubMenu(route)" :index="route.path">
      <template #title>
        <ElIcon v-if="routeMetaUtils.getIcon(route)">
          <component :is="routeMetaUtils.getIcon(route)" />
        </ElIcon>
        <span>{{ routeMetaUtils.getTitle(route) }}</span>
      </template>

      <!-- 递归渲染子菜单 -->
      <MenuItems :routes="route.children!" />
    </ElSubMenu>
  </template>
</template>
