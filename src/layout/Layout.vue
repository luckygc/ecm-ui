<script setup lang="ts">
import Navbar from '@/layout/components/navbar/Navbar.vue'
import Sidebar from '@/layout/components/sidebar/Sidebar.vue'
import TabContainer from '@/layout/components/TabContainer.vue'
import {ElAside, ElContainer, ElHeader, ElMain} from 'element-plus'
import {usePageStore} from '@/stores/modules/page-store.ts';

const pageStore = usePageStore();
</script>

<template>
  <ElContainer>
    <ElHeader height="50px">
      <!-- 顶部导航栏 -->
      <Navbar/>
    </ElHeader>

    <!-- 右侧主要内容区域 -->
    <ElContainer>
      <ElAside width="auto">
        <Sidebar/>
      </ElAside>
      <ElContainer>
        <ElHeader height="40px">
          <!-- 页签容器 -->
          <TabContainer/>
        </ElHeader>
        <ElMain class="page-container">
          <el-scrollbar>
            <router-view v-slot="{ Component, route }">
              <transition name="el-fade-in-linear" mode="out-in">
                <keep-alive :include="pageStore.keepAliveInclude" :max="15">
                  <component :is="pageStore.wrapPageComponent(Component,route)"
                             :key="pageStore.computePageComponentKey(route)"/>
                </keep-alive>
              </transition>
            </router-view>
          </el-scrollbar>
        </ElMain>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<style>
.page-container {
  background-color: #F7F8FA;
  height: calc(100vh - 90px);
}
</style>
