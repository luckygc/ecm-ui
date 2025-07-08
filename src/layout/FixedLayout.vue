<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/nav-bar/NavBar.vue'
import PageContainer from './components/page-container/PageContainer.vue'
import SideBar from './components/side-bar/SideBar.vue'
import TabBar from './components/tab-bar/TabBar.vue'

// 响应式数据
const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 路由相关
const router = useRouter()

// 方法
const handleCollapse = (value: boolean) => {
  collapsed.value = value
}

const handleMenuSelect = (keys: string[]) => {
  selectedKeys.value = keys
}

const handleOpenChange = (keys: string[]) => {
  openKeys.value = keys
}

const handleTabChange = (key: string) => {
  router.push(key)
}
</script>

<template>
  <div class="fixed-layout">
    <!-- 顶部导航栏 -->
    <div class="layout-header">
      <NavBar :collapsed="collapsed" @collapse="handleCollapse" />
    </div>

    <!-- 主体内容区域 -->
    <div class="layout-content">
      <!-- 侧边栏 -->
      <div class="layout-sider">
        <SideBar
          :collapsed="collapsed" :selected-keys="selectedKeys" :open-keys="openKeys" @select="handleMenuSelect"
          @open-change="handleOpenChange"
        />
      </div>

      <!-- 主内容区域 -->
      <div class="layout-main">
        <!-- 标签页栏 -->
        <div class="layout-tabs">
          <TabBar @change="handleTabChange" />
        </div>

        <!-- 页面容器 -->
        <div class="layout-page">
          <PageContainer>
            <router-view />
          </PageContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 48px;
}

.layout-content {
  display: flex;
  flex: 1;
  margin-top: 48px;
  min-height: calc(100vh - 48px);
}

.layout-sider {
  position: fixed;
  left: 0;
  top: 48px;
  bottom: 0;
  z-index: 999;
  width: 200px;
  overflow: hidden;
}

.layout-sider.collapsed {
  width: 80px;
}

.layout-main {
  flex: 1;
  margin-left: 200px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.2s;
}

.collapsed .layout-main {
  margin-left: 80px;
}

.layout-tabs {
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
}

.layout-page {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
