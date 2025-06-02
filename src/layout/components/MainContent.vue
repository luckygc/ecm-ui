<script setup lang="ts">
import { useRouteStore } from '@/stores/route-store.ts';
import { storeToRefs } from 'pinia';
import { defineComponent, h, type Component, shallowRef } from 'vue';
import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";

const routeStorage = useRouteStore();
const { keepAliveInclude } = storeToRefs(routeStorage);

// 使用WeakMap来缓存组件，允许未使用的组件被垃圾回收
// 注意：WeakMap的键必须是对象，所以我们需要使用对象作为键
const componentCache = shallowRef(new WeakMap<object, Component>());
// 用于存储路由路径到键对象的映射
const pathKeyMap = new Map<string, object>();

function createDynamicNamedComponent(
  route: RouteLocationNormalizedLoadedGeneric,
  wrappedComponent: Component
) {
  const fullPath = route.fullPath;

  // 获取或创建该路径对应的键对象
  let keyObject = pathKeyMap.get(fullPath);
  if (!keyObject) {
    keyObject = { path: fullPath };
    pathKeyMap.set(fullPath, keyObject);
  }

  // 如果缓存中已存在，直接返回缓存的组件
  if (componentCache.value.has(keyObject)) {
    return componentCache.value.get(keyObject);
  }

  // 创建新的动态命名组件
  const dynamicComponent = defineComponent({
    name: routeStorage.computeDynamicPageComponentName(fullPath),
    setup(props, { attrs, slots }) {
      return () => h(wrappedComponent, { ...attrs, ...props }, slots);
    },
  });

  // 将组件添加到缓存中
  componentCache.value.set(keyObject, dynamicComponent);

  return dynamicComponent;
}

</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="el-fade-in-linear" mode="out-in">
      <keep-alive :include="keepAliveInclude" :max="15">
        <component :is="createDynamicNamedComponent(route, Component)"
          :key="routeStorage.computeComponentKey(route.fullPath)" />
      </keep-alive>
    </transition>
  </router-view>
</template>
