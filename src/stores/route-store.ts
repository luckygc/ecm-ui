import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {type RouteLocationNormalizedLoadedGeneric, useRoute} from "vue-router";
import type {VisitedRoute} from "@/types/store/route-store-types.ts";
import router from "@/router";

// 处理路由列表
// 处理激活路由
// 处理keepAlive

// 判断路由是否需要缓存
function needKeepAlive(route: VisitedRoute): boolean {
    // 默认缓存，除非明确设置为false
    return !(route.meta?.keepAlive === false);
}

// 计算缓存组件的名称
function computeDynamicPageComponentName(routeFullPath: string): string {
    return routeFullPath.replace(/[^a-zA-Z0-9]/g, "_");
}

// 创建路由对象的副本，避免响应式引用问题
function createVisitedRoute(
    route: RouteLocationNormalizedLoadedGeneric
): VisitedRoute {
    return {
        fullPath: route.fullPath,
        path: route.path,
        name: route.name,
        meta: {...route.meta},
    };
}

export const useRouteStore = defineStore("page", () => {
    // 访问过的路由映射
    const visitedRouteMap = ref<Map<string, VisitedRoute>>(new Map());
    // 访问过的路由列表
    const visitedRoutes = computed(() =>
        Array.from(visitedRouteMap.value.values())
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
        // 跳过重定向路由（通常是父级路由）
        // 如果路由路径是根路径"/"，跳过（这通常是重定向路由）
        if (route.meta?.hidden || route.redirectedFrom || route.path === "/") {
            return;
        }

        const routeFullPath = route.fullPath;

        // 检查页面是否已存在
        if (visitedRouteMap.value.has(routeFullPath)) {
            return;
        }

        // 创建路由对象的副本并存储
        const visitedRoute = createVisitedRoute(route);
        visitedRouteMap.value.set(routeFullPath, visitedRoute);

        // 如果页面需要缓存，添加到KeepAlive
        if (needKeepAlive(visitedRoute)) {
            const componentName = computeDynamicPageComponentName(visitedRoute.fullPath);
            _addToKeepAlive(componentName);
        }
    }

    // 关闭指定路由页面
    async function _removeVisitedRoute(routeFullPath: string): Promise<void> {
        if (!visitedRouteMap.value.has(routeFullPath)) {
            return;
        }

        // 从KeepAlive中移除
        _removeFromKeepAlive(computeDynamicPageComponentName(routeFullPath));
        visitedRouteMap.value.delete(routeFullPath);

        if (activeRoute.fullPath === routeFullPath) {
            await router.push(getLastRouteFullPath() || "/"); // 跳转到最后一个路由或根路径
        }
    }

    async function _batchRemoveVisitedRoute(routeFullPaths: string[]) {
        for (const routeFullPath of routeFullPaths) {
            await _removeVisitedRoute(routeFullPath);
        }
    }

    // 获取最后一个路由
    function getLastRouteFullPath(): string | null {
        if (visitedRoutes.value.length === 0) {
            return null;
        }

        return visitedRoutes.value[visitedRoutes.value.length - 1].fullPath;
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
        if (!activeRoute?.fullPath) {
            return;
        }

        const waitRemoveRoutePaths = Array.from(visitedRouteMap.value.keys())
            .filter((routeFullPath) => routeFullPath !== activeRoute.fullPath);

        await _batchRemoveVisitedRoute(waitRemoveRoutePaths);
    }

    // 关闭所有页面
    async function closeAllPages() {
        await _batchRemoveVisitedRoute(Array.from(visitedRouteMap.value.keys()));
    }

    return {
        visitedRoutes,
        keepAliveInclude,

        handleRouteChange,
        computeComponentKey,
        computeDynamicPageComponentName,
        closePage: _removeVisitedRoute,
        refreshCurrentPage,
        closeOtherPages,
        closeAllPages,
    };
});
