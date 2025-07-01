import {defineStore} from "pinia";
import type {LoginForm, UserInfo} from "@/api/auth/types.ts";
import {authApi} from "@/api/auth/auth-api.ts";
import {getConfig} from "@/utils/config-utils.ts";
import {useSessionStorage, useStorage} from "@vueuse/core";
import {useRouter} from "vue-router";
import {getCurrentUserDetail} from "@/api/user/user-api.ts";

export const useAuthStore = defineStore("auth", () => {
    const userInfo = useSessionStorage<UserInfo>(getConfig().userInfoKey, {} as any);

    const _token = useStorage<string>(getConfig().tokenKey, null);
    const _router = useRouter();

    const login = async (loginForm: LoginForm) => {
        const {token} = await authApi.login(loginForm);
        _token.value = token;
        userInfo.value = await getCurrentUserDetail();
        await _router.push('/')
    }

    const logout = async () => {
        await authApi.logout();
        _token.value = null;
        userInfo.value = null;
        await _router.push('/login')
    }

    return {
        userInfo: userInfo,
        login: login,
        logout: logout
    };
});
