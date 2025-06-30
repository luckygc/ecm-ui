import {get, post} from "@/utils/request/request.ts";
import type {LoginForm, UserInfo,} from "./types.ts";

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns Promise<LoginResponse>
 */
const login = (data: LoginForm): Promise<UserInfo> => {
    // 创建URL编码的表单数据
    const params = new URLSearchParams();
    params.append("username", data.username);
    params.append("password", data.password);
    params.append("capToken", data.capToken);
    return post<UserInfo>("/login", params);
}

/**
 * 用户登出
 * @returns Promise<void>
 */
const logout = (): Promise<void> => {
    return post<void>("/logout");
}

/**
 * 获取当前用户信息
 * @returns Promise<UserInfo>
 */
function getCurrentUser(): Promise<any> {
    return get<any>("/current-user");
}

export const authApi = {
    login,
    logout,
    getCurrentUser,
};
