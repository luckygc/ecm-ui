<script setup lang="ts">
import { usePageStore } from '@/stores/page-store'

// 获取页面store
const pageStore = usePageStore()
const { activePage, keepAliveInclude, wrapComponent } = pageStore

</script>

<template>
  <section class="unified-main-content">
    <div class="content-wrapper">
      <router-view v-slot="{ Component, route }">
        <keep-alive ref="keepAliveRef" :include="keepAliveInclude" :max="15">
          <transition name="fade-transform" mode="out-in">
            <component :is="wrapComponent(route, Component)" :key="activePage?.key || route.fullPath" />
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
