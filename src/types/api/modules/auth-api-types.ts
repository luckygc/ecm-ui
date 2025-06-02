// 登录相关类型定义
export interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

export interface LoginResponse {
  user: UserInfo;
}
