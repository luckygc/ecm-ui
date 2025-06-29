import {defineStore} from "pinia";
import {computed, readonly, ref} from "vue";
import {usePageStore} from "@/store";

export const useLayoutStore = defineStore("layout", () => {
    const isPageMaximized = ref(false);
    const pageStore = usePageStore();

    const pageTransitionDuration = computed(() => {
        return {
            enter: 100,
            leave: pageStore.pages.length == 0 ? 0 : 100
        }
    })

    const togglePageMaximized = () => {
        isPageMaximized.value = !isPageMaximized.value;
    };

    return {
        isPageMaximized: readonly(isPageMaximized),
        pageTransitionDuration,
        togglePageMaximized,
    };
});
