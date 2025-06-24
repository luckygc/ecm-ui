<script setup lang="ts">
import {useLayoutStore} from '@/stores/modules/layout-store.ts'
import {ElMenu} from 'element-plus'
import {type RouteRecordRaw, useRoute, useRouter} from 'vue-router'
import MenuItems from './MenuItems.vue'
import {routes} from "@/router";
import {Expand, Fold} from '@element-plus/icons-vue';

const router = useRouter()
const route = useRoute()

// 处理菜单点击事件
function handleMenuSelect(routeName: string) {
  router.push({name: routeName})
}

const layoutStore = useLayoutStore();

const finalRenderRoutes = routes
    .filter(route => route.meta?.['sidebar'] === true || route.name === 'Index')
    .flatMap(route => {
      if (route.path === '/') {
        return route.children;
      }

      return route;
    }) as RouteRecordRaw[];

</script>

<template>
  <div class="sidebar-wrapper">
    <ElMenu :default-active="route.name as string"
            :collapse="!layoutStore.isSidebarOpened"
            mode="vertical"
            @select="handleMenuSelect">
      <el-scrollbar>
        <MenuItems :routes="finalRenderRoutes"/>
      </el-scrollbar>
    </ElMenu>
    <el-divider />
    <el-tooltip :content="layoutStore.isSidebarOpened ? '收起菜单' : '展开菜单'"
                :show-after="1000"
                :auto-close="1000"
    >
      <ElButton :icon="layoutStore.isSidebarOpened ? Fold:Expand"
                @click="layoutStore.toggleSidebar()"
                text
                class="toggle-btn"
                size="large"/>
    </el-tooltip>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
}

.sidebar-wrapper:not(:has(.el-menu--collapse)) .el-menu {
  width: 200px;
}

.el-menu {
  flex: 1;
  border-right: none;
}

.toggle-btn {
  width: 100%;
  transition: var(--el-transition-duration) ease-in-out;
}
</style>
