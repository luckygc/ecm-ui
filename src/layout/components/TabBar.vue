<script setup lang="ts">
import type { PageInfo } from '@/stores/route'
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRouteStore } from '@/stores/route'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const routeStore = useRouteStore()
const appStore = useAppStore()

// 获取已访问的视图 - 使用routeStore而不是tagsViewStore
const visitedViews = computed(() => routeStore.visitedPages)

// 当前激活的标签
const activeTab = computed({
  get: () => route.path,
  set: (val) => {
    if (val !== route.path) {
      router.push(val)
    }
  },
})

// 处理标签点击
function handleTabClick() {
  // 标签点击时，路由已经通过activeTab的set方法处理了
}

// 处理标签关闭
function handleTabRemove(targetPath: string | number) {
  const path = String(targetPath)
  const view = visitedViews.value.find(item => item.path === path)
  if (view) {
    closeSelectedTag(view)
  }
}

// 关闭选中的标签
function closeSelectedTag(view: PageInfo) {
  routeStore.delVisitedPage(view)
  if (view.path === route.path) {
    toLastView(visitedViews.value)
  }
}

function refreshCurrentTag() {
  const view = visitedViews.value.find(item => item.path === route.path)
  if (view && view.name) {
    routeStore.delCachedPage(view.name)
    appStore.refreshMainContent()
  }
}

// 关闭其他标签
function closeOthersTags() {
  const currentView = visitedViews.value.find(item => item.path === route.path)
  if (currentView) {
    routeStore.delOtherVisitedPages(currentView)
  }
}

// 关闭所有标签
function closeAllTags() {
  routeStore.delAllVisitedPages()
  router.push('/')
}

// 跳转到最后一个标签
function toLastView(visitedViews: PageInfo[]) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath || latestView.path || '/')
  }
  else {
    // 如果没有标签，则跳转到首页
    router.push('/')
  }
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

// 注意：路由变化的监听已经在 routeHelper 中统一处理
// 这里不需要重复监听，避免重复添加页签
</script>

<template>
  <div class="tab-bar-container">
    <ElTabs v-model="activeTab" type="card" closable class="tab-bar-tabs" @tab-click="handleTabClick"
      @tab-remove="handleTabRemove">
      <ElTabPane v-for="item in visitedViews" :key="item.path" :label="item.title" :name="item.path"
        :closable="!item.meta?.affix">
        <template #label>
          <ElIcon v-if="item.icon" class="tab-icon">
            <component :is="item.icon" />
          </ElIcon>
          <span>{{ item.title }}</span>
        </template>
      </ElTabPane>
    </ElTabs>

    <!-- 操作按钮 -->
    <div v-if="visitedViews.length > 0" class="tabs-actions">
      <ElDropdown trigger="click" @command="handleCommand">
        <ElButton size="small" plain class="action-button">
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

/* 去除 tabs 组件的阴影和边框 */
/* .tab-bar-tabs :deep(.el-tabs__header) {
  box-shadow: none;
  border-bottom: none;
  margin: 0;
} */

.tab-bar-tabs :deep(.el-tabs__nav-wrap) {
  box-shadow: none;
  border-bottom: none;
}

.tab-bar-tabs :deep(.el-tabs__nav-scroll) {
  box-shadow: none;
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__nav) {
  border-radius: 0;
  border-left: none;
  border-top: none;
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

:deep(.el-tabs--card>.el-tabs__header) {
  border-left: none;
  border-right: none;
}
</style>
