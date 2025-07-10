<script setup lang="ts">
import { computed } from 'vue'
import NavBar from '~/layout/components/nav-bar/NavBar.vue'
import PageContainer from '~/layout/components/page-container/PageContainer.vue'
import SideBar from '~/layout/components/side-bar/SideBar.vue'
import TabBar from '~/layout/components/tab-bar/TabBar.vue'
import { useLayoutStore } from '~/store/modules/layout/layout-store'

const layoutStore = useLayoutStore()
const layoutClass = computed(() => {
  return { pageMaximized: layoutStore.isPageMaximized }
})
</script>

<template>
  <div class="layout" :class="layoutClass">
    <!-- 顶部导航栏 -->
    <header class="header">
      <NavBar />
    </header>

    <!-- 侧边栏 -->
    <aside class="aside">
      <SideBar />
    </aside>

    <!-- 主内容区域 -->
    <main class="main">
      <!-- 标签栏 -->
      <div class="tab-bar-container">
        <TabBar />
      </div>

      <!-- 页面内容区域 -->
      <PageContainer />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-areas:
    'header header'
    'aside main';
  grid-template-rows: var(--layout-header-height) 1fr;
  grid-template-columns: auto 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: var(--layout-bg);
}

.layout.pageMaximized {
  grid-template-areas: 'main';
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
}

.layout.pageMaximized .header {
  display: none;
}

.layout.pageMaximized .aside {
  display: none;
}

.header {
  grid-area: header;
  color: rgba(0, 0, 0, 0.88);
  background-color: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
  backdrop-filter: blur(8px);
  transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.aside {
  grid-area: aside;
}

.main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-bar-container {
  height: var(--tab-bar-container-height);
}
</style>
