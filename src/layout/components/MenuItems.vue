<template>
  <template v-for="route in routes" :key="route.path">
    <!-- 没有子菜单或子菜单为空的菜单项 -->
    <ElMenuItem v-if="!route.children || route.children.length === 0" :index="route.path">
      <ElIcon v-if="route.meta?.icon">
        <component :is="route.meta.icon" />
      </ElIcon>
      <template #title>
        <span>{{ route.meta?.title || route.name }}</span>
      </template>
    </ElMenuItem>

    <!-- 有子菜单的菜单项 -->
    <ElSubMenu v-else :index="route.path">
      <template #title>
        <ElIcon v-if="route.meta?.icon">
          <component :is="route.meta.icon" />
        </ElIcon>
        <span>{{ route.meta?.title || route.name }}</span>
      </template>

      <!-- 递归渲染子菜单 -->
      <MenuItems :routes="route.children" />
    </ElSubMenu>
  </template>
</template>

<script setup lang="ts">
import { ElMenuItem, ElSubMenu, ElIcon } from 'element-plus'
import type { RouteRecordRaw } from 'vue-router'

interface Props {
  routes: RouteRecordRaw[]
}

defineProps<Props>()
</script>
