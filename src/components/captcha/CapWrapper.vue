<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import type { Props } from "./types.ts";
import '@cap.js/widget/cap.min.js'

const props = defineProps<Props>();
const modelValue = defineModel<string>();

const capRef = ref<HTMLElement>();

const handleCapSolve: EventListenerOrEventListenerObject = async (e: Event) => {
  modelValue.value = (e as CustomEvent).detail.token;
}

onMounted(async () => {
  await nextTick();
  capRef.value?.addEventListener("solve", handleCapSolve);
})

const reset = () => {
  (capRef.value as any)?.reset();
  modelValue.value = '';
}

onUnmounted(() => {
  capRef.value?.removeEventListener("solve", handleCapSolve);
})

defineExpose({
  reset
})

</script>

<template>
  <cap-widget ref="capRef" :data-cap-api-endpoint="props.capApiEndpoint" data-cap-i18n-verifying-label="验证中..."
    data-cap-i18n-initial-state="人机验证" data-cap-i18n-solved-label="验证通过！"
    data-cap-i18n-error-label="验证错误！"></cap-widget>
</template>

<style scoped>
cap-widget {
  width: 100%;
  --cap-widget-height: 40px;
  --cap-widget-width: 100%;
  --cap-widget-padding: 5px 20px;
  --cap-border-radius: var(--el-border-radius-base);
  --cap-checkbox-size: 20px;
  --cap-checkbox-border-radius: var(--el-border-radius-base);
}
</style>