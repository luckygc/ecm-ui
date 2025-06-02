import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore("token", () => {
  // 状态
  const token = ref<string>("");

  useStorage("repodar-token", "");

  // 设置token
  function setToken(newToken: string) {
    token.value = newToken;
  }

  // 清除token
  function clearToken() {
    token.value = "";
  }

  return {
    // 状态
    token,
    // 方法
    setToken,
    clearToken,
  };
});
