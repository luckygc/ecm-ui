<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import NavBar from './components/nav-bar/NavBar.vue'
import PageContainer from './components/page-container/PageContainer.vue'
import SideBar from './components/side-bar/SideBar.vue'

const layoutStore = useLayoutStore()

const siderSpacerClass = computed(() => ({
  'ecm-layout--fixed__sider-spacer': true,
  'ecm-layout--fixed__sider-spacer--collapse': layoutStore.isASideCollapsed,
}))

const siderClass = computed(() => ({
  'ecm-layout--fixed__sider': true,
  'ecm-layout--fixed__sider--collapse': layoutStore.isASideCollapsed,
}))
</script>

<template>
  <div class="ecm-layout">
    <div class="ecm-layout-bg" />
    <div class="ecm-layout--fixed">
      <div :class="siderSpacerClass" />

      <!-- 侧边栏 -->
      <aside :class="siderClass">
        <SideBar />
        <ElButton
          circle plain :icon="layoutStore.isASideCollapsed ? 'ArrowRight' : 'ArrowLeft'"
          style="position: absolute;top: 50px;right: -16px;" @click="layoutStore.toggleASideCollapsed"
        />
      </aside>

      <main class="ecm-layout--fixed__container">
        <div class="ecm-layout--fixed__container__header-spacer" />

        <!-- 顶部导航栏 -->
        <header class="ecm-layout--fixed__container__header">
          <NavBar />
        </header>

        <!-- 页面容器 -->
        <div class="ecm-layout--fixed__container__content">
          <PageContainer />
        </div>
      </main>
    </div>
  </div>
</template>

<style>
.ecm-layout {
  height: 100%;
  width: 100%;
}

.ecm-layout-bg {
  pointer-events: none;
  position: fixed;
  overflow: hidden;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(#ffffff, #f5f5f5 28%);
}

.ecm-layout--fixed {
  display: flex;
  flex-direction: row;
  min-height: 100%;
  width: 100%;
}

.ecm-layout--fixed__sider-spacer {
  width: var(--ecm-aside-width);
  overflow: hidden;
  flex: 0 0 var(--ecm-aside-width);
  max-width: var(--ecm-aside-width);
  min-width: var(--ecm-aside-width);
  transition: var(--el-transition-duration);
}

.ecm-layout--fixed__sider-spacer--collapse {
  width: var(--ecm-aside-collapse-width);
  flex: 0 0 var(--ecm-aside-collapse-width);
  max-width: var(--ecm-aside-collapse-width);
  min-width: var(--ecm-aside-collapse-width);
}

.ecm-layout--fixed__sider {
  position: fixed;
  top: var(--ecm-header-height);
  left: 0;
  bottom: 0;
  z-index: var(--ecm-aside-z-index);
  width: var(--ecm-aside-width);
  height: calc(100% - var(--ecm-header-height));
  transition: width var(--el-transition-duration);
}

.ecm-layout--fixed__sider--collapse {
  width: var(--ecm-aside-collapse-width);
}

.ecm-layout--fixed__container {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0;
  min-width: 0;
  width: 100%;
  background-color: transparent;
  overflow: auto;
}

.ecm-layout--fixed__container__header-spacer {
  height: var(--ecm-header-height);
  line-height: var(--ecm-header-height);
  z-index: 19;
  background-color: transparent;
  flex: 0 0 auto;
}

.ecm-layout--fixed__container__header {
  position: fixed;
  width: 100%;
  flex: 0 0 auto;
  left: 0;
  right: 0;
  z-index: var(--ecm-header-z-index);
  height: var(--ecm-header-height);
  line-height: var(--ecm-header-height);
  border-block-end: 1px solid rgba(5, 5, 5, 0.06);
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ecm-layout--fixed__container__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: transparent;
  position: relative;
  padding: 0;
  flex: auto;
  min-height: 0;
}
</style>
