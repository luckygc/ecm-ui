<script setup lang="ts">
import {computed, onActivated, onDeactivated, ref, useSlots} from 'vue'

const slots = useSlots()

const pageContentRef = ref<HTMLElement>();
const pageScrollTop = ref<number>(0);

// 检测 toolbar 插槽是否有内容
const hasToolbarContent = computed(() => {
  return !!slots?.['toolbar']
})

if (typeof onActivated === 'function') {
  onActivated(() => {
    if (pageContentRef.value) {
      pageContentRef.value.scrollTop = pageScrollTop.value;
    }
  })
}
if (typeof onDeactivated === 'function') {
  onDeactivated(() => {
    if (pageContentRef.value) {
      pageScrollTop.value = pageContentRef.value.scrollTop;
    }
  })
}

</script>

<template>
  <div class="page">
    <div ref="pageContentRef" class="page-content" :class="{ 'has-toolbar': hasToolbarContent }">
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