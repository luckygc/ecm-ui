<script setup lang="ts">
import { computed } from 'vue'
import { useRouteStore } from '@/stores/route'
import { useAppStore } from '@/stores/app'

const routeStore = useRouteStore()
const appStore = useAppStore()

// 获取缓存的视图列表 - 优先使用路由 store 的缓存
const cachedViews = computed(() => routeStore.cachedPages)

// 获取主内容区域的刷新键
const mainContentRefreshKey = computed(() => appStore.currentMainContentKey)

// 生成组件的完整刷新键
const generateComponentKey = (routeName: string | symbol | undefined): string => {
  if (!routeName) return mainContentRefreshKey.value

  const routeNameStr = String(routeName)

  // 尝试获取该路由组件的专用刷新键
  const componentKey = appStore.getComponentKey(routeNameStr)

  // 如果没有专用键，则使用主内容刷新键
  if (componentKey === routeNameStr) {
    // 自动为新路由组件添加刷新键
    appStore.addComponentKey(routeNameStr)
    return `${routeNameStr}_${mainContentRefreshKey.value}`
  }

  return `${routeNameStr}_${componentKey}`
}
</script>

<template>
  <section class="main-content-container">
    <div class="content-wrapper">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
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
