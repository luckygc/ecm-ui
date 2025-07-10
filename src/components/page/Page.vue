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
</style>
