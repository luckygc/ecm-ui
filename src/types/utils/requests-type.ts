export type SuccessApiResult<T> = {
  success: true;
  data: T;
  error: null;
};

export type ErrorApiResult = {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    detail: any;
  };
};

export type ApiResult<T> = SuccessApiResult<T> | ErrorApiResult;

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
