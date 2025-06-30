import {get} from "@/utils/request/request.ts";
import type {UserInfo} from "@/api/auth/types.ts";

export const getCurrentUser = (): Promise<UserInfo> => {
    return get<UserInfo>('/current-user');
}

