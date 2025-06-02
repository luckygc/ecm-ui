type CodeLabel = {
    code: string;
    label: string;
}

// 登录相关类型定义
export interface LoginForm {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface UserInfo {
    id: number;
    username: string;
    fullName: string;
    email: string;
    mobile: string;
    status: CodeLabel;
    lastLoginTime: string;
    lastLoginIp: string;
    createTime: string;
}
