<script setup lang="ts">


import {onUnmounted, watch} from "vue";
import {usePageStore} from "@/store/modules/page/page-store.ts";
import {getConfig} from "@/utils/config-utils.ts";
import {ElMessage} from "element-plus";
import {router} from "@/router";

const pageStore = usePageStore();

watch(() => pageStore.pages, (newVal, oldVal) => {
  if (newVal.length > oldVal.length && newVal.length > getConfig().maxPageCount) {
    ElMessage.warning("当前打开页面过多,建议关闭部分不需要的页面");
  }
})

onUnmounted(() => {
  pageStore.reset();
})
</script>

<template>
  <div class="page-container">
    <!-- 页面内容 -->
    <router-view v-slot="{ Component, route }">
      <transition v-if="Component" name="el-fade-in-linear" mode="out-in"
                  :duration="pageStore.pageTransitionDuration">
        <keep-alive :include="pageStore.keepAliveInclude" :max="15">
          <component :is="pageStore.createOrGetPage(Component, route).component"
                     :key="pageStore.createOrGetPage(Component, route).componentKey"/>
        </keep-alive>
      </transition>
      <el-result v-else :title="`欢迎使用${getConfig().appName}`" style="height: 100%;">
        <template #icon>
          <span></span>
        </template>
        <template #extra>
          <el-button type="primary" @click="router.push('/workbench')">前往工作台</el-button>
        </template>
      </el-result>
    </router-view>
  </div>
</template>

<style scoped>
.page-container {
  flex: 1;
  overflow: hidden;
}
</style>