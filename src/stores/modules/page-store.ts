import {defineStore} from "pinia";
import {computed, ref, shallowRef} from "vue";
import {type RouteLocationNormalizedLoadedGeneric, useRoute} from "vue-router";
import type {Page} from "@/types/store/route-store-types.ts";
import router from "@/router";
import {computeComponentName} from "@/utils/component-utils.ts";

const needKeepAlive = (page: Page | RouteLocationNormalizedLoadedGeneric): boolean => {
    return page.meta?.['keepAlive'] === true;
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
    const pages = shallowRef<Page[]>([]);

    const route = useRoute();

    // 每个页面组件的Key的后缀,用于刷新组件
    const _componentKeySuffixMap = ref<Map<string, string>>(new Map());

    // 缓存
    const keepAliveInclude = computed(() => pages.value.filter(needKeepAlive).map(computeComponentName));

    // 非页签页面路由名称
    const specialRouteNames = ['Index', 'Login', 'NotFound'];

    const findPageByRouteFullPath = (fullPath: string): Page | undefined => {
        return pages.value.find(page => page.fullPath === fullPath);
    }

    const afterRouteChange = (to: RouteLocationNormalizedLoadedGeneric) => {
        // 无需管理的页面
        if (specialRouteNames.findIndex(name => to.name === name) > -1) {
            return;
        }

        // 检查页面是否已存在
        if (findPageByRouteFullPath(to.fullPath)) {
            return;
        }

        addPage(createPage(to))
    }

    const addPage = (page: Page) => {
        pages.value = [...pages.value, page];
    }

    const closeCurrentPage = async () => {
        const currentPage = findPageByRouteFullPath(route.fullPath);
        if (!currentPage) {
            return;
        }

        return closePage(currentPage.fullPath);
    }

    // 关闭指定路由页面
    const closePage = async (routeFullPath: string): Promise<void> => {
        const waitClosePage = findPageByRouteFullPath(routeFullPath);
        if (!waitClosePage) {
            throw new Error(`页面{fullPath=${routeFullPath}}不存在`);
        }

        pages.value = pages.value.filter(page => page.fullPath !== routeFullPath);
        _componentKeySuffixMap.value.delete(routeFullPath);

        // 如果关闭的不是当前激活的页面,不需要跳转
        if (routeFullPath !== route.fullPath) {
            return;
        }

        if (pages.value.length === 0) {
            await router.push('/')
        }

        // 跳转到最后一个页面
        await router.push(pages.value[pages.value.length - 1]!.fullPath);
    }

    const computeComponentKey = (routeFullPath: string): string => {
        let keySuffix = _componentKeySuffixMap.value.get(routeFullPath);
        if (!keySuffix) {
            keySuffix = `_${Date.now()}`;
            _componentKeySuffixMap.value.set(routeFullPath, keySuffix);
        }

        return `${routeFullPath}${keySuffix}`;
    }

    // 刷新当前页面
    const refreshPage = async () => {
        const currentPage = findPageByRouteFullPath(route.fullPath);
        if (!currentPage) {
            return;
        }

        _componentKeySuffixMap.value.set(currentPage.fullPath, `_${Date.now()}`);
    }

    // 关闭其他页面
    const closeOtherPage = async () => {
        const currentPage = findPageByRouteFullPath(route.fullPath);
        if (!currentPage || pages.value.length <= 1) {
            return;
        }

        const pagesToClose = pages.value.filter(page => page.fullPath !== currentPage.fullPath);
        pages.value = [currentPage];

        for (const page of pagesToClose) {
            _componentKeySuffixMap.value.delete(page.fullPath);
        }
    }

    // 关闭所有页面（优化：批量操作减少响应式更新）
    const closeAllPage = async () => {
        pages.value = [];
        _componentKeySuffixMap.value.clear();
        await router.push('/')
    }

    return {
        pages,
        keepAliveInclude,
        _componentKeySuffixMap, // 暴露用于调试查看

        afterRouteChange,
        computeComponentKey,

        closeCurrentPage,
        closePage,
        refreshPage,
        closeOtherPage,
        closeAllPage,
    };
});
