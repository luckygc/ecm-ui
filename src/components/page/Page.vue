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

.toolbar {
  background-color: #fff;
  border-top: 1px solid var(--el-border-color-lighter);
  height: var(--page-toolbar-height);
  padding: var(--page-toolbar-padding);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
</style>