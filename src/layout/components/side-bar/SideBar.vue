<script setup lang="ts">
import {ElMenu} from 'element-plus'
import {type RouteRecordRaw, useRoute, useRouter} from 'vue-router'
import MenuItems from './MenuItems.vue'
import {routes} from "@/router/modules";
import {Expand, Fold} from '@element-plus/icons-vue';
import {ref} from "vue";
import routeMetaUtils from '@/utils/route/route-meta-utils.ts'

const route = useRoute();
const router = useRouter();
// 处理菜单点击事件
const handleMenuSelect = (routeName: string) => {
  router.push({name: routeName})
}

const finalRenderRoutes = routes
    .filter(r => routeMetaUtils.isSideBar(r) || r.name === 'Index')
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
        <ElMenu
            :default-active="route.name as string"
            :collapse="isCollapse"
            mode="vertical"
            @select="handleMenuSelect"
            background-color="#545c64"
            text-color="#fff"
        >
          <MenuItems :routes="finalRenderRoutes"/>
        </ElMenu>
      </el-scrollbar>
    </div>

    <div class="btn-container">
      <ElButton :icon="isCollapse ? Expand : Fold" @click="isCollapse = !isCollapse" text bg/>
    </div>

  </div>
</template>

<style scoped>
.sidebar-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #545c64;
  border-right: 1px solid var(--el-border-color-lighter);
}

.sidebar-wrapper:not(:has(.el-menu--collapse)) .el-menu {
  width: var(--layout-aside-width);
}

.el-menu {
  flex: 1;
  border-right: none;
}

.menu-container {
  flex: 1;
  overflow: hidden;
}

.btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  flex-shrink: 0;
}
</style>
