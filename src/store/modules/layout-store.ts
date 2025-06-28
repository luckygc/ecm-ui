import { defineStore } from "pinia";
import { readonly, ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const isPageMaximized = ref(false);

  const togglePageMaximized = () => {
    isPageMaximized.value = !isPageMaximized.value;
  };

  return {
    isPageMaximized: readonly(isPageMaximized),
    togglePageMaximized,
  };
});
