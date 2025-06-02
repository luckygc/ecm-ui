import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAppStore = defineStore("app", () => {
  // 侧边栏是否打开
  const isSidebarOpened = ref(true);
  const sidebarWidth = computed(() =>
    isSidebarOpened.value ? "200px" : "64px"
  );

  // 切换侧边栏开关状态
  const toggleSidebar = () => {
    isSidebarOpened.value = !isSidebarOpened.value;
  };

  return {
    isSidebarOpened,
    sidebarWidth,
    toggleSidebar,
  };
});
