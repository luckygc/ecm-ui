<script setup lang="ts">
import { ArrowDown, CircleClose, FolderDelete, Refresh } from '@element-plus/icons-vue'
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElTabPane,
  ElTabs,
} from 'element-plus'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageStore } from '@/stores/page-store'

const route = useRoute()
const router = useRouter()
const pageStore = usePageStore()

// 计算属性：从store获取数据
const visitedViews = computed(() => pageStore.visitedPages)
const activeTab = computed(() => pageStore.activePageFullPath)

// 监听路由变化
watch(
  () => route.fullPath,
  () => {
    pageStore.handleRouteChange(route)
  },
  { immediate: true }
)

// 处理标签点击
function handleTabClick(pane: any) {
  const fullPath = pane.paneName
  if (fullPath && fullPath !== route.fullPath) {
    router.push(fullPath)
  }
}

// 处理标签关闭
function handleTabRemove(targetPath: string | number) {
  const fullPath = String(targetPath)
  closeSelectedTag(fullPath)
}

// 关闭指定标签
function closeSelectedTag(fullPath: string) {
  const redirectPath = pageStore.closePage(fullPath)

  // 如果需要跳转到其他页面
  if (redirectPath) {
    router.push(redirectPath)
  }
}

// 刷新当前标签
function refreshCurrentTag() {
  const componentName = pageStore.refreshCurrentPage()
  if (componentName) {
    // 简单的刷新逻辑：重新加载当前路由
    router.go(0)
  }
}

// 关闭其他标签
function closeOthersTags() {
  pageStore.closeOtherPages()
}

// 关闭所有标签
function closeAllTags() {
  pageStore.closeAllPages()
  router.push('/')
}

// 处理下拉菜单命令
function handleCommand(command: string) {
  switch (command) {
    case 'refresh':
      refreshCurrentTag()
      break
    case 'closeOthers':
      closeOthersTags()
      break
    case 'closeAll':
      closeAllTags()
      break
  }
}
</script>

<template>
  <div class="tab-bar-container">
    <ElTabs :model-value="activeTab" type="card" closable class="tab-bar-tabs" @tab-click="handleTabClick"
      @tab-remove="handleTabRemove">
      <ElTabPane v-for="page in visitedViews" :key="page.fullPath"
        :label="(page.meta?.title as string) || (page.name as string) || page.fullPath" :name="page.fullPath" closable>
      </ElTabPane>
    </ElTabs>

    <!-- 操作按钮 -->
    <div v-if="visitedViews.length > 0" class="tabs-actions">
      <ElDropdown trigger="click" @command="handleCommand">
        <ElButton size="large" text>
          操作
          <ElIcon class="el-icon--right">
            <ArrowDown />
          </ElIcon>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="refresh">
              <ElIcon>
                <Refresh />
              </ElIcon>
              <span>刷新当前</span>
            </ElDropdownItem>
            <ElDropdownItem command="closeOthers">
              <ElIcon>
                <CircleClose />
              </ElIcon>
              <span>关闭其他</span>
            </ElDropdownItem>
            <ElDropdownItem command="closeAll">
              <ElIcon>
                <FolderDelete />
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

:deep(.el-tabs__nav-wrap) {
  margin-bottom: 0;
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
