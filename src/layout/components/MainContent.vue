<script setup lang="ts">
import { defineComponent, h, ref, type Component } from 'vue';

const keepAliveInclude = ref<string[]>([]);

function createDynamicNamedComponent(
  dynamicName: string,
  wrappedComponent: Component
) {

  if (!keepAliveInclude.value.includes(dynamicName)) {
    keepAliveInclude.value.push(dynamicName);
  }

  return defineComponent({
    name: dynamicName,
    setup(props, { attrs, slots }) {
      return () => h(wrappedComponent, { ...attrs, ...props }, slots);
    },
  });
}

</script>

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive ref="keepAliveRef" :include="keepAliveInclude" :max="15">
      <transition name="fade-transform" mode="out-in">
        <component :is="createDynamicNamedComponent(route.fullPath, Component)" :key="route.fullPath" />
      </transition>
    </keep-alive>
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
