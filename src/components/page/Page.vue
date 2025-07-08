<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'

interface Props {
  layout?: 'grid' | 'fixed'
}

withDefaults(defineProps<Props>(), {
  layout: 'grid',
})

const pageContentRef = ref<HTMLElement>()
const pageScrollTop = ref<number>(0)

onActivated(() => {
  if (pageContentRef.value) {
    pageContentRef.value.scrollTop = pageScrollTop.value
  }
})

onDeactivated(() => {
  if (pageContentRef.value) {
    pageScrollTop.value = pageContentRef.value.scrollTop
  }
})
</script>

<template>
  <div class="page" :class="{ 'page-fixed': layout === 'fixed' }">
    <div ref="pageContentRef" class="page-content" :class="{ 'has-toolbar': !!$slots['tool-bar'] }">
      <slot />
    </div>

    <!-- Toolbar直接放在Page组件内部 -->
    <div v-if="$slots['tool-bar']" class="tool-bar">
      <slot name="tool-bar" />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  overflow: hidden;
}

.page-fixed {
  background: var(--layout-bg);
}

.page-content {
  overflow: auto;
  padding: var(--page-padding);
}

.page-fixed .page-content {
  background: transparent;
}

.tool-bar {
  background-color: #fff;
  border-top: 1px solid var(--el-border-color-lighter);
  height: var(--page-toolbar-height);
  padding: var(--page-toolbar-padding);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.page-fixed .tool-bar {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
}

/* 滚动条样式 */
.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.page-fixed .page-content::-webkit-scrollbar-track {
  background: transparent;
}

.page-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.page-fixed .page-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.page-fixed .page-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
