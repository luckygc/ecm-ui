<script setup lang="ts">
import PageContainer from '@/layout/components/PageContainer.vue'
import Navbar from '@/layout/components/navbar/Navbar.vue'
import Sidebar from '@/layout/components/sidebar/Sidebar.vue'
import TabContainer from '@/layout/components/TabContainer.vue'
import {ElAside, ElContainer, ElHeader, ElMain} from 'element-plus'
</script>

<template>
  <ElContainer style="height: 100%">
    <ElHeader>
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
        <ElMain style="background-color: #F7F8FA">
          <!-- 页面容器 -->
          <PageContainer/>
        </ElMain>
      </ElContainer>
    </ElContainer>
  </ElContainer>
</template>
