<script setup lang="ts">
import { ElAside, ElContainer, ElHeader, ElMain } from 'element-plus'
import MainContent from '@/layout/components/MainContent.vue'
import Navbar from '@/layout/components/Navbar.vue'
import Sidebar from '@/layout/components/Sidebar.vue'
import TabBar from '@/layout/components/TabBar.vue'
</script>

<template>
  <ElContainer style="height: 100%">
    <ElHeader>
      <!-- 顶部导航栏 -->
      <Navbar />
    </ElHeader>
    <ElContainer>
      <ElAside>
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
</style>
