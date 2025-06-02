<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteStore } from '@/stores/route-store'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const routeStore = useRouteStore()
const appStore = useAppStore()

// 获取缓存的视图列表 - 使用新的组件名机制
// 注意：我们暂时移除include机制，让keep-alive缓存所有组件
// const cachedViews = computed(() => {
//   const cached = routeStore.cachedPages
//   console.log('当前缓存的组件列表:', cached)
//   return cached
// })

// 获取主内容区域的刷新键
const mainContentRefreshKey = computed(() => appStore.currentMainContentKey)

// 生成组件的完整刷新键 - 基于fullPath确保每个实例都有唯一的key
const generateComponentKey = (routeName: string | symbol | undefined): string => {
  if (!routeName) return mainContentRefreshKey.value

  // 查找当前路由对应的页面信息
  const currentPage = routeStore.findPageByFullPath(route.fullPath)

  if (currentPage && currentPage.componentName) {
    // 使用页面的唯一组件名作为key，这样每个参数实例都有独立的key
    console.log(`为路由 ${route.fullPath} 生成组件key: ${currentPage.componentName}`)
    return currentPage.componentName
  }

  // 降级处理：如果找不到页面信息，使用原有逻辑
  const routeNameStr = String(routeName)
  const componentKey = appStore.getComponentKey(routeNameStr)

  if (componentKey === routeNameStr) {
    appStore.addComponentKey(routeNameStr)
    const key = `${routeNameStr}_${mainContentRefreshKey.value}`
    console.log(`为路由 ${route.fullPath} 生成降级key: ${key}`)
    return key
  }

  console.log(`为路由 ${route.fullPath} 生成组件key: ${routeNameStr}_${componentKey}`)
  return `${routeNameStr}_${componentKey}`
}
</script>

<template>
  <section class="main-content-container">
    <div class="content-wrapper">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :max="20">
            <component :is="Component" :key="generateComponentKey(route.name)" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </section>
</template>

<style scoped>
.main-content-container {
  height: 100%;
  width: 100%;
  background-color: #f5f7fa;
  overflow-x: hidden;
}

.content-wrapper {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  width: calc(100% - 20px);
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
