<script setup lang="ts">
import {usePageStore} from '@/stores/modules/page-store.ts';

const pageStore = usePageStore();
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="el-fade-in-linear" mode="out-in">
      <keep-alive :include="pageStore.keepAliveInclude" :max="15">
        <component :is="pageStore.wrapPageComponent(Component,route)"
                   :key="pageStore.computePageComponentKey(route)"/>
      </keep-alive>
    </transition>
  </router-view>
</template>
