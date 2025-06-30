<script setup lang="ts">
import {ElIcon, ElMenuItem, ElSubMenu} from 'element-plus'
import type {RouteRecordRaw} from 'vue-router'
import routeMetaUtils from "@/utils/route/route-meta-utils.ts";

interface Props {
  routes: RouteRecordRaw[]
}

defineProps<Props>()

const shouldRenderMenuItem = (route: RouteRecordRaw) => {
  return routeMetaUtils.isSideBar(route) && (!route.children || route.children.length === 0)
}

const shouldRenderSubMenu = (route: RouteRecordRaw) => {
  return routeMetaUtils.isSideBar(route) && route.children && route.children.length > 0;
}


</script>

<template>
  <template v-for="route in routes" :key="route.name">
    <!-- 没有子菜单或子菜单为空的菜单项 -->
    <ElMenuItem v-if="shouldRenderMenuItem(route)" :index="String(route.name)">
      <ElIcon v-if="routeMetaUtils.getIcon(route)">
        <component :is="routeMetaUtils.getIcon(route)"/>
      </ElIcon>
      <template #title>
        <span>{{ routeMetaUtils.getTitle(route) }}</span>
      </template>
    </ElMenuItem>

    <!-- 有子菜单的菜单项 -->
    <ElSubMenu v-else-if="shouldRenderSubMenu(route)" :index="String(route.name)">
      <template #title>
        <ElIcon v-if="routeMetaUtils.getIcon(route)">
          <component :is="routeMetaUtils.getIcon(route)"/>
        </ElIcon>
        <span>{{ routeMetaUtils.getTitle(route) }}</span>
      </template>

      <!-- 递归渲染子菜单 -->
      <MenuItems :routes="route.children!"/>
    </ElSubMenu>
  </template>
</template>


