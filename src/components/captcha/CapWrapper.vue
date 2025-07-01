<script setup lang="ts">

import {nextTick, onMounted, onUnmounted, ref} from "vue";
import type {Props} from "./types.ts";

const props = defineProps<Props>();

const modelValue = defineModel<string>();

const capRef = ref<HTMLElement>();
const capShadowRootRef = ref<ShadowRoot | null>()

const handleCapSolve: EventListenerOrEventListenerObject = async (e: Event) => {
  modelValue.value = (e as CustomEvent).detail.token;
}

onMounted(async () => {
  await nextTick();
  capRef.value?.addEventListener("solve", handleCapSolve);
  capShadowRootRef.value = capRef.value?.shadowRoot

  const captchaEl = capShadowRootRef.value?.querySelector('.captcha');
  if (captchaEl instanceof HTMLElement) {
    captchaEl.style.boxSizing = 'border-box';
    captchaEl.querySelector('.credits')?.setAttribute('hidden', 'true')
  }
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
  <cap-widget ref="capRef"
              :data-cap-api-endpoint="props.capApiEndpoint"
              data-cap-i18n-verifying-label="验证中..."
              data-cap-i18n-initial-state="人机验证"
              data-cap-i18n-solved-label="验证通过！"
              data-cap-i18n-error-label="验证错误！"></cap-widget>
</template>

<style scoped>
cap-widget {
  --cap-widget-height: 40px;
  --cap-widget-width: 180px;
  --cap-checkbox-size: 20px;
  --cap-border-radius: var(--el-border-radius-base);
}
</style>