<script setup lang="ts">
import NavBar from '@/layout/components/nav-bar/NavBar.vue'
import SideBar from '@/layout/components/side-bar/SideBar.vue'
import PageManager from '@/layout/components/page-manager/PageManager.vue'
import {usePageStore} from '@/store/modules/page-store.ts';

const pageStore = usePageStore();
</script>

<template>
  <div class="layout">
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
      <div class="content-area">
        <!-- 页面内容 -->
        <div class="page-container">
          <router-view v-slot="{ Component, route }">
            <transition name="el-fade-in-linear" mode="out-in" :duration="{ enter: 100, leave: 100 }">
              <keep-alive :include="pageStore.keepAliveInclude as string[]" :max="15">
                <component :is="pageStore.wrapPageComponent(Component, route)"
                           :key="pageStore.computePageComponentKey(route)"/>
              </keep-alive>
            </transition>
          </router-view>
        </div>
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

.content-area {
  flex: 1;
  overflow: hidden;
  padding: 10px;
}

.page-container {
  height: 100%;
}
</style>
