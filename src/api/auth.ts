import { post } from "@/utils/request";
import type { LoginForm, LoginResponse } from "@/types/utils/requests-type";

/**
 * 用户登录
 * @param data 登录表单数据
 * @param skipErrorHandler 是否跳过错误处理
 * @returns Promise<LoginResponse>
 */
export function login(
  data: LoginForm,
  skipErrorHandler = false
): Promise<LoginResponse> {
  // 创建URL编码的表单数据
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);
  if (data.rememberMe !== undefined) {
    params.append("remember-me", data.rememberMe.toString());
  }

  return post<LoginResponse>("/login", params, {
    skipErrorHandler,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

/**
 * 用户登出
 * @returns Promise<void>
 */
export function logout(): Promise<void> {
  return post<void>("/logout");
}

/**
 * 获取当前用户信息
 * @returns Promise<UserInfo>
 */
export function getCurrentUser(): Promise<any> {
  return post<any>("/auth/me");
}
