import { axiosInstance } from '~/utils/request/request'

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns Promise<LoginResponse>
 */
export function login(data: LoginForm): Promise<{ token: string }> {
  return axiosInstance.postForm('/login', data)
}

/**
 * 用户登出
 * @returns Promise<void>
 */
export function logout(): Promise<void> {
  return axiosInstance.post('/logout')
}

export interface LoginForm {
  username: string
  password: string
  capToken: string
}
