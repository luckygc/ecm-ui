import {defineStore} from "pinia";
import {ref} from "vue";
import type {UserInfo} from "@/api/auth/types.ts";
import {useStorage} from "@vueuse/core";
import {getConfig} from "@/utils/config-utils.ts";
import {getCurrentUser} from "@/api/user/user-api.ts";
import {authApi} from "@/api/auth/auth-api.ts";

export const useAuthStore = defineStore("auth", () => {
    const userInfo = ref<UserInfo | null>(null);

    const token = useStorage(getConfig().tokenName, null);

    // 已认证
    if (token.value) {
        getCurrentUser().then(u => userInfo.value = u);
    }

    const logout = async () => {
        await authApi.logout()
        window.location.href = '/#/'
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
