<script setup lang="ts">
import NavBar from '@/layout/components/nav-bar/NavBar.vue'
import SideBar from '@/layout/components/side-bar/SideBar.vue'
import TabBar from '@/layout/components/tab-bar/TabBar.vue'
import {ElAside, ElContainer, ElHeader, ElMain} from 'element-plus'
import {usePageStore} from '@/store/modules/page-store.ts';

const pageStore = usePageStore();
</script>

<template>
  <ElContainer style="height: 100%;">
    <ElHeader height="50px">
      <NavBar/>
    </ElHeader>

    <ElContainer>
      <ElAside width="auto">
        <SideBar/>
      </ElAside>
      <ElContainer>
        <ElHeader height="50px">
          <TabBar/>
        </ElHeader>

        <ElMain class="page-container">
          <router-view v-slot="{ Component, route }">
            <transition name="el-fade-in-linear" mode="out-in" :duration="{ enter: 100, leave: 100 }">
              <keep-alive :include="pageStore.keepAliveInclude" :max="15">
                <component :is="pageStore.wrapPageComponent(Component,route)"
                           :key="pageStore.computePageComponentKey(route)"/>
              </keep-alive>
            </transition>
          </router-view>
        </ElMain>

      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<style scoped>
.el-header {
  --el-header-padding: 0;
}

.el-main {
  --el-main-padding: 0;
}

.page-container {
  height: calc(100vh - 90px);
  overflow: hidden;
}
</style>
