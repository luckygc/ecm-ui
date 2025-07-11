<script setup lang="ts">
import { ArrowDown, UserFilled } from '@element-plus/icons-vue'
import {
  ElAvatar,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import { useAuthStore } from '~/store/modules/auth/auth-store'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import { getConfig } from '~/utils/config-utils'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()

// 处理下拉菜单命令
function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      ElMessage.info('个人信息功能待开发')
      break
    case 'settings':
      ElMessage.info('设置功能待开发')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理登出
async function handleLogout() {
  try {
    await ElMessageBox.confirm('确认退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await authStore.logout()
  }
  catch {
    // 用户取消操作
  }
}
</script>

<template>
  <div class="ecm-nav-bar">
    <ElButton circle text size="large" @click="layoutStore.toggleAsideCollapsed">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
        <path
          stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#333"
          d="M7.95 11.95h32M7.95 23.95h32M7.95 35.95h32" data-follow-stroke="#333"
        />
      </svg>
    </ElButton>

    <div class="logo-area">
      {{ getConfig().appName }}
    </div>

    <div style="flex: 1;" />

    <ElDropdown trigger="click" @command="handleCommand">
      <div class="user-info">
        <ElAvatar :icon="UserFilled" size="small" />
        <span class="username">{{ authStore.userInfo?.fullName || '未登录' }}</span>
        <ElIcon>
          <ArrowDown />
        </ElIcon>
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem command="profile">
            个人信息
          </ElDropdownItem>
          <ElDropdownItem command="settings">
            设置
          </ElDropdownItem>
          <ElDropdownItem divided command="logout">
            退出登录
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<style scoped>
.el-breadcrumb__separator {
  font-weight: normal;
}

.ecm-nav-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  height: var(--ecm-nav-bar-height);
  background-color: transparent;
}

.logo-area {
  height: 32px;
  margin-block: 0;
  margin-inline: 0;
  margin-inline-start: 8px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  font-size: 18px;
  line-height: 32px;
}

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
}
</style>
