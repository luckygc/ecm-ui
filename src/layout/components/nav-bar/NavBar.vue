<script setup lang="ts">
import {
  ElAvatar,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import {useRoute, useRouter} from 'vue-router';
import {useAuthStore} from '@/store/modules/auth/auth-store.ts';
import {storeToRefs} from 'pinia';
import {getConfig} from "@/utils/config-utils.ts";
import routeMetaUtils from "@/utils/route/route-meta-utils.ts";
import {UserFilled} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const userStore = useAuthStore();
const {userInfo} = storeToRefs(userStore);

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

    await userStore.logout();
    ElMessage.success('已退出登录');
    await router.push('/login');
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

    <el-dropdown @command="handleCommand">
      <div class="user-info">
        <el-avatar :icon="UserFilled"/>
        <span class="username">{{ userInfo?.username || '未登录' }}</span>
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

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-info:hover {
  background-color: var(--el-fill-color-light);
}

.username {
  font-weight: 500;
  color: var(--el-text-color-primary);
}
</style>
