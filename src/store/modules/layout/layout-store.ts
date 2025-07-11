import { defineStore } from 'pinia'
import FixedLayout from '~/layout/FixedLayout.vue'
import GridLayout from '~/layout/GridLayout.vue'

type LayoutType = 'grid' | 'fixed'

const layoutCompoentMap = {
  grid: GridLayout,
  fixed: FixedLayout,
}

export const useLayoutStore = defineStore('layout', () => {
  const isPageMaximized = ref(false)
  const isAsideCollapsed = ref(false)
  const layoutType = ref<LayoutType>('fixed')

  const layoutComponent = computed(() => layoutCompoentMap[layoutType.value])

  const toggleAsideCollapsed = () => {
    isAsideCollapsed.value = !isAsideCollapsed.value
  }

  const togglePageMaximized = () => {
    isPageMaximized.value = !isPageMaximized.value
  }

  return {
    layoutType,
    layoutComponent,
    isPageMaximized: readonly(isPageMaximized),
    isAsideCollapsed: readonly(isAsideCollapsed),
    togglePageMaximized,
    toggleAsideCollapsed,
  }
})
