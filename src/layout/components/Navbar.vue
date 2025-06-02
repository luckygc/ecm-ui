<script setup lang="ts">
import { ElBreadcrumb, ElBreadcrumbItem, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElMessageBox, ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 处理下拉菜单命令
function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      ElMessage.info('个人信息功能待开发');
      break;
    case 'settings':
      ElMessage.info('设置功能待开发');
      break;
    case 'logout':
      handleLogout();
      break;
  }
}

// 处理登出
async function handleLogout() {
  try {
    await ElMessageBox.confirm('确认退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    userStore.logout();
    ElMessage.success('已退出登录');
    router.push('/login');
  } catch {
    // 用户取消操作
  }
}
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
      <!-- 用户信息下拉菜单 -->
      <ElDropdown @command="handleCommand">
        <div class="user-info">
          <ElAvatar :size="32" :src="userInfo?.avatar">
            {{ userInfo?.nickname?.[0] || userInfo?.username?.[0] || 'U' }}
          </ElAvatar>
          <span class="username">{{ userInfo?.nickname || userInfo?.username || '用户' }}</span>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="profile">个人信息</ElDropdownItem>
            <ElDropdownItem command="settings">设置</ElDropdownItem>
            <ElDropdownItem divided command="logout">退出登录</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
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

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>
