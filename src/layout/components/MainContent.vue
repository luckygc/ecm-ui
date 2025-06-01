<script setup lang="ts">
import { computed } from 'vue'
import { useTagsViewStore } from '@/stores/tagsView'
import { useAppStore } from '@/stores/app'

const tagsViewStore = useTagsViewStore()
const appStore = useAppStore()

const cachedViews = computed(() => tagsViewStore.getCachedViews)
const refreshKey = computed(() => appStore.getRefreshKey)
</script>

<template>
  <section class="main-content-container">
    <div class="content-wrapper">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="String(route.name) + refreshKey" />
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
