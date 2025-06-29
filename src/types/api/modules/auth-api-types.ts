type CodeLabel = {
    code: string;
    label: string;
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
