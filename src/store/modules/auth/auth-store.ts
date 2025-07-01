import {defineStore} from "pinia";
import {ref} from "vue";
import type {UserInfo} from "@/api/auth/types.ts";
import {authApi} from "@/api/auth/auth-api.ts";
import {getConfig} from "@/utils/config-utils.ts";
import {useStorage} from "@vueuse/core";
import {getCurrentUserDetail} from "@/api/user/user-api.ts";

export const useAuthStore = defineStore("auth", () => {
    const userInfo = ref<UserInfo | null>(null);
    const _token = useStorage(getConfig().tokenName, null);

    if (!userInfo.value) {
        getCurrentUserDetail().then(u => userInfo.value = u)
    }

    const logout = async () => {
        await authApi.logout();
        _token.value = null;
        window.location.href = '/#/login'
    }

    const reset = () => {
        userInfo.value = null;
    }

    return {
        userInfo: userInfo,
        logout: logout,
        reset: reset
    };
});
