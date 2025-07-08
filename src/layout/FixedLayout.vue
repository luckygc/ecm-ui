<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import NavBar from './components/nav-bar/NavBar.vue'
import PageContainer from './components/page-container/PageContainer.vue'
import SideBar from './components/side-bar/SideBar.vue'

// 布局状态管理
const layoutStore = useLayoutStore()

// 响应式数据
const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 计算属性
const layoutClass = computed(() => ({
  'ant-pro-layout': true,
  'ant-pro-layout-side': true,
  'ant-pro-layout-side-collapsed': collapsed.value,
  'ant-pro-layout-side-fixed': true,
  'ant-pro-layout-header-fixed': true,
}))

const siderClass = computed(() => ({
  'ant-pro-sider': true,
  'ant-pro-sider-collapsed': collapsed.value,
  'ant-pro-sider-fixed': true,
}))

const headerClass = computed(() => ({
  'ant-pro-header': true,
  'ant-pro-header-fixed': true,
}))

const contentClass = computed(() => ({
  'ant-pro-content': true,
  'ant-pro-content-side': true,
}))

// 方法
const handleCollapse = (value: boolean) => {
  collapsed.value = value
  layoutStore.isSideBarCollapsed = value
}

const handleMenuSelect = (keys: string[]) => {
  selectedKeys.value = keys
}

const handleOpenChange = (keys: string[]) => {
  openKeys.value = keys
}
</script>

<template>
  <div :class="layoutClass">
    <!-- 顶部导航栏 -->
    <header :class="headerClass">
      <NavBar :collapsed="collapsed" @collapse="handleCollapse" />
    </header>

    <!-- 侧边栏 -->
    <aside :class="siderClass">
      <SideBar
        :collapsed="collapsed"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        @select="handleMenuSelect"
        @open-change="handleOpenChange"
      />
    </aside>

    <!-- 主内容区域 -->
    <main :class="contentClass">
      <!-- 页面容器 -->
      <div class="ant-pro-page-container">
        <PageContainer>
          <router-view />
        </PageContainer>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Ant Design Pro 布局样式 */
.ant-pro-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: var(--layout-bg);
}

.ant-pro-layout-side {
  position: relative;
}

.ant-pro-layout-side-collapsed .ant-pro-sider {
  width: 80px;
}

.ant-pro-layout-side-collapsed .ant-pro-content {
  margin-left: 80px;
}

.ant-pro-layout-side-fixed .ant-pro-sider {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 100vh;
  transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-pro-layout-side-fixed .ant-pro-content {
  margin-left: 200px;
  transition: margin-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-pro-layout-header-fixed .ant-pro-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  height: var(--layout-header-height);
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-pro-layout-header-fixed .ant-pro-content {
  margin-top: var(--layout-header-height);
  height: calc(100vh - var(--layout-header-height));
}

.ant-pro-layout-side-collapsed .ant-pro-layout-header-fixed .ant-pro-header {
  width: calc(100% - 80px);
  left: 80px;
}

.ant-pro-layout-side-fixed .ant-pro-layout-header-fixed .ant-pro-header {
  width: calc(100% - 200px);
  left: 200px;
}

/* 侧边栏样式 */
.ant-pro-sider {
  width: var(--layout-aside-width);
  background: #001529;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  overflow: auto;
}

.ant-pro-sider-collapsed {
  width: 80px;
}

.ant-pro-sider-fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 100vh;
  overflow: auto;
}

/* 顶部导航栏样式 */
.ant-pro-header {
  height: var(--layout-header-height);
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 0 16px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ant-pro-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

/* 主内容区域样式 */
.ant-pro-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--layout-bg);
}

.ant-pro-content-side {
  margin-left: var(--layout-aside-width);
  transition: margin-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 页面容器样式 */
.ant-pro-page-container {
  flex: 1;
  padding: 0;
  overflow: auto;
  background: transparent;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ant-pro-layout-side {
    display: none;
  }

  .ant-pro-layout-side-collapsed .ant-pro-content,
  .ant-pro-layout-side-fixed .ant-pro-content {
    margin-left: 0;
  }

  .ant-pro-layout-header-fixed .ant-pro-header,
  .ant-pro-layout-side-collapsed .ant-pro-layout-header-fixed .ant-pro-header,
  .ant-pro-layout-side-fixed .ant-pro-layout-header-fixed .ant-pro-header {
    width: 100%;
    left: 0;
  }
}

/* 动画效果 */
.ant-pro-layout * {
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* 页面滚动条样式 */
.ant-pro-page-container::-webkit-scrollbar {
  width: 6px;
}

.ant-pro-page-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.ant-pro-page-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.ant-pro-page-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Firefox 页面滚动条样式 */
.ant-pro-page-container {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* 侧边栏滚动条样式 */
.ant-pro-sider::-webkit-scrollbar {
  width: 4px;
}

.ant-pro-sider::-webkit-scrollbar-track {
  background: transparent;
}

.ant-pro-sider::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.ant-pro-sider::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Firefox 侧边栏滚动条样式 */
.ant-pro-sider {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

/* 阴影效果 */
.ant-pro-sider {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

/* 悬停效果 */
.ant-pro-header:hover {
  background: rgba(255, 255, 255, 0.85);
}

/* 打印样式 */
@media print {
  .ant-pro-header,
  .ant-pro-sider {
    display: none;
  }

  .ant-pro-content {
    margin: 0;
  }

  .ant-pro-page-container {
    padding: 0;
  }
}
</style>
