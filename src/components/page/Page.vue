<script setup lang="ts">
import { useSlots, computed } from 'vue'

const slots = useSlots()

// 检测 toolbar 插槽是否有内容
const hasToolbarContent = computed(() => {
  return !!slots?.['toolbar']
})
</script>

<template>
  <div class="page">
    <div class="page-content" :class="{ 'has-toolbar': hasToolbarContent }">
      <slot></slot>
    </div>

    <!-- Toolbar直接放在Page组件内部 -->
    <div class="toolbar" v-if="hasToolbarContent">
      <slot name="toolbar"></slot>
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

.page-content {
  overflow: auto;
  padding: var(--page-padding);
}

.page-content.has-toolbar {
  height: calc(100% - var(--page-toolbar-height));
}

.toolbar {
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  border-top: 1px solid var(--border-color);
  height: var(--page-toolbar-height);
  padding: var(--page-toolbar-padding);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 现代化滚动条样式 */
.page-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: transparent;
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>