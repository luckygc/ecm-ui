import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {type RouteLocationNormalizedLoadedGeneric, useRoute} from "vue-router";
import type {VisitedPage} from "@/types/store/route-store-types.ts";
import router from "@/router";

// 判断路由是否需要缓存
function needKeepAlive(route: VisitedPage): boolean {
    // 默认缓存，除非明确设置为false
    return !(route.meta?.keepAlive === false);
}

// 计算缓存组件的名称
function computeComponentName(routeFullPath: string): string {
    return routeFullPath.replace(/[^a-zA-Z0-9]/g, "_");
}

function createVisitedPage(
    route: RouteLocationNormalizedLoadedGeneric
): VisitedPage {
    return {
        fullPath: route.fullPath,
        path: route.path,
        name: route.name,
        meta: {...route.meta},
    };
}

export const usePageStore = defineStore("page", () => {
    // 访问过的路由映射
    const visitedPageMap = ref<Map<string, VisitedPage>>(new Map());
    // 访问过的路由列表
    const visitedPages = computed(() =>
        Array.from(visitedPageMap.value.values())
    );

    const activeRoute = useRoute();

    // KeepAlive include列表 - 统一管理缓存
    const keepAliveInclude = ref<string[]>([]);

    // 每个组件的refreshKey,用于刷新组件
    const refreshKeyMap = ref<Map<string, "" | "_">>(new Map());

    // 添加到KeepAlive缓存
    function _addToKeepAlive(componentName: string) {
        if (!keepAliveInclude.value.includes(componentName)) {
            keepAliveInclude.value.push(componentName);
        }
    }

    function _removeFromKeepAlive(componentName: string) {
        const index = keepAliveInclude.value.indexOf(componentName);
        if (index > -1) {
            keepAliveInclude.value.splice(index, 1);
        }
    }

    function handleRouteChange(route: RouteLocationNormalizedLoadedGeneric) {
        // 跳过隐藏的路由或没有实际页面的路由
        if (route.meta?.hidden) {
            return;
        }

        const routeFullPath = route.fullPath;

        // 检查页面是否已存在
        if (visitedPageMap.value.has(routeFullPath)) {
            return;
        }

        // 创建路由对象的副本并存储
        const visitedRoute = createVisitedPage(route);
        visitedPageMap.value.set(routeFullPath, visitedRoute);

        // 如果页面需要缓存，添加到KeepAlive
        if (needKeepAlive(visitedRoute)) {
            const componentName = computeComponentName(visitedRoute.fullPath);
            _addToKeepAlive(componentName);
        }
    }

    // 关闭指定路由页面
    async function closePage(routeFullPath: string): Promise<void> {
        if (!visitedPageMap.value.has(routeFullPath)) {
            return;
        }

        // 从KeepAlive中移除
        _removeFromKeepAlive(computeComponentName(routeFullPath));
        visitedPageMap.value.delete(routeFullPath);

        if (activeRoute.fullPath === routeFullPath) {
            await router.push(getLastRouteFullPath() || "/"); // 跳转到最后一个路由或根路径
        }
    }

    // 获取最后一个路由
    function getLastRouteFullPath(): string | null {
        if (visitedPages.value.length === 0) {
            return null;
        }

        return visitedPages.value[visitedPages.value.length - 1].fullPath;
    }

    function computeComponentKey(routeFullPath: string): string {
        const key = refreshKeyMap.value.get(routeFullPath) || "";
        return `${routeFullPath}${key}`;
    }

    // 刷新当前页面
    function refreshCurrentPage() {
        if (!activeRoute?.fullPath) {
            return;
        }

        const currentPath = activeRoute.fullPath;
        const currentKey = refreshKeyMap.value.get(currentPath) || "";
        refreshKeyMap.value.set(currentPath, currentKey === "" ? "_" : "");
    }

    // 关闭其他页面
    async function closeOtherPages() {
        for (const pageFullPath of Array.from(visitedPageMap.value.keys())
            .filter((pageFullPath) => pageFullPath !== activeRoute.fullPath)) {
            await closePage(pageFullPath);
        }
    }

    // 关闭所有页面
    async function closeAllPages() {
        for (const pageFullPath of Array.from(visitedPageMap.value.keys())) {
            await closePage(pageFullPath);
        }
    }

    return {
        visitedPages,
        keepAliveInclude,

        handleRouteChange,
        computeComponentKey,
        computeComponentName,
        closePage,
        refreshCurrentPage,
        closeOtherPages,
        closeAllPages,
    };
});
