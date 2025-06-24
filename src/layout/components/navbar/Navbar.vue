<script setup lang="ts">
import {
  ElAvatar,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import {ArrowRight, Expand, Fold} from '@element-plus/icons-vue';
import {useRoute, useRouter} from 'vue-router';
import {useUserStore} from '@/stores';
import {useLayoutStore} from '@/stores/modules/layout-store.ts';
import {storeToRefs} from 'pinia';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
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
        文档和记录仓库
      </div>

      <ElBreadcrumb>
        <ElBreadcrumbItem v-for="breadcrumb in route.matched" :key="breadcrumb.name">
          <div style="display: flex; align-items: center; gap: 4px;">
            <div>{{ breadcrumb.meta?.['title'] }}</div>
          </div>
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <ElDropdown @command="handleCommand">
      <div class="user-info">
        <ElAvatar :size="32">
          {{ userInfo?.fullName?.charAt(0).toUpperCase() || '' }}
        </ElAvatar>
        <span class="username">{{ userInfo?.username || '' }}</span>
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
</template>

<style scoped>
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 16px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
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
</style>
