<script setup lang="ts">
import {useSlots, computed} from 'vue'

const slots = useSlots()

// 检测 toolbar 插槽是否有内容
const hasToolbarContent = computed(() => {
  return slots?.['toolbar']
})
</script>

<template>
  <div class="page-container">
    <el-scrollbar>

      <div class="outer-container" :class="{ 'has-toolbar': hasToolbarContent }">
        <div class="inner-container">
          <slot></slot>
        </div>
      </div>
      <div class="toolbar" v-if="hasToolbarContent">
        <slot name="toolbar"></slot>
      </div>
    </el-scrollbar>
  </div>

</template>

<style scoped>
.outer-container {
  height: auto;
  width: 100%;
  padding: var(--page-padding);
}

.outer-container.has-toolbar {
  margin-bottom: var(--page-toolbar-height);
}

.toolbar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: var(--page-toolbar-height);
  background-color: #fff;
  box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.1);
  padding: var(--page-toolbar-padding);
  z-index: 10;
}
</style>