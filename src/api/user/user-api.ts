import {axiosInstance} from "@/utils/request/request.ts";
import type {UserInfo} from "@/api/auth/types.ts";

export const getCurrentUserDetail = (): Promise<UserInfo> => {
    return axiosInstance.get('/current-user');
}

