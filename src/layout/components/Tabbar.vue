<script setup lang="ts">
import {ArrowDown, CircleClose, FolderDelete, Refresh} from '@element-plus/icons-vue'
import {ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElTabPane, ElTabs,} from 'element-plus'
import {usePageStore} from '@/stores/modules/page-store.ts'
import router from "@/router";
import {useRoute} from "vue-router";

const routeStore = usePageStore();

const route = useRoute();

// 处理刷新按钮点击
function handleRefresh() {
  routeStore.refreshPage();
}

// 处理下拉菜单命令
function handleCommand(command: string) {
  switch (command) {
    case 'closeOthers':
      routeStore.closeOtherPage()
      break
    case 'closeAll':
      routeStore.closeAllPage()
      break
  }
}
</script>

<template>
  <div class="tab-bar-container">
    <ElTabs :model-value="route.fullPath" type="border-card" closable class="tab-bar-tabs"
            @tab-click="({paneName})=> router.push(paneName as string)"
            @tab-remove="(name) => routeStore.closePage(name as string)">
      <ElTabPane v-for="page in routeStore.pages" :key="page.fullPath"
                 :label="page.meta?.['title'] as string" :name="page.fullPath"
      >
      </ElTabPane>
    </ElTabs>

    <!-- 操作按钮 -->
    <div v-if="routeStore.pages.length > 0" class="tabs-actions">
      <!-- 刷新按钮 -->
      <ElButton size="large" text @click="handleRefresh" class="refresh-btn">
        <ElIcon>
          <Refresh/>
        </ElIcon>
        <span>刷新</span>
      </ElButton>

      <!-- 下拉操作菜单 -->
      <ElDropdown trigger="click" @command="handleCommand">
        <ElButton size="large" text>
          操作
          <ElIcon class="el-icon--right">
            <ArrowDown/>
          </ElIcon>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="closeOthers">
              <ElIcon>
                <CircleClose/>
              </ElIcon>
              <span>关闭其他</span>
            </ElDropdownItem>
            <ElDropdownItem command="closeAll">
              <ElIcon>
                <FolderDelete/>
              </ElIcon>
              <span>关闭所有</span>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<style scoped>
.tab-bar-container {
  display: flex;
  width: 100%;
  height: auto;
  box-shadow: none;
  border-bottom: none;
  background-color: #fff;
}

.tab-bar-tabs {
  flex: 1;
  min-width: 0;
  /* 确保内容可以正确收缩 */
}

.tabs-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn {
  margin-right: 4px;
}

:deep(.el-tabs__nav-wrap) {
  margin-bottom: 0;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs--card>.el-tabs__header) {
  border-left: none;
  border-right: none;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__nav) {
  border-radius: 0;
  border: none;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item) {
  border: none;
}

:deep(.el-tabs__nav-prev) {
  border-right: 1px solid var(--el-border-color-light)
}


:deep(.el-tabs__nav-next) {
  border-left: 1px solid var(--el-border-color-light)
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable) {
  border-bottom: 2px solid var(--el-color-primary);
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item:hover) {
  background-color: var(--el-color-primary-light-9);
}
</style>
