<script setup lang="ts">
import NavBar from '@/layout/components/navbar/NavBar.vue'
import SideBar from '@/layout/components/sidebar/SideBar.vue'
import TabBar from '@/layout/components/tabbar/TabBar.vue'
import {ElAside, ElContainer, ElHeader, ElMain} from 'element-plus'
import {usePageStore} from '@/stores/modules/page-store.ts';

const pageStore = usePageStore();
</script>

<template>
  <ElContainer>
    <ElHeader height="50px">
      <NavBar/>
    </ElHeader>

    <ElContainer>
      <ElAside width="auto">
        <SideBar/>
      </ElAside>
      <ElContainer>
        <ElHeader height="40px">
          <TabBar/>
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
