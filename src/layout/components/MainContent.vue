<script setup lang="ts">
import { defineComponent, h, type Component } from 'vue';
import { usePageStore } from '@/stores/page-store';
import { storeToRefs } from 'pinia';

const pageStore = usePageStore();
const { keepAliveInclude } = storeToRefs(pageStore);

function createDynamicNamedComponent(
  route: any,
  wrappedComponent: Component
) {
  // 使用路由名称作为组件名称，确保与KeepAlive include匹配
  const componentName = pageStore.generateComponentName(route);

  return defineComponent({
    name: componentName,
    setup(props, { attrs, slots }) {
      return () => h(wrappedComponent, { ...attrs, ...props }, slots);
    },
  });
}

</script>

<template>
  <router-view v-slot="{ Component, route }">

    <transition name="fade-transform" mode="out-in">
      <keep-alive ref="keepAliveRef" :include="keepAliveInclude" :max="15">
        <component :is="createDynamicNamedComponent(route, Component)" :key="route.fullPath" />
      </keep-alive>
    </transition>

  </router-view>
</template>

<style scoped>
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
