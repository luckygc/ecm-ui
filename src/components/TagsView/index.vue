<script setup lang="ts">
import type { TagView } from '@/stores/tagsView'
import { ArrowDown, CircleClose, Close, FolderDelete, Refresh } from '@element-plus/icons-vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const scrollbarRef = ref()
const activeTagRef = ref()

// 获取已访问的视图
const visitedViews = computed(() => tagsViewStore.getVisitedViews)

// 滚动到当前激活的标签
function scrollToActiveTag() {
  nextTick(() => {
    if (activeTagRef.value && scrollbarRef.value) {
      // 获取容器和当前标签的位置信息
      const container = scrollbarRef.value.$el.querySelector('.el-scrollbar__wrap')
      const activeTag = activeTagRef.value

      if (!activeTag || !container)
        return

      // 计算滚动位置
      const tagOffsetLeft = activeTag.offsetLeft
      const tagWidth = activeTag.offsetWidth
      const containerWidth = container.offsetWidth
      const scrollLeft = container.scrollLeft

      // 如果标签不在可视区域内，则滚动到标签位置
      if (tagOffsetLeft < scrollLeft) {
        // 标签在左侧不可见区域
        container.scrollLeft = tagOffsetLeft - 20
      }
      else if (tagOffsetLeft + tagWidth > scrollLeft + containerWidth) {
        // 标签在右侧不可见区域
        container.scrollLeft = tagOffsetLeft + tagWidth - containerWidth + 20
      }
    }
  })
}

// 判断标签是否激活
function isActive(tag: TagView) {
  return tag.path === route.path
}

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

// 关闭选中的标签
function closeSelectedTag(view: TagView) {
  tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView(visitedViews.value, view)
  }
}

// 刷新选中的标签
function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(view)
  const { fullPath } = view
  router.replace({
    path: `/redirect${fullPath}`,
  })
}

// 关闭其他标签
function closeOthersTags() {
  if (selectedTag.value.path !== route.path) {
    router.push(selectedTag.value)
  }
  tagsViewStore.delOtherViews(selectedTag.value)
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

// 右键菜单相关
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>({})

// 打开右键菜单
function openMenu(e: MouseEvent, tag: TagView) {
  const menuMinWidth = 105
  const menuHeight = 160 // 估计的菜单高度

  // 获取页面滚动位置
  const scrollX = window.scrollX || window.pageXOffset
  const scrollY = window.scrollY || window.pageYOffset

  // 获取容器位置
  const container = document.querySelector('.tags-view-container')
  const containerRect = container?.getBoundingClientRect() || { left: 0, top: 0 }

  // 计算相对于视口的位置
  const offsetLeft = e.clientX
  const offsetTop = e.clientY

  // 计算相对于文档的位置
  const docLeft = offsetLeft + scrollX
  const docTop = offsetTop + scrollY

  // 考虑容器位置
  const relativeLeft = offsetLeft - containerRect.left

  // 计算最大位置，防止菜单超出视口
  const offsetWidth = document.body.offsetWidth
  const offsetHeight = document.body.offsetHeight
  const maxLeft = offsetWidth - menuMinWidth
  const maxTop = offsetHeight - menuHeight

  // 设置最终位置
  left.value = offsetLeft > maxLeft ? maxLeft : offsetLeft
  top.value = offsetTop + 5 // 稍微向下偏移，避免遮挡鼠标

  visible.value = true
  selectedTag.value = tag
}

// 关闭右键菜单
function closeMenu() {
  visible.value = false
}

// 监听路由变化，添加标签并滚动到当前标签
watch(
  () => route.path,
  () => {
    addTags()
    scrollToActiveTag()
  },
)

// 点击页面其他地方关闭右键菜单
function handleClickOutside() {
  closeMenu()
}

onMounted(() => {
  addTags()
  scrollToActiveTag()
  document.addEventListener('click', handleClickOutside)
})

// 处理下拉菜单命令
function handleCommand(command: string) {
  if (command === 'closeOthers') {
    closeOthersTags()
  }
  else if (command === 'closeAll') {
    closeAllTags()
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="tags-view-container">
    <el-scrollbar ref="scrollbarRef" class="tags-view-wrapper">
      <div class="tags-view-item-wrapper">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :ref="
            el => {
              if (isActive(tag) && el) activeTagRef = el
            }
          "
          :to="{ path: tag.path, query: tag.query }"
          class="tags-view-item"
          :class="isActive(tag) ? 'active' : ''"
          @contextmenu.prevent="openMenu($event, tag)"
        >
          <el-icon v-if="tag.icon" class="tag-icon">
            <component :is="tag.icon" />
          </el-icon>
          <span>{{ tag.title }}</span>
          <el-icon
            v-if="!tag.meta?.affix"
            class="close-icon"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <Close />
          </el-icon>
        </router-link>
      </div>
    </el-scrollbar>

    <!-- 操作按钮 -->
    <div v-if="visitedViews.length > 0" class="tags-view-actions">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button size="small" plain>
          操作
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOthers">
              <el-icon><CircleClose /></el-icon>
              <span>关闭其他</span>
            </el-dropdown-item>
            <el-dropdown-item command="closeAll">
              <el-icon><FolderDelete /></el-icon>
              <span>关闭所有</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 右键菜单 -->
    <ul v-show="visible" :style="{ left: `${left}px`, top: `${top}px` }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <el-icon><Refresh /></el-icon>
        <span>刷新</span>
      </li>
      <li v-if="!selectedTag.meta?.affix" @click="closeSelectedTag(selectedTag)">
        <el-icon><Close /></el-icon>
        <span>关闭</span>
      </li>
      <li @click="closeOthersTags">
        <el-icon><CircleClose /></el-icon>
        <span>关闭其他</span>
      </li>
      <li @click="closeAllTags">
        <el-icon><FolderDelete /></el-icon>
        <span>关闭所有</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
  display: flex;
}
</style>
