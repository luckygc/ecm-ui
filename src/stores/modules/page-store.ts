import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {type RouteLocationNormalizedLoadedGeneric, useRoute} from "vue-router";
import type {Page} from "@/types/store/route-store-types.ts";
import router from "@/router";
import {computeComponentName} from "@/utils/component-utils.ts";

const needKeepAlive = (page: Page | RouteLocationNormalizedLoadedGeneric): boolean => {
    return page.meta?.keepAlive === true;
}

const createPage = (
    route: RouteLocationNormalizedLoadedGeneric
): Page => {
    return {
        fullPath: route.fullPath,
        path: route.path,
        name: route.name,
        meta: {...route.meta},
    };
}

export const usePageStore = defineStore("page", () => {
    // 页面映射,key为路由的fullPath
    let _lastPage: Page | undefined;
    const pages = ref<Page[]>([]);

    const currentRoute = useRoute();

    // 每个组件的refreshKey,用于刷新组件
    const _refreshKeyMap = ref<Map<string, string>>(new Map());

    const keepAliveInclude = computed(() => pages.value.filter(needKeepAlive).map(computeComponentName));

    const getPage = (fullPath: string): Page | undefined => {
        return pages.value.find(page => page.fullPath === fullPath);
    }

    const afterRouteChange = (to: RouteLocationNormalizedLoadedGeneric, from: RouteLocationNormalizedLoadedGeneric) => {
        if (to.meta?.hidden) {
            return;
        }

        if (!from.meta?.hidden) {
            _lastPage = getPage(from.fullPath);
        }

        let page = getPage(to.fullPath);
        // 检查页面是否已存在
        if (page) {
            return;
        } else {
            page = createPage(to)
        }

        pages.value.push(page);
    }

    // 关闭指定路由页面,不指定就关闭当前页面
    const closePage = async (routeFullPath?: string): Promise<void> => {
        if (routeFullPath === undefined) {
            if (!currentRoute.fullPath) {
                return;
            }

            routeFullPath = currentRoute.fullPath;
        }

        const page = getPage(routeFullPath);
        if (!page) {
            return;
        }

        pages.value = pages.value.filter(page => page.fullPath !== routeFullPath);
        _refreshKeyMap.value.delete(routeFullPath);

        // 如果关闭的不是当前激活的页面,不需要跳转
        if (currentRoute.fullPath !== routeFullPath) {
            return;
        }

        // 如果没有其他页面,跳转到根路径
        if (pages.value.length === 0) {
            // 如果没有任何页面，跳转到根路径
            await router.push('/');
        }

        let targetPage: Page;
        if (_lastPage && getPage(_lastPage.fullPath)) {
            targetPage = _lastPage;
        } else {
            targetPage = pages.value[pages.value.length - 1];
        }

        await router.push(targetPage);
    }

    const computeComponentKey = (routeFullPath: string): string => {
        const key = _refreshKeyMap.value.get(routeFullPath) || "_";
        return `${routeFullPath}${key}`;
    }

    // 刷新当前页面
    const refreshPage = () => {
        if (!currentRoute?.fullPath) {
            return;
        }

        _refreshKeyMap.value.set(currentRoute.fullPath, `_${Date.now()}`);
    }

    // 关闭其他页面
    const closeOtherPage = async () => {
        if (pages.value.length <= 1) {
            return;
        }

        if (!currentRoute?.fullPath) {
            return;
        }

        const pagesToClose = pages.value.filter(page => page.fullPath !== currentRoute.fullPath);
        pages.value = [getPage(currentRoute.fullPath)!];

        for (const page of pagesToClose) {
            _refreshKeyMap.value.delete(computeComponentKey(page.fullPath));
        }
    }

    // 关闭所有页面（优化：批量操作减少响应式更新）
    async function closeAllPage() {
        pages.value = [];
        _refreshKeyMap.value.clear();

        // 导航到首页
        await router.push("/");
    }

    return {
        pages,
        keepAliveInclude,
        _refreshKeyMap, // 暴露用于调试查看

        afterRouteChange,
        computeComponentKey,

        closePage,
        refreshPage,
        closeOtherPage,
        closeAllPage,
    };
});
