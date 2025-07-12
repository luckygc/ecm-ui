import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const isPageMaximized = ref(false)
  const isAsideCollapsed = ref(false)

  const toggleAsideCollapsed = () => {
    isAsideCollapsed.value = !isAsideCollapsed.value
  }

  const togglePageMaximized = () => {
    isPageMaximized.value = !isPageMaximized.value
  }

  return {
    isPageMaximized: readonly(isPageMaximized),
    isAsideCollapsed: readonly(isAsideCollapsed),
    togglePageMaximized,
    toggleAsideCollapsed,
  }
})
