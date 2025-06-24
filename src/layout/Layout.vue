<script setup lang="ts">
import PageContainer from '@/layout/components/PageContainer.vue'
import Navbar from '@/layout/components/navbar/Navbar.vue'
import Sidebar from '@/layout/components/sidebar/Sidebar.vue'
import TabContainer from '@/layout/components/TabContainer.vue'
import {useAppStore} from '@/stores/modules/layout-store.ts'
import {ElAside, ElContainer, ElHeader, ElMain} from 'element-plus'
import {storeToRefs} from 'pinia'

const appStore = useAppStore()
const {sidebarWidth} = storeToRefs(appStore)

</script>

<template>
  <ElContainer style="height: 100%">
    <!-- 全高侧边栏 -->
    <ElAside :width="sidebarWidth" class="sidebar-container">
      <Sidebar/>
    </ElAside>

    <!-- 右侧主要内容区域 -->
    <ElContainer>
      <ElHeader>
        <!-- 顶部导航栏 -->
        <Navbar/>
      </ElHeader>
      <ElHeader height="40px">
        <!-- 页签容器 -->
        <TabContainer />
      </ElHeader>
      <ElMain style="background-color: #F7F8FA">
        <!-- 页面容器 -->
        <PageContainer />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style scoped>

.sidebar-container {
  transition: width 0.15s ease;
}
</style>
