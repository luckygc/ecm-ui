<script setup lang="ts">
import {usePageStore} from '@/stores/modules/page-store.ts';
import {createWrappedComponentByRoute} from "@/utils/component-utils.ts";

const pageStore = usePageStore();


</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="el-fade-in-linear" mode="out-in">
      <keep-alive :include="pageStore.keepAliveInclude" :max="15">
        <component :is="createWrappedComponentByRoute(Component,route)"
                   :key="pageStore.computeComponentKey(route.fullPath)"/>
      </keep-alive>
    </transition>
  </router-view>
</template>
