import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface SidebarState {
  opened: boolean;
  withoutAnimation: boolean;
}

export const useAppStore = defineStore("app", () => {
  // 状态定义 (相当于原来的 state)
  const sidebar = ref<SidebarState>({
    opened: true,
    withoutAnimation: false,
  });

  const device = ref<"desktop" | "mobile">("desktop");
  const theme = ref<"light" | "dark">("light");
  const refreshKey = ref<string>("main");

  // 计算属性 (相当于原来的 getters)
  const getSidebarStatus = computed(() => sidebar.value.opened);
  const getDevice = computed(() => device.value);
  const getTheme = computed(() => theme.value);
  const getRefreshKey = computed(() => refreshKey.value);

  // 方法 (相当于原来的 actions)
  const toggleSidebar = () => {
    sidebar.value.opened = !sidebar.value.opened;
    sidebar.value.withoutAnimation = false;
  };

  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.value.opened = false;
    sidebar.value.withoutAnimation = withoutAnimation;
  };

  const toggleDevice = (newDevice: "desktop" | "mobile") => {
    device.value = newDevice;
  };

  const setTheme = (newTheme: "light" | "dark") => {
    theme.value = newTheme;
  };

  const refreshMainContent = () => {
    const currentKey = refreshKey.value;
    if (currentKey.includes("_")) {
      refreshKey.value = currentKey.replace(/_/g, "");
    } else {
      refreshKey.value = currentKey + "_";
    }
  };

  // 返回所有需要暴露的状态、计算属性和方法
  return {
    // 状态
    sidebar,
    device,
    theme,
    refreshKey,

    // 计算属性
    getSidebarStatus,
    getDevice,
    getTheme,
    getRefreshKey,

    // 方法
    toggleSidebar,
    closeSidebar,
    toggleDevice,
    setTheme,
    refreshMainContent,
  };
});
