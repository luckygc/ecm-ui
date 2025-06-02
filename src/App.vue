<script setup lang="ts">
// App.vue 是应用的根组件

import {watch} from "vue";
import {useRoute} from "vue-router";
import {useRouteStore} from "@/stores/route-store.ts";

const route = useRoute();
const pageStore = useRouteStore();

watch(() => route.fullPath, () => {
  pageStore.handleRouteChange(route);
}, {immediate: true});
</script>

<template>
  <router-view/>
</template>

<style>
html,
body,
#app {
  height: 100vh;
  width: 100vw;
}
</style>
