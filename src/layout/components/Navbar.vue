<script setup lang="ts">
import { ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
</script>

<template>
  <div class="navbar-container">
    <ElBreadcrumb>
    </ElBreadcrumb>
    <!-- 导航菜单 -->
    <ElMenu class="navbar-menu" mode="horizontal" :ellipsis="false">

    </ElMenu>
  </div>
</template>

<style scoped>
.navbar-container {
  display: flex;
  align-items: center;
  height: 100%;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: none;
  padding: 0 16px;
}

.navbar-menu {
  flex: 1;
  border-bottom: none;
}

.navbar-menu .el-menu-item,
.navbar-menu .el-sub-menu__title {
  border-bottom: none;
  margin-right: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.navbar-menu .el-menu-item:hover,
.navbar-menu .el-sub-menu__title:hover {
  background-color: #f5f7fa;
}
</style>
