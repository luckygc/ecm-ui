<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'

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
  <div class="page">
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

.page-content {
  overflow: auto;
  padding: var(--page-padding);
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
</style>
