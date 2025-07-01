<script setup lang="ts">
import {
  ElAvatar,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu, ElIcon,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import {useRoute} from 'vue-router';
import {useAuthStore} from '@/store/modules/auth/auth-store.ts';
import {getConfig} from "@/utils/config-utils.ts";
import routeMetaUtils from "@/utils/route/route-meta-utils.ts";
import {ArrowDown, UserFilled} from "@element-plus/icons-vue";

const route = useRoute();
const authStore = useAuthStore();

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

    await authStore.logout();

  } catch {
    // 用户取消操作
  }
}
</script>

<template>
  <div class="navbar-container">
    <div style="display: flex; align-items: center; gap: 16px;">
      <div class="logo-area">
        {{ getConfig().appName }}
      </div>

      <el-divider direction="vertical"></el-divider>

      <ElBreadcrumb>
        <ElBreadcrumbItem v-for="_route in route.matched" :key="_route.name">
          <div style="display: flex; align-items: center; gap: 4px;">
            <div>{{ routeMetaUtils.getTitle(_route) }}</div>
          </div>
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <el-dropdown trigger="click" @command="handleCommand">
      <div class="user-info">
        <el-avatar :icon="UserFilled" size="small"/>
        <span class="username">{{ authStore.userInfo?.fullName || '未登录' }}</span>
        <ElIcon>
          <ArrowDown/>
        </ElIcon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item command="settings">设置</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.el-breadcrumb__separator {
  font-weight: normal;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 16px;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.logo-area {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-primary);
  padding: 8px 12px;
  border-radius: 6px;
}

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
}
</style>
