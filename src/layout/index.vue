<script setup lang="ts">
import { ElAside, ElContainer, ElHeader, ElMain } from 'element-plus'
import { computed } from 'vue'
import MainContent from '@/layout/components/MainContent.vue'
import Navbar from '@/layout/components/Navbar.vue'
import Sidebar from '@/layout/components/Sidebar.vue'
import TabBar from '@/layout/components/TabBar.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const sidebarOpened = computed(() => appStore.getSidebarStatus)
const sidebarWidth = computed(() => sidebarOpened.value ? '200px' : '64px')
</script>

<template>
  <ElContainer style="height: 100%">
    <ElHeader>
      <!-- 顶部导航栏 -->
      <Navbar />
    </ElHeader>
    <ElContainer>
      <ElAside :width="sidebarWidth" class="sidebar-container">
        <!-- 侧边栏 -->
        <Sidebar />
      </ElAside>
      <ElContainer>
        <ElHeader height="auto">
          <!-- 页签栏 -->
          <TabBar />
        </ElHeader>
        <ElMain>
          <!-- 主要内容区 -->
          <MainContent />
        </ElMain>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>

<style scoped>
.el-header,
.el-aside,
.el-main {
  padding: 0;
}

.sidebar-container {
  transition: width 0.3s ease;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  overflow-x: hidden;
  /* 禁止横向滚动 */
  overflow-y: auto;
  /* 允许纵向滚动 */
}
</style>
