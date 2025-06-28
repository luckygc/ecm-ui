<script setup lang="ts">
import {ref, reactive, watch, onMounted, nextTick, computed, onBeforeUnmount} from 'vue'

defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const containerRef = ref<HTMLElement>()
const tabbarRef = ref(null)

const scrollState = reactive({
  scrollLeft: 0,
  scrollWidth: 0,
  clientWidth: 0,
})

const showScroll = computed(() => {
  return scrollState.scrollWidth > scrollState.clientWidth
})

const scrollLeftDisabled = computed(() => scrollState.scrollLeft <= 0)
const scrollRightDisabled = computed(() => {
  return (
      scrollState.scrollLeft + scrollState.clientWidth >=
      scrollState.scrollWidth - 1
  )
})

const activeBgStyle = ref({
  width: '0px',
  left: '0px',
  transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)',
  position: 'absolute',
  top: '6px',
  bottom: '6px',
  borderRadius: '8px',
  background: 'white',
  boxShadow: '0 2px 8px rgb(0 0 0 / 0.15)',
  zIndex: 0,
  pointerEvents: 'none',
})
const activeBgVisible = ref(false)

function updateActiveBg() {
  nextTick(() => {
    if (!tabbarRef.value) return
    const activeTabEl = tabbarRef.value.querySelector('.tab.active')
    if (!activeTabEl) {
      activeBgVisible.value = false
      return
    }
    activeBgVisible.value = true
    const containerRect = tabbarRef.value.getBoundingClientRect()
    const activeRect = activeTabEl.getBoundingClientRect()

    activeBgStyle.value = {
      ...activeBgStyle.value,
      left: activeRect.left - containerRect.left + 'px',
      width: activeRect.width + 'px',
    }
  })
}

watch(() => modelValue, () => {
  updateActiveBg()
})

watch(
    () => tabs,
    () => {
      nextTick(() => {
        updateActiveBg()
        updateScrollState()
      })
    },
    {deep: true}
)

function activateTab(key) {
  if (key !== modelValue) {
    emit('update:modelValue', key)
  }
}

function closeTab(key) {
  emit('close', key)
}

function updateScrollState() {
  if (!containerRef.value) return
  scrollState.scrollLeft = containerRef.value.scrollLeft
  scrollState.scrollWidth = containerRef.value.scrollWidth
  scrollState.clientWidth = containerRef.value.clientWidth
}

function scrollLeft() {
  if (!containerRef.value) {
    return;
  }
  containerRef.value.scrollBy({
    left: -150,
    behavior: 'smooth',
  })
}

function scrollRight() {
  if (!containerRef.value) return
  containerRef.value.scrollBy({
    left: 150,
    behavior: 'smooth',
  })
}

function onScroll() {
  updateScrollState()
}

onMounted(() => {
  updateScrollState()
  updateActiveBg()
  window.addEventListener('resize', () => {
    updateActiveBg()
    updateScrollState()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    updateActiveBg()
    updateScrollState()
  })
})
</script>

<template>
  <div class="tabbar-wrapper">
    <button
        v-if="showScroll"
        class="scroll-btn left"
        @click="scrollLeft"
        :disabled="scrollLeftDisabled"
        aria-label="向左滚动"
    >‹
    </button>

    <div
        class="tabbar-container"
        ref="containerRef"
        @scroll="onScroll"
        tabindex="0"
    >
      <div class="tabbar" ref="tabbarRef">
        <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab', { active: tab.key === modelValue }]"
            @click="activateTab(tab.key)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span class="close-btn" @click.stop="closeTab(tab.key)">×</span>
        </div>
        <div
            class="active-bg"
            :style="activeBgStyle"
            v-show="activeBgVisible"
        ></div>
      </div>
    </div>

    <button
        v-if="showScroll"
        class="scroll-btn right"
        @click="scrollRight"
        :disabled="scrollRightDisabled"
        aria-label="向右滚动"
    >›
    </button>
  </div>
</template>

<style scoped>
.tabbar-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background: #e0e0e0;
  border-radius: 12px;
  padding: 6px;
  user-select: none;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
}

.tabbar-container {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  position: relative;
}

.tabbar-container::-webkit-scrollbar {
  display: none;
}

.tabbar {
  display: flex;
  gap: 16px;
  position: relative;
  min-width: max-content;
}

.tab {
  position: relative;
  padding: 10px 28px 10px 24px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-radius: 8px;
  user-select: none;
  display: flex;
  align-items: center;
  z-index: 1;
  transition: color 0.3s;
  white-space: nowrap;
}

.tab.active {
  color: #333;
}

.close-btn {
  margin-left: 8px;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  user-select: none;
  line-height: 1;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #666;
}

.active-bg {
  position: absolute;
  top: 6px;
  bottom: 6px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  pointer-events: none;
}

.scroll-btn {
  background: #c1c1c1;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  color: white;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  margin: 0 6px;
}

.scroll-btn:disabled {
  cursor: not-allowed;
  background: #eee;
  color: #999;
}

.scroll-btn:hover:not(:disabled) {
  background: #999;
}

.scroll-btn.left {
  order: 0;
}

.scroll-btn.right {
  order: 2;
}
</style>
