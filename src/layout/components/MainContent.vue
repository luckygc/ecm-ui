<script setup lang="ts">
import {usePageStore} from '@/stores/modules/route-store.ts';
import {storeToRefs} from 'pinia';
import {type Component, defineComponent, h} from 'vue';
import type {RouteLocationNormalizedLoadedGeneric} from "vue-router";

const pageStore = usePageStore();
const {keepAliveInclude} = storeToRefs(pageStore);

const componentCache = new Map<string, Component>();

function createDynamicNamedComponent(
    route: RouteLocationNormalizedLoadedGeneric,
    wrappedComponent: Component
) {
  const fullPath = route.fullPath;

  // 如果缓存中已存在，直接返回缓存的组件
  if (componentCache.has(fullPath)) {
    return componentCache.get(fullPath);
  }

  // 创建新的动态命名组件
  const dynamicComponent = defineComponent({
    name: pageStore.computeComponentName(fullPath),
    setup(props, {attrs, slots}) {
      return () => h(wrappedComponent, {...attrs, ...props}, slots);
    },
  });

  // 将组件添加到缓存中
  componentCache.set(fullPath, dynamicComponent);

  return dynamicComponent;
}

</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="el-fade-in-linear" mode="out-in">
      <keep-alive :include="keepAliveInclude" :max="15">
        <component :is="createDynamicNamedComponent(route, Component)"
                   :key="pageStore.computeComponentKey(route.fullPath)"/>
      </keep-alive>
    </transition>
  </router-view>
</template>
