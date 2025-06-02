<script setup lang="ts">
import type { PageObject } from '@/types/page-types'
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageStore } from '@/stores/page-store'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const pageStore = usePageStore()
const appStore = useAppStore()

// 计算属性：获取所有页面
const pages = computed(() => Array.from(pageStore.pages.values()))
const visitedViews = computed(() => pages.value)

// 当前激活的标签 - 使用fullPath作为标识
const activeTab = ref<string>()

router.beforeEach((to, _from, next) => {
  activeTab.value = to.fullPath
  next();
});

// 处理标签点击
function handleTabClick(pane: any) {
  const fullPath = pane.paneName
  // 根据fullPath查找对应的页面信息
  const targetPage = visitedViews.value.find((page: PageObject) => page.fullPath === fullPath)
  if (targetPage && targetPage.fullPath) {
    // 跳转到目标路由
    router.push(targetPage.fullPath)
  }
}

// 处理标签关闭
function handleTabRemove(targetPath: string | number) {
  const fullPath = String(targetPath)
  const view = visitedViews.value.find((item: PageObject) => item.fullPath === fullPath)
  if (view) {
    closeSelectedTag(view)
  }
}

// 关闭选中的标签
function closeSelectedTag(view: PageObject) {
  pageStore.removePageByFullPath(view.fullPath)
  if (view.fullPath === route.fullPath) {
    toLastView(visitedViews.value)
  }
}

function refreshCurrentTag() {
  pageStore.refreshActivePage()
  appStore.refreshMainContent()
}

// 关闭其他标签
function closeOthersTags() {
  const currentView = visitedViews.value.find((item: PageObject) => item.fullPath === route.fullPath)
  if (currentView) {
    // 关闭其他页面：保留当前页面
    visitedViews.value.forEach((page: PageObject) => {
      if (page.fullPath !== currentView.fullPath) {
        pageStore.removePageByFullPath(page.fullPath)
      }
    })
  }
}

// 关闭所有标签
function closeAllTags() {
  // 关闭所有页面
  visitedViews.value.forEach((page: PageObject) => {
    pageStore.removePageByFullPath(page.fullPath)
  })
  router.push('/')
}

// 跳转到最后一个标签
function toLastView(visitedViews: PageObject[]) {
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
      <ElTabPane v-for="page in pages" :key="page.key" :label="page.title" :name="page.fullPath" closable>
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
