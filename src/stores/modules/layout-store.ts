import {defineStore} from "pinia";
import {computed, ref} from "vue";

const storeSetup = () => {
    // 侧边栏是否打开
    const isSidebarOpened = ref(true);
    const sidebarWidth = computed(() =>
        isSidebarOpened.value ? "200px" : "200px"
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
}

export const useLayoutStore = defineStore("layout", storeSetup);
