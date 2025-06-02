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
    <transition name="el-fade-in-linear" mode="out-in">
      <keep-alive :include="keepAliveInclude" :max="15">
        <component :is="createDynamicNamedComponent(route, Component)" :key="computeComponentKey(route.fullPath)"/>
      </keep-alive>
    </transition>
  </router-view>
</template>
