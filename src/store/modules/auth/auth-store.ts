import {defineStore} from "pinia";
import {ref} from "vue";
import type {LoginForm, UserInfo} from "@/api/auth/types.ts";
import {useStorage} from "@vueuse/core";
import {getConfig} from "@/utils/config-utils.ts";
import {getCurrentUser} from "@/api/user/user-api.ts";
import {authApi} from "@/api/auth/auth-api.ts";

export const useAuthStore = defineStore("auth", () => {
    const userInfo = ref<UserInfo | null>(null);

    const token = useStorage(getConfig().tokenName, null);

    if (token.value) {
        getCurrentUser().then(u => userInfo.value = u);
    }

    const login = async (loginForm: LoginForm) => {
        userInfo.value = await authApi.login(loginForm);
    }

    const logout = async () => {
        await authApi.logout()
        reset();
        token.value = null;
        window.location.href='/#/'
    }

    const reset = () => {
        userInfo.value = null;
    }

    return {
        userInfo: userInfo,

        login: login,
        logout: logout,
        reset: reset
    };
});
