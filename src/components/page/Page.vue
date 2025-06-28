<script setup lang="ts">
import {useSlots, computed} from 'vue'

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
    <div class="toolbar" v-if="hasToolbarContent">
      <slot name="toolbar"></slot>
    </div>
  </div>
</template>

<style scoped>
.page {
  overflow: hidden;
  height: 100%;
}

.page-content {
  overflow: auto;
  height: 100%;
  width: 100%;
  padding: var(--page-padding);
}

.page:has(.has-toolbar) .page-content {
  height: calc(100% - var(--page-toolbar-height));
}

.toolbar {
  overflow: hidden;
  width: 100%;
  height: var(--page-toolbar-height);
  background-color: #fff;
  box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.1);
  padding: var(--page-toolbar-padding);
}
</style>