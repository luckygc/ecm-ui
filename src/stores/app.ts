import { defineStore } from "pinia";

interface AppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  device: "desktop" | "mobile";
  theme: "light" | "dark";
  refreshKey: string;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    sidebar: {
      opened: true,
      withoutAnimation: false,
    },
    device: "desktop",
    theme: "light",
    refreshKey: "main",
  }),
  getters: {
    getSidebarStatus: (state) => state.sidebar.opened,
    getDevice: (state) => state.device,
    getTheme: (state) => state.theme,
    getRefreshKey: (state) => state.refreshKey,
  },
  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
    },
    closeSidebar(withoutAnimation: boolean) {
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    toggleDevice(device: "desktop" | "mobile") {
      this.device = device;
    },
    setTheme(theme: "light" | "dark") {
      this.theme = theme;
    },
    refreshMainContent() {
      const currentKey = this.refreshKey;
      if (currentKey.includes("_")) {
        this.refreshKey = currentKey.replace(/_/g, "");
      } else {
        this.refreshKey = currentKey + "_";
      }
    },
  },
});
