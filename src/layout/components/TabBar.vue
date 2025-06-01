<script setup lang="ts">
import type { TagView } from '@/stores/tagsView'
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
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const appStore = useAppStore()

// 获取已访问的视图
const visitedViews = computed(() => tagsViewStore.getVisitedViews)

// 当前激活的标签
const activeTab = computed({
  get: () => route.path,
  set: (val) => {
    if (val !== route.path) {
      router.push(val)
    }
  },
})

// 添加标签
function addTags() {
  const { name, path, meta, fullPath, query } = route
  if (name) {
    tagsViewStore.addView({
      name,
      path,
      meta,
      fullPath,
      query,
    })
  }
}

// 处理标签点击
function handleTabClick() {
  // 标签点击时，路由已经通过activeTab的set方法处理了
}

// 处理标签关闭
function handleTabRemove(targetPath: string) {
  const view = visitedViews.value.find(item => item.path === targetPath)
  if (view) {
    closeSelectedTag(view)
  }
}

// 关闭选中的标签
function closeSelectedTag(view: TagView) {
  tagsViewStore.delView(view)
  if (view.path === route.path) {
    toLastView(visitedViews.value, view)
  }
}

function refreshCurrentTag() {
  const view = visitedViews.value.find(item => item.path === route.path)
  if (view) {
    tagsViewStore.delCachedView(view)
    appStore.refreshMainContent()
  }
}

// 关闭其他标签
function closeOthersTags() {
  const currentView = visitedViews.value.find(item => item.path === route.path)
  if (currentView) {
    tagsViewStore.delOtherViews(currentView)
  }
}

// 关闭所有标签
function closeAllTags() {
  tagsViewStore.delAllViews()
  router.push('/')
}

// 跳转到最后一个标签
function toLastView(visitedViews: TagView[], view: TagView) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath || latestView.path || '/')
  }
  else {
    // 如果没有标签，则跳转到首页
    if (view.name === 'Dashboard') {
      router.replace({ path: `/redirect${view.path}` })
    }
    else {
      router.push('/')
    }
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

// 监听路由变化，添加标签
watch(
  () => route.path,
  () => {
    addTags()
  },
)

onMounted(() => {
  addTags()
})
</script>

<template>
  <div class="tab-bar-container">
    <ElTabs v-model="activeTab" type="card" closable class="tab-bar-tabs" @tab-click="handleTabClick">
      <ElTabPane v-for="item in visitedViews" :key="item.path" :label="item.title" :name="item.path">
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
}

.tab-bar-tabs {
  flex: 1;
  min-width: 0;
  /* 确保内容可以正确收缩 */
}
</style>
