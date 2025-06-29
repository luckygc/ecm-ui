<script setup lang="ts">
import NavBar from '@/layout/components/nav-bar/NavBar.vue'
import SideBar from '@/layout/components/side-bar/SideBar.vue'
import PageManager from '@/layout/components/page-manager/PageManager.vue'
import {usePageStore} from '@/store/modules/page-store.ts';
import {useLayoutStore} from "@/store/modules/layout-store.ts";
import {router} from "@/router";
import {getConfig} from "@/utils/config-utils.ts";

const pageStore = usePageStore();
const layoutStore = useLayoutStore();

</script>

<template>
  <div class="layout" :class="{ pageMaximized: layoutStore.isPageMaximized }">
    <!-- 顶部导航栏 -->
    <header class="header">
      <NavBar/>
    </header>

    <!-- 侧边栏 -->
    <aside class="aside">
      <SideBar/>
    </aside>

    <!-- 主内容区域 -->
    <main class="main">
      <!-- 标签栏 -->
      <div class="page-manager-container">
        <PageManager/>
      </div>

      <!-- 页面内容区域 -->
      <div class="page-container">
        <!-- 页面内容 -->
        <router-view v-slot="{ Component, route }">
          <transition v-if="Component" name="el-fade-in-linear" mode="out-in"
                      :duration="layoutStore.pageTransitionDuration">
            <keep-alive :include="pageStore.keepAliveInclude as string[]" :max="pageStore.maxKeepAliveCount">
              <component :is="pageStore.createOrGetWrapperComponentByRoute(Component, route)"
                         :key="pageStore.createOrGetComponentKeyByRoute(route)"/>
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
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "aside main";
  grid-template-rows: 50px 1fr;
  grid-template-columns: auto 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.layout.pageMaximized {
  grid-template-areas:
    "main";
  grid-template-rows:  1fr;
  grid-template-columns:  1fr;
}

.layout.pageMaximized .header {
  display: none;
}

.layout.pageMaximized .aside {
  display: none;
}

.header {
  grid-area: header;
  background-color: #fff;
}

.aside {
  grid-area: aside;
  background-color: #fff;
}

.main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-manager-container {
  height: 40px;
}

.page-container {
  flex: 1;
  overflow: hidden;
}
</style>
