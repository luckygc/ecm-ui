<script setup lang="ts">
import { ElAside, ElContainer, ElHeader, ElMain } from 'element-plus'
import { computed, onMounted } from 'vue'
import UnifiedMainContent from '@/layout/components/UnifiedMainContent.vue'
import Navbar from '@/layout/components/Navbar.vue'
import Sidebar from '@/layout/components/Sidebar.vue'
import TabBar from '@/layout/components/TabBar.vue'
import { useAppStore } from '@/stores/app'
import { usePageStore } from '@/stores/page-store'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const pageStore = usePageStore()
const router = useRouter()

const sidebarOpened = computed(() => appStore.getSidebarStatus)
const sidebarWidth = computed(() => sidebarOpened.value ? '200px' : '64px')

// 初始化页面管理系统
onMounted(() => {
  pageStore.initializePageSystem(router)
})
</script>

<template>
  <ElContainer style="height: 100%">
    <!-- 全高侧边栏 -->
    <ElAside :width="sidebarWidth" class="sidebar-container">
      <Sidebar />
    </ElAside>

    <!-- 右侧主要内容区域 -->
    <ElContainer>
      <ElHeader>
        <!-- 顶部导航栏 -->
        <Navbar />
      </ElHeader>
      <ElHeader height="auto">
        <!-- 页签栏 -->
        <TabBar />
      </ElHeader>
      <ElMain>
        <!-- 主要内容区 - 统一的KeepAlive布局 -->
        <UnifiedMainContent />
      </ElMain>
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
  transition: width 0.15s ease;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
  overflow-x: hidden;
  /* 禁止横向滚动 */
  overflow-y: auto;
  /* 允许纵向滚动 */
  box-shadow: none;
}
</style>
