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
  const isASideCollapsed = ref(false)
  const layoutType = ref<LayoutType>('fixed')

  const layoutComponent = computed(() => layoutCompoentMap[layoutType.value])

  const toggleASideCollapsed = () => {
    isASideCollapsed.value = !isASideCollapsed.value
  }

  const togglePageMaximized = () => {
    isPageMaximized.value = !isPageMaximized.value
  }

  return {
    layoutType,
    layoutComponent,
    isPageMaximized: readonly(isPageMaximized),
    isASideCollapsed: readonly(isASideCollapsed),
    togglePageMaximized,
    toggleASideCollapsed,
  }
})
