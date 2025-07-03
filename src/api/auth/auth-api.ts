import { axiosInstance } from "@/utils/request/request.ts";
import type { LoginForm, UserInfo } from "./types.ts";

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns Promise<LoginResponse>
 */
const login = (data: LoginForm): Promise<{ token: string }> => {
  return axiosInstance.postForm("/login", data);
};

/**
 * 用户登出
 * @returns Promise<void>
 */
const logout = (): Promise<void> => {
  return axiosInstance.post("/logout");
};

/**
 * 获取当前用户信息
 * @returns Promise<UserInfo>
 */
function getCurrentUser(): Promise<UserInfo> {
  return axiosInstance.get("/current-user");
}

export const authApi = {
  login,
  logout,
  getCurrentUser,
};
