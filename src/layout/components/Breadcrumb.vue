<script setup lang="ts">
import type { RouteLocationMatched, RouteRecordRaw } from 'vue-router'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<RouteLocationMatched[]>([])

function getBreadcrumbs() {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  breadcrumbs.value = matched
}

// 检查是否是最后一个面包屑项
function isLast(index: number) {
  return index === breadcrumbs.value.length - 1
}

// 检查路由项是否有子菜单
function hasChildren(item: RouteLocationMatched) {
  // 递归查找路由配置
  const findRouteConfig = (routes: RouteRecordRaw[], name: string): RouteRecordRaw | undefined => {
    for (const route of routes) {
      if (route.name === name) {
        return route
      }
      if (route.children) {
        const found = findRouteConfig(route.children, name)
        if (found) {
          return found
        }
      }
    }
    return undefined
  }

  const routeConfig = findRouteConfig(router.options.routes, item.name as string)
  return routeConfig && routeConfig.children && routeConfig.children.length > 0
}

// 处理面包屑点击事件
function handleBreadcrumbClick(item: RouteLocationMatched, index: number) {
  // 如果是最后一个项目或者没有子菜单，则正常导航
  if (isLast(index) || !hasChildren(item)) {
    // 这里不需要做任何事情，因为el-breadcrumb-item的to属性会自动处理导航
  }
  else {
    // 对于有子菜单的项目，阻止默认导航行为
    // 因为我们已经将to属性设置为空字符串，所以不会导航
  }
}

watch(
  () => route.path,
  () => {
    getBreadcrumbs()
  },
  { immediate: true },
)
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :to="isLast(index) || !hasChildren(item) ? item.path : ''"
      @click="handleBreadcrumbClick(item, index)"
    >
      {{ item.meta?.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.el-breadcrumb {
  line-height: 50px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-breadcrumb__item) {
  display: inline-flex;
  align-items: center;
}

:deep(.el-breadcrumb__inner) {
  max-width: 150px; /* 限制每个面包屑项的最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
