<script setup lang="ts">
import {useRouteStore} from '@/stores/route-store.ts';
import {storeToRefs} from 'pinia';
import {defineComponent, h, type Component} from 'vue';
import type {RouteLocationNormalizedLoadedGeneric} from "vue-router";

const pageStore = useRouteStore();
const {computeComponentKey} = pageStore;
const {keepAliveInclude} = storeToRefs(pageStore);

function createDynamicNamedComponent(
    route: RouteLocationNormalizedLoadedGeneric,
    wrappedComponent: Component
) {
  return defineComponent({
    name: pageStore.computeDynamicPageComponentName(route.fullPath),
    setup(props, {attrs, slots}) {
      return () => h(wrappedComponent, {...attrs, ...props}, slots);
    },
  });
}

</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="keepAliveInclude" :max="15">
        <component :is="createDynamicNamedComponent(route, Component)" :key="computeComponentKey(route.fullPath)"/>
      </keep-alive>
    </transition>
  </router-view>
</template>

<style scoped>
/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.2s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
