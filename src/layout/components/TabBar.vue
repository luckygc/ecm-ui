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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 页面管理数据
const pages = ref<Map<string, PageObject>>(new Map())
const activeTab = ref<string>('')

// 计算属性：获取页面列表
const visitedViews = computed(() => Array.from(pages.value.values()))

// 创建页面对象
function createPageObject(route: any): PageObject {
  return {
    name: route.name || 'Unknown',
    title: route.meta?.title || route.name || '未知页面',
    path: route.path,
    fullPath: route.fullPath,
    key: route.name || route.fullPath,
    icon: route.meta?.icon,
    hidden: route.meta?.hidden || false,
    cached: route.meta?.keepAlive !== false
  }
}

// 添加页面
function addPage(route: any) {
  const fullPath = route.fullPath

  // 如果页面已存在，不重复添加
  if (pages.value.has(fullPath)) {
    return
  }

  const pageObject = createPageObject(route)
  pages.value.set(fullPath, pageObject)
  console.log('添加页面:', pageObject.title, fullPath)
}

// 切换到指定页面
function switchToPage(fullPath: string) {
  activeTab.value = fullPath
  console.log('切换到页面:', fullPath)
}

// 监听路由变化
watch(
  () => route.fullPath,
  (newFullPath) => {
    // 跳过隐藏的路由
    if (route.meta?.hidden) {
      return
    }

    console.log('路由变化:', newFullPath)

    // 检查页面是否已存在
    if (pages.value.has(newFullPath)) {
      // 存在则切换到该页面
      switchToPage(newFullPath)
    } else {
      // 不存在则添加新页面
      addPage(route)
      switchToPage(newFullPath)
    }
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
  pages.value.delete(fullPath)

  // 如果关闭的是当前激活的标签
  if (activeTab.value === fullPath) {
    toLastView()
  }
}

// 跳转到最后一个标签
function toLastView() {
  const allPages = Array.from(pages.value.values())
  const latestView = allPages[allPages.length - 1]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // 如果没有标签，则跳转到首页
    router.push('/')
  }
}

// 刷新当前标签
function refreshCurrentTag() {
  const currentPage = pages.value.get(activeTab.value)
  if (currentPage) {
    // 更新页面的key来强制刷新
    currentPage.key = `${currentPage.name}-${Date.now()}`
    appStore.refreshComponent(currentPage.name)
  }
}

// 关闭其他标签
function closeOthersTags() {
  const currentFullPath = activeTab.value
  const currentPage = pages.value.get(currentFullPath)

  // 清空所有页面，只保留当前页面
  pages.value.clear()
  if (currentPage) {
    pages.value.set(currentFullPath, currentPage)
  }
}

// 关闭所有标签
function closeAllTags() {
  pages.value.clear()
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
    <ElTabs v-model="activeTab" type="card" closable class="tab-bar-tabs" @tab-click="handleTabClick"
      @tab-remove="handleTabRemove">
      <ElTabPane v-for="page in visitedViews" :key="page.key" :label="page.title" :name="page.fullPath" closable>
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
