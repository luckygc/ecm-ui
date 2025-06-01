import { defineStore } from "pinia";
import { ref, computed } from "vue";

// 类型定义
interface SidebarConfig {
  isOpened: boolean;
  withoutAnimation: boolean;
}

// 组件刷新键映射
interface ComponentKeys {
  [componentName: string]: string;
}

export const useAppStore = defineStore("app", () => {
  // ==================== 状态定义 ====================

  // 侧边栏配置
  const sidebarConfig = ref<SidebarConfig>({
    isOpened: true,
    withoutAnimation: false,
  });

  // 设备类型
  const deviceType = ref<DeviceType>("desktop");

  // 主题类型
  const themeType = ref<ThemeType>("light");

  // 主内容区域刷新键
  const mainContentKey = ref<string>("main-content");

  // 组件刷新键映射表 - 用于管理所有需要刷新的组件
  const componentKeys = ref<ComponentKeys>({
    "main-content": "main-content",
    dashboard: "dashboard",
    "user-management": "user-management",
    "system-settings": "system-settings",
  });

  // ==================== 计算属性 ====================

  // 侧边栏是否打开
  const isSidebarOpened = computed(() => sidebarConfig.value.isOpened);

  // 当前设备类型
  const currentDevice = computed(() => deviceType.value);

  // 当前主题
  const currentTheme = computed(() => themeType.value);

  // 主内容区域当前刷新键
  const currentMainContentKey = computed(() => mainContentKey.value);

  // 获取所有组件键
  const allComponentKeys = computed(() => componentKeys.value);

  // 是否为移动设备
  const isMobileDevice = computed(() => deviceType.value === "mobile");

  // 是否为暗色主题
  const isDarkTheme = computed(() => themeType.value === "dark");

  // ==================== 侧边栏相关方法 ====================

  // 切换侧边栏开关状态
  const toggleSidebar = () => {
    sidebarConfig.value.isOpened = !sidebarConfig.value.isOpened;
    sidebarConfig.value.withoutAnimation = false;
  };

  // 关闭侧边栏
  const closeSidebar = (withoutAnimation = false) => {
    sidebarConfig.value.isOpened = false;
    sidebarConfig.value.withoutAnimation = withoutAnimation;
  };

  // 打开侧边栏
  const openSidebar = (withoutAnimation = false) => {
    sidebarConfig.value.isOpened = true;
    sidebarConfig.value.withoutAnimation = withoutAnimation;
  };

  // ==================== 设备和主题相关方法 ====================

  // 设置设备类型
  const setDeviceType = (device: DeviceType) => {
    deviceType.value = device;

    // 移动设备自动关闭侧边栏
    if (device === "mobile") {
      closeSidebar(true);
    }
  };

  // 设置主题
  const setTheme = (theme: ThemeType) => {
    themeType.value = theme;
  };

  // 切换主题
  const toggleTheme = () => {
    themeType.value = themeType.value === "light" ? "dark" : "light";
  };

  // ==================== 组件刷新相关方法 ====================

  // 生成新的刷新键
  const generateRefreshKey = (baseKey: string): string => {
    const timestamp = Date.now();
    return baseKey.includes("_")
      ? baseKey.replace(/_\d+$/, `_${timestamp}`)
      : `${baseKey}_${timestamp}`;
  };

  // 刷新主内容区域
  const refreshMainContent = () => {
    const newKey = generateRefreshKey(mainContentKey.value);
    mainContentKey.value = newKey;
    componentKeys.value["main-content"] = newKey;
  };

  // 刷新指定组件
  const refreshComponent = (componentName: string) => {
    const currentKey = componentKeys.value[componentName] || componentName;
    const newKey = generateRefreshKey(currentKey);
    componentKeys.value[componentName] = newKey;

    // 如果是主内容区域，同步更新主内容键
    if (componentName === "main-content") {
      mainContentKey.value = newKey;
    }
  };

  // 获取指定组件的刷新键
  const getComponentKey = (componentName: string): string => {
    return componentKeys.value[componentName] || componentName;
  };

  // 批量刷新多个组件
  const refreshMultipleComponents = (componentNames: string[]) => {
    componentNames.forEach((name) => {
      refreshComponent(name);
    });
  };

  // 刷新所有组件（除了侧边栏、标签栏、头部）
  const refreshAllComponents = () => {
    const excludeComponents = ["sidebar", "header", "tabs"];
    Object.keys(componentKeys.value).forEach((componentName) => {
      if (!excludeComponents.includes(componentName)) {
        refreshComponent(componentName);
      }
    });
  };

  // 添加新的组件键
  const addComponentKey = (componentName: string, initialKey?: string) => {
    if (!componentKeys.value[componentName]) {
      componentKeys.value[componentName] = initialKey || componentName;
    }
  };

  // 移除组件键
  const removeComponentKey = (componentName: string) => {
    delete componentKeys.value[componentName];
  };

  // ==================== 返回接口 ====================
  return {
    // 状态
    sidebarConfig,
    deviceType,
    themeType,
    mainContentKey,
    componentKeys,

    // 计算属性
    isSidebarOpened,
    currentDevice,
    currentTheme,
    currentMainContentKey,
    allComponentKeys,
    isMobileDevice,
    isDarkTheme,

    // 侧边栏方法
    toggleSidebar,
    closeSidebar,
    openSidebar,

    // 设备和主题方法
    setDeviceType,
    setTheme,
    toggleTheme,

    // 组件刷新方法
    refreshMainContent,
    refreshComponent,
    getComponentKey,
    refreshMultipleComponents,
    refreshAllComponents,
    addComponentKey,
    removeComponentKey,

    // 兼容性方法（保持向后兼容）
    getSidebarStatus: isSidebarOpened,
    getDevice: currentDevice,
    getTheme: currentTheme,
    getRefreshKey: currentMainContentKey,
    toggleDevice: setDeviceType,
  };
});
