import {defineStore} from "pinia";
import type {LoginForm, UserInfo} from "@/api/auth/types.ts";
import {authApi} from "@/api/auth/auth-api.ts";
import {getConfig} from "@/utils/config-utils.ts";
import {useSessionStorage, useStorage} from "@vueuse/core";
import {useRouter} from "vue-router";
import {getCurrentUserDetail} from "@/api/user/user-api.ts";

export const useAuthStore = defineStore("auth", () => {
    const userInfo = useSessionStorage<UserInfo>(getConfig().storageUserInfoKey, {} as any);

    const _token = useStorage<string>(getConfig().storageTokenKey, null);
    const _router = useRouter();

    const refreshUserInfo = async () => {
        userInfo.value = await getCurrentUserDetail();
    }

    const login = async (loginForm: LoginForm) => {
        const {token} = await authApi.login(loginForm);
        _token.value = token;
        await refreshUserInfo();
        await _router.push('/')
    }

    const logout = async () => {
        await authApi.logout();
        _token.value = null;
        userInfo.value = null;
        await _router.push('/login')
    }

    refreshUserInfo();

    return {
        userInfo: userInfo,
        login: login,
        logout: logout
    };
});
