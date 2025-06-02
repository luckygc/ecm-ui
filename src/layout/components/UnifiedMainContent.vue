<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePageStore } from '@/stores/page-store'
import { wrapperComponent, computeComponentName } from '@/utils/page-wrapper'

// 获取路由和store
const route = useRoute()
const pageStore = usePageStore()

// 组件引用
const keepAliveRef = ref()

// 当前组件名
const currentComponentName = computed(() => {
  return computeComponentName(route)
})

// keepalive配置
const keepAliveConfig = computed(() => ({
  include: pageStore.keepAliveInclude,
  exclude: [], // 统一页面管理不使用exclude
  max: 15
}))

// 生成组件key - 使用fullPath确保唯一性
const generateComponentKey = () => {
  return route.fullPath
}

// 监听路由变化
watch(
  () => route.fullPath,
  () => {
    // 处理页面变化逻辑
    pageStore.handleRouteChange(route)
  },
  { immediate: true }
)

// 暴露方法给父组件
defineExpose({
  // keepalive管理方法
  addToCache: () => {
    // 缓存管理由页面store自动处理
    console.log('[UnifiedMainContent] 缓存管理由页面store自动处理')
  },
  removeFromCache: () => {
    // 移除缓存通过页面store的删除方法处理
    if (pageStore.activePage) {
      pageStore.removePageByFullPath(pageStore.activePage.fullPath)
    }
  },
  clearAllCache: () => {
    // 清空所有缓存
    Array.from(pageStore.pages.values()).forEach(page => {
      pageStore.removePageByFullPath(page.fullPath)
    })
  },

  // 状态信息
  currentComponentName,
  keepAliveConfig,

  // 组件引用
  keepAliveRef: computed(() => keepAliveRef.value)
})

// 调试信息
watch(
  [currentComponentName, () => pageStore.keepAliveInclude],
  ([current, include]) => {
    console.log('[UnifiedMainContent] 状态更新:', {
      current,
      include: include.length,
      fullPath: route.fullPath,
      activePage: pageStore.activePage?.title
    })
  }
)
</script>

<template>
  <section class="unified-main-content">
    <div class="content-wrapper">
      <router-view v-slot="{ Component, route: currentRoute }">
        <keep-alive ref="keepAliveRef" :include="keepAliveConfig.include" :exclude="keepAliveConfig.exclude"
          :max="keepAliveConfig.max">
          <transition name="fade-transform" mode="out-in">
            <!-- 使用包裹组件，自定义命名 -->
            <component v-if="Component" :is="wrapperComponent(currentRoute, Component)" :key="generateComponentKey()" />
          </transition>
        </keep-alive>
      </router-view>
    </div>
  </section>
</template>

<style scoped>
.unified-main-content {
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

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
