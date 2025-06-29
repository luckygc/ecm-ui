import {defineStore} from "pinia";
import {ref} from "vue";
import type {UserInfo} from "@/types/api/modules/auth-api-types.ts";
import {authApi} from "@/api/auth-api.ts";
import {useStorage} from "@vueuse/core";
import {getConfig} from "@/utils/config-utils.ts";

export const useUserStore = defineStore("user", () => {
    const userInfo = ref<UserInfo | null>(null);

    // 设置用户信息
    const setUserInfo = (user: UserInfo) => {
        userInfo.value = user;
    }

    const logout = async () => {
        await authApi.logout()
        userInfo.value = null;
        let token = useStorage(getConfig().tokenName, null);
        token.value = null;
    }

    return {
        userInfo,
        setUserInfo,
        logout
    };
});
