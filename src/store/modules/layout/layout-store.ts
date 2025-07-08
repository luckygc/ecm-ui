import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

type LayoutType = 'grid' | 'fixed'

export const useLayoutStore = defineStore('layout', () => {
  const isPageMaximized = ref(false)
  const isSideBarCollapsed = ref(false)
  const layoutType = ref<LayoutType>('grid')

  const togglePageMaximized = () => {
    isPageMaximized.value = !isPageMaximized.value
  }

  return {
    isPageMaximized: readonly(isPageMaximized),
    isSideBarCollapsed,
    layoutType,
    togglePageMaximized,
  }
})
