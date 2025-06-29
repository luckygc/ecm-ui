import {defineStore} from "pinia";
import {ref} from "vue";
import type {UserInfo} from "@/types/api/modules/auth-api-types.ts";
import {authApi} from "@/api/auth/auth-api.ts";
import {useStorage} from "@vueuse/core";
import {getConfig} from "@/utils/config-utils.ts";
import {usePageStore} from "@/store/modules/page/page-store.ts";

export const useAuthStore = defineStore("auth", () => {
    const userInfo = ref<UserInfo | null>(null);

    // 设置用户信息
    const setUserInfo = (user: UserInfo) => {
        userInfo.value = user;
    }

    const pageStore = usePageStore();

    const logout = async () => {
        await authApi.logout()
        userInfo.value = null;
        let token = useStorage(getConfig().tokenName, null);
        token.value = null;
        await pageStore.closeAllPage();
    }

    return {
        userInfo,
        setUserInfo,
        logout
    };
});
