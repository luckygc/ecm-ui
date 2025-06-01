<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const sidebarOpened = computed(() => appStore.getSidebarStatus)

function toggleSidebar() {
  appStore.toggleSidebar()
}
</script>

<template>
  <div class="navbar-container">
    <!-- 折叠按钮 -->
    <div class="collapse-btn-wrapper">
      <ElButton :icon="sidebarOpened ? Fold : Expand" @click="toggleSidebar" class="collapse-btn" text size="large" />
    </div>

    <!-- 导航菜单 -->
    <ElMenu class="navbar-menu" mode="horizontal" :ellipsis="false">
      <ElMenuItem index="1">
        Processing Center
      </ElMenuItem>
      <ElSubMenu index="2">
        <template #title>
          Workspace
        </template>
        <ElMenuItem index="2-1">
          item one
        </ElMenuItem>
        <ElMenuItem index="2-2">
          item two
        </ElMenuItem>
        <ElMenuItem index="2-3">
          item three
        </ElMenuItem>
        <ElSubMenu index="2-4">
          <template #title>
            item four
          </template>
          <ElMenuItem index="2-4-1">
            item one
          </ElMenuItem>
          <ElMenuItem index="2-4-2">
            item two
          </ElMenuItem>
          <ElMenuItem index="2-4-3">
            item three
          </ElMenuItem>
        </ElSubMenu>
      </ElSubMenu>
    </ElMenu>
  </div>
</template>

<style scoped>
.navbar-container {
  display: flex;
  align-items: center;
  height: 100%;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.collapse-btn-wrapper {
  padding: 0 16px;
  border-right: 1px solid #e6e6e6;
  height: 100%;
  display: flex;
  align-items: center;
}

.collapse-btn {
  color: #606266;
  transition: color 0.3s ease;
}

.collapse-btn:hover {
  color: #409eff;
}

.navbar-menu {
  flex: 1;
  border-bottom: none;
}

.navbar-menu .el-menu-item,
.navbar-menu .el-sub-menu__title {
  border-bottom: none;
}
</style>
