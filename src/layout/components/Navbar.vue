<script setup lang="ts">
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus';
import { useRoute } from 'vue-router';

const route = useRoute();

</script>

<template>
  <div class="navbar-container">
    <!-- 面包屑导航 -->
    <ElBreadcrumb class="breadcrumb" separator="/">
      <ElBreadcrumbItem v-for="breadcrumb in route.matched" :key="breadcrumb.name">
        <div class="breadcrumb-content">
          <!-- <ElIcon v-if="breadcrumb.meta.icon" class="breadcrumb-icon">
            <component :is="breadcrumb.meta.icon" />
          </ElIcon> -->
          <span class="breadcrumb-title">{{ breadcrumb.meta.title }}</span>
        </div>
      </ElBreadcrumbItem>
    </ElBreadcrumb>

    <!-- 右侧操作区域 -->
    <div class="navbar-actions">
      <!-- 这里可以添加其他操作按钮，如用户信息、设置等 -->
    </div>
  </div>
</template>

<style scoped>
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: none;
  padding: 0 16px;
}

/* 面包屑样式 */
.breadcrumb {
  flex: 1;
}

.breadcrumb-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-icon {
  font-size: 14px;
  color: #606266;
}

.breadcrumb-title {
  font-size: 14px;
  color: #606266;
}

/* 可点击的面包屑项 */
.breadcrumb-clickable {
  cursor: pointer;
}

.breadcrumb-clickable:hover .breadcrumb-icon,
.breadcrumb-clickable:hover .breadcrumb-title {
  color: #409eff;
}

.breadcrumb-clickable:hover .breadcrumb-content {
  transition: color 0.3s ease;
}

/* 当前页面的面包屑项（不可点击） */
.breadcrumb-content .breadcrumb-title {
  font-weight: normal;
}

/* 最后一个面包屑项（当前页面）的样式 */
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133;
  font-weight: 500;
}

:deep(.el-breadcrumb__item:last-child .breadcrumb-icon) {
  color: #303133;
}

/* 面包屑分隔符样式 */
:deep(.el-breadcrumb__separator) {
  color: #c0c4cc;
  margin: 0 8px;
}

/* 右侧操作区域 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
