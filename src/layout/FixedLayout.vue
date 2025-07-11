<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import NavBar from './components/nav-bar/NavBar.vue'
import PageContainer from './components/page-container/PageContainer.vue'
import SideBar from './components/side-bar/SideBar.vue'

const layoutStore = useLayoutStore()

const asiderSpacerClass = computed(() => ({
  'ecm-layout__aside-spacer': true,
  'ecm-layout__aside-spacer--collapse': layoutStore.isASideCollapsed,
}))

const siderClass = computed(() => ({
  'ecm-layout__aside': true,
  'ecm-layout__aside--collapse': layoutStore.isASideCollapsed,
}))
</script>

<template>
  <div class="ecm-layout-container">
    <div class="ecm-layout">
      <div class="ecm-layout__bg" />
      <header class="ecm-layout__header">
        <NavBar />
      </header>

      <div class="ecm-layout__header-spacer" />

      <header class="ecm-layout__header">
        <NavBar />
      </header>

      <div :class="asiderSpacerClass" />

      <aside :class="siderClass">
        <SideBar />
        <!-- <ElButton circle plain :icon="layoutStore.isASideCollapsed ? 'ArrowRight' : 'ArrowLeft'"
          style="position: absolute;top: 50px;right: -16px;" @click="layoutStore.toggleASideCollapsed" /> -->
      </aside>

      <main class="ecm-layout__main">
        <div class="ecm-layout__main__page-container">
          <PageContainer />
        </div>
      </main>
    </div>
  </div>
</template>

<style>
#app {
  overflow: auto;
}

.ecm-layout-container {
}

.ecm-layout {
  display: grid;
  grid-template-areas:
    'header header'
    'aside main';
  grid-template-rows: var(--ecm-header-height) 1fr;
  grid-template-columns: auto 1fr;
  min-height: 100%;
  width: 100%;
}

.ecm-layout__bg {
  pointer-events: none;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(#ffffff, #f5f5f5 28%);
}

.ecm-layout__header-spacer {
  grid-area: header;
}

.ecm-layout__header {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  z-index: var(--ecm-header-z-index);
  height: var(--ecm-header-height);
  line-height: var(--ecm-header-height);
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.ecm-layout__aside-spacer {
  grid-area: aside;
  width: var(--ecm-aside-width);
  transition: width var(--el-transition-duration);
}

.ecm-layout__aside-spacer--collapse {
  width: var(--ecm-aside-collapse-width);
}

.ecm-layout__aside {
  position: fixed;
  top: var(--ecm-header-height);
  left: 0;
  bottom: 0;
  z-index: var(--ecm-aside-z-index);
  width: var(--ecm-aside-width);
  height: calc(100% - var(--ecm-header-height));
  transition: width var(--el-transition-duration);
  background-color: transparent;
}

.ecm-layout__aside--collapse {
  width: var(--ecm-aside-collapse-width);
}

.ecm-layout__main {
  position: relative;
  width: 100%;
  padding: 20px;
}

.ecm-layout__container__content {
}
</style>
