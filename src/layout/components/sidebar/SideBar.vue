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
    <div class="menu-container">
      <el-scrollbar>
        <ElMenu :default-active="useRoute().name as string"
                :collapse="isCollapse"
                mode="vertical"
                @select="handleMenuSelect"
        >

          <MenuItems :routes="finalRenderRoutes"/>
        </ElMenu>
      </el-scrollbar>
    </div>

    <div class="btn-container">
      <el-tooltip :content="isCollapse ? '展开菜单' : '收起菜单'">
        <ElButton :icon="isCollapse ? Expand:Fold"
                  @click="isCollapse = !isCollapse"
                  text
                  bg
        />
      </el-tooltip>
    </div>

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

.menu-container {
  height: calc(100vh - 90px);
}

.btn-container {
  padding: 0 var(--el-menu-base-level-padding);
}
</style>
