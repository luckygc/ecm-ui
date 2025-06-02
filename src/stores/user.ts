import { defineStore } from "pinia";
import { ref } from "vue";
import type {UserInfo} from "@/types/api/modules/auth-api-types.ts";

export const useUserStore = defineStore("user", () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null);
  const isLoggedIn = ref(false);
  const token = ref<string>("");

  // 设置用户信息
  function setUserInfo(user: UserInfo) {
    userInfo.value = user;
    isLoggedIn.value = true;
  }

  // 设置token
  function setToken(newToken: string) {
    token.value = newToken;
  }

  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = null;
    isLoggedIn.value = false;
    token.value = "";
  }

  // 登出
  function logout() {
    clearUserInfo();
    // 清除可能的本地存储
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  }

  // 从本地存储恢复登录状态
  function restoreLoginState() {
    const savedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (savedToken) {
      token.value = savedToken;
      isLoggedIn.value = true;
      // 这里可以调用API验证token有效性并获取用户信息
      // 暂时只设置token和登录状态，实际项目中应该验证token并获取用户信息
    }
  }

  return {
    // 状态
    userInfo,
    isLoggedIn,
    token,
    // 方法
    setUserInfo,
    setToken,
    clearUserInfo,
    logout,
    restoreLoginState,
  };
});
