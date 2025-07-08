<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'
import '@cap.js/widget/cap.min.js'

interface Props {
  capApiEndpoint: string
}

const props = defineProps<Props>()
const modelValue = defineModel<string>()

const capEl = useTemplateRef<HTMLElement>('capRef')

const handleCapSolve: EventListenerOrEventListenerObject = async (e: Event) => {
  modelValue.value = (e as CustomEvent).detail.token
}

onMounted(async () => {
  await nextTick()
  capEl.value?.addEventListener('solve', handleCapSolve)
})

const reset = () => {
  (capEl.value as any)?.reset()
  modelValue.value = ''
}

onUnmounted(() => {
  capEl.value?.removeEventListener('solve', handleCapSolve)
})

defineExpose({
  reset,
})
</script>

<template>
  <cap-widget
    ref="capRef" :data-cap-api-endpoint="props.capApiEndpoint" data-cap-i18n-verifying-label="验证中..."
    data-cap-i18n-initial-state="人机验证" data-cap-i18n-solved-label="验证通过！"
    data-cap-i18n-error-label="验证错误！"
  />
</template>

<style scoped>
cap-widget {
  width: 100%;
  --cap-widget-height: 40px;
  --cap-widget-width: 100%;
  --cap-widget-padding: 1px 15px;
  --cap-border-radius: var(--el-border-radius-base);
  --cap-checkbox-size: 18px;
  --cap-checkbox-border-radius: var(--el-border-radius-base);
}

cap-widget::part(label) {
  flex: 1;
}

cap-widget::part(attribution) {
  position: initial;
  align-self: baseline;
}
</style>
