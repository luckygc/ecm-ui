<script setup lang="ts">
import { ArrowDown, UserFilled } from '@element-plus/icons-vue'
import {
  ElAvatar,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/store/modules/auth/auth-store'
import { useLayoutStore } from '~/store/modules/layout/layout-store'
import { getConfig } from '~/utils/config-utils'
import routeMetaUtils from '~/utils/route/route-meta-utils'

const route = useRoute()
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
  <div class="navbar-container">

    <ElButton circle text size="large" @click="layoutStore.toggleASideCollapsed">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="#333"
          d="M7.95 11.95h32M7.95 23.95h32M7.95 35.95h32" data-follow-stroke="#333" />
      </svg>
    </ElButton>

    <div class="logo-area">
      {{ getConfig().appName }}
    </div>

    <ElBreadcrumb>
      <ElBreadcrumbItem v-for="_route in route.matched" :key="_route.name">
        <div style="display: flex; align-items: center; gap: 4px;">
          <div>{{ routeMetaUtils.getTitle(_route) }}</div>
        </div>
      </ElBreadcrumbItem>
    </ElBreadcrumb>

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

.navbar-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
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
