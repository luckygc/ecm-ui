import {defineStore} from "pinia";
import {computed, ref, watch} from "vue";
import type {RouteLocationNormalizedLoadedGeneric} from "vue-router";
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

    // 获取当前激活的页面对象
    const activeRoute = ref<VisitedRoute>();

    // KeepAlive include列表 - 统一管理缓存
    const keepAliveInclude = ref<string[]>([]);

    // 修改 refreshKey 的数据结构，从单一字符串变为 Map
    const refreshKeyMap = ref<Map<string, "" | "_">>(new Map());

    // 访问过的路由列表
    const visitedRoutes = computed(() =>
        Array.from(visitedRouteMap.value.values())
    );
    // 当前激活的路由fullPath
    const activeRouteFullPath = computed(() => activeRoute.value?.fullPath);
    // 当前激活的路由名称
    const activeRouteName = computed(() => activeRoute.value?.name);

    watch(activeRoute, (_, oldVal) => {
        if (oldVal) {
            refreshKeyMap.value.delete(oldVal.fullPath);
        }
    })

    // 添加到KeepAlive缓存
    function _addToKeepAlive(componentName: string) {
        if (!keepAliveInclude.value.includes(componentName)) {
            keepAliveInclude.value.push(componentName);
        }
    }

    function _batchRemoveFromKeepAlive(componentNames: string[]) {
        keepAliveInclude.value = keepAliveInclude.value.filter(
            (name) => !componentNames.includes(name)
        );
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
            // 存在则切换到该页面
            activeRoute.value = visitedRouteMap.value.get(routeFullPath)!;
        } else {
            // 不存在则添加新页面
            _addVisitedRoute(route);
        }
    }

    // 添加访问过的路由
    function _addVisitedRoute(route: RouteLocationNormalizedLoadedGeneric) {
        const routeFullPath = route.fullPath;

        // 如果页面已存在，不重复添加
        if (visitedRouteMap.value.has(routeFullPath)) {
            activeRoute.value = visitedRouteMap.value.get(routeFullPath);
            return;
        }

        // 创建路由对象的副本并存储
        const visitedRoute = createVisitedRoute(route);
        visitedRouteMap.value.set(routeFullPath, visitedRoute);
        activeRoute.value = visitedRoute; // 设置当前激活的路由

        // 如果页面需要缓存，添加到KeepAlive
        if (needKeepAlive(visitedRoute)) {
            const componentName = computeDynamicPageComponentName(
                visitedRoute.fullPath
            );
            _addToKeepAlive(componentName);
        }
    }

    // 关闭指定路由页面
    async function _removeVisitedRoute(routeFullPath: string): Promise<void> {
        _batchRemoveVisitedRoute([routeFullPath]);
    }

    function _batchRemoveVisitedRoute(routeFullPaths: string[]) {
        const waitRemoveVisitedRouteFullPaths: string[] = [];
        for (const routeFullPath of routeFullPaths) {
            if (!visitedRouteMap.value.has(routeFullPath)) {
                continue;
            }

            waitRemoveVisitedRouteFullPaths.push(routeFullPath);
        }

        if (waitRemoveVisitedRouteFullPaths.length === 0) {
            return;
        }

        waitRemoveVisitedRouteFullPaths.forEach((routeFullPath) => {
            if (activeRouteFullPath.value === routeFullPath) {
                activeRoute.value = undefined; // 清除当前激活的路由
            }
            visitedRouteMap.value.delete(routeFullPath);
        });

        if (!activeRoute.value) {
            const lastRouteFullPath = getLastRouteFullPath();
            if (lastRouteFullPath) {
                router.push(lastRouteFullPath);
            }
        }

        _batchRemoveFromKeepAlive(
            waitRemoveVisitedRouteFullPaths.map(computeDynamicPageComponentName)
        );
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
        if (!activeRouteFullPath.value) {
            return;
        }

        const currentPath = activeRouteFullPath.value;
        const currentKey = refreshKeyMap.value.get(currentPath) || "";
        refreshKeyMap.value.set(currentPath, currentKey === "" ? "_" : "");
    }

    // 关闭其他页面
    async function closeOtherPages() {
        const waitRemoveRoutePaths = Array.from(
            visitedRouteMap.value.keys()
        ).filter((routeFullPath) => routeFullPath !== activeRouteFullPath.value);
        _batchRemoveVisitedRoute(waitRemoveRoutePaths);
    }

    // 关闭所有页面
    async function closeAllPages() {
        _batchRemoveVisitedRoute(Array.from(visitedRouteMap.value.keys()));
    }

    return {
        visitedRoutes,
        activeRouteName,
        activeRouteFullPath,
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
