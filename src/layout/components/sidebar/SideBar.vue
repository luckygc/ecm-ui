<script setup lang="ts">
import {ElMenu} from 'element-plus'
import {type RouteRecordRaw, useRoute, useRouter} from 'vue-router'
import MenuItems from './MenuItems.vue'
import {routes} from "@/router";
import {Expand, Fold} from '@element-plus/icons-vue';
import {ref} from "vue";

const router = useRouter();
// 处理菜单点击事件
const handleMenuSelect = (routeName: string) => {
  router.push({name: routeName})
}

const finalRenderRoutes = routes
    .filter(route => route.meta?.['sidebar'] === true || route.name === 'Index')
    .flatMap(route => {
      if (route.path === '/') {
        return route.children;
      }

      return route;
    }) as RouteRecordRaw[];

const isCollapse = ref(false);

</script>

<template>
  <div class="sidebar-wrapper">
    <ElMenu :default-active="useRoute().name as string"
            :collapse="isCollapse"
            mode="vertical"
            @select="handleMenuSelect">
      <el-scrollbar>
        <MenuItems :routes="finalRenderRoutes"/>
      </el-scrollbar>
    </ElMenu>
    <el-tooltip :content="isCollapse ? '展开菜单' : '收起菜单'"
                :show-after="1000"
                :auto-close="1000"
    >
      <ElButton :icon="isCollapse ? Expand:Fold"
                @click="isCollapse = !isCollapse"
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
