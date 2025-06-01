<script setup lang="ts">
import type { TagView } from '@/stores/tagsView'
import { ArrowDown, CircleClose, FolderDelete, Refresh } from '@element-plus/icons-vue'
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
function handleTabClick(tab: any) {
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
  <div class="el-tabs-container">
    <el-tabs v-model="activeTab" type="card" closable @tab-click="handleTabClick" @tab-remove="handleTabRemove">
      <el-tab-pane v-for="item in visitedViews" :key="item.path" :label="item.title" :name="item.path"
        :closable="!item.meta?.affix">
        <template #label>
          <el-icon v-if="item.icon" class="tab-icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 操作按钮 -->
    <div v-if="visitedViews.length > 0" class="tabs-actions">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button size="small" plain>
          操作
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh">
              <el-icon>
                <Refresh />
              </el-icon>
              <span>刷新当前</span>
            </el-dropdown-item>
            <el-dropdown-item command="closeOthers">
              <el-icon>
                <CircleClose />
              </el-icon>
              <span>关闭其他</span>
            </el-dropdown-item>
            <el-dropdown-item command="closeAll">
              <el-icon>
                <FolderDelete />
              </el-icon>
              <span>关闭所有</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.el-tabs-container {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 16px;
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  /* 确保内边距不会增加元素的实际宽度 */
  overflow: hidden;
  /* 防止内容溢出 */
}

:deep(.el-tabs) {
  flex: 1;
  width: 0;
  /* 确保tabs不会导致父容器溢出 */
  min-width: 0;
  /* 确保内容可以正确收缩 */
}

:deep(.el-tabs__header) {
  margin: 0;
  overflow: hidden;
  /* 防止内容溢出 */
}

:deep(.el-tabs__nav-wrap) {
  overflow: hidden;
  /* 防止内容溢出 */
}

:deep(.el-tabs__nav) {
  border: none;
}

:deep(.el-tabs__item) {
  height: 40px;
  line-height: 40px;
  border: none;
  margin-right: 5px;
  padding: 0 15px;
  white-space: nowrap;
  /* 防止文本换行 */
}

:deep(.el-tabs__item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
  border-bottom: none;
}

:deep(.el-tabs__item:hover) {
  color: #409eff;
}

.tab-icon {
  margin-right: 5px;
  font-size: 14px;
}

.tabs-actions {
  margin-left: 10px;
  border-left: 1px solid #dcdfe6;
  padding-left: 10px;
  flex-shrink: 0;
  /* 防止操作按钮被压缩 */
}
</style>
