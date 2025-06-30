import {defineStore} from "pinia";
import {type Component, computed, defineComponent, h, markRaw, nextTick, shallowRef, triggerRef} from "vue";
import {type RouteLocationNormalizedLoadedGeneric, useRoute, useRouter,} from "vue-router";
import Page from "@/components/page/Page.vue";
import routeMetaUtils from "@/utils/route/route-meta-utils.ts";

type Page = Pick<RouteLocationNormalizedLoadedGeneric, "fullPath" | "meta"> & {
    component: Component;
    componentName: string;
    componentKey: string;
};

const buildComponentKey = (fullPath: string) => {
    return `${fullPath}_${Date.now()}`;
};

const wrapComponent = (
    component: Component,
    componentName: string
): Component => {
    return markRaw(
        defineComponent({
            name: componentName,
            setup(props, {attrs, slots}) {
                return () => h(component, {...attrs, ...props}, slots);
            },
        })
    );
};

const storeSetup = () => {
    // 页面
    const _pageMap = shallowRef(new Map<string, Page>());
    // 页面过渡
    const pageTransitionDuration = computed(() => {
        return {
            enter: 100,
            leave: _pageMap.value.size == 0 ? 0 : 100,
        };
    });

    const pages = computed(() => {
        return Array.from(_pageMap.value.values());
    });
    const keepAliveInclude = computed(() => {
        return Array.from(_pageMap.value.values())
            .filter(routeMetaUtils.isKeepAlive)
            .map((page) => page.componentName);
    });

    // 路由
    const _router = useRouter();
    const _currentRoute = useRoute();

    const _createPage = (
        originalComponent: Component,
        route: RouteLocationNormalizedLoadedGeneric
    ): Page => {
        return {
            component: wrapComponent(originalComponent, route.fullPath),
            componentKey: buildComponentKey(route.fullPath),
            componentName: route.fullPath,
            fullPath: route.fullPath,
            meta: route.meta,
        };
    };

    const createOrGetPage = (
        originalComponent: Component,
        route: RouteLocationNormalizedLoadedGeneric
    ): Page => {
        if (_pageMap.value.has(route.fullPath)) {
            return _pageMap.value.get(route.fullPath)!;
        }

        const newPage = _createPage(originalComponent, route);
        _pageMap.value.set(newPage.fullPath, newPage);
        triggerRef(_pageMap);
        return newPage;
    };

    const _refreshPage = async (waitRefreshPage: Page) => {
        waitRefreshPage.componentKey = buildComponentKey(waitRefreshPage.fullPath);
        triggerRef(_pageMap);
        await nextTick();
    };

    const refreshPage = async (fullPath: string) => {
        const waitRefreshPage = _pageMap.value.get(fullPath);
        if (!waitRefreshPage) {
            return;
        }

        if (!routeMetaUtils.isKeepAlive(waitRefreshPage)) {
            return await _refreshPage(waitRefreshPage);
        }

        // 删除缓存,重渲染,加回缓存
        // @ts-ignore
        waitRefreshPage.meta.isKeepAlive = false;
        triggerRef(_pageMap);
        await _refreshPage(waitRefreshPage);
        waitRefreshPage.meta.isKeepAlive = true;
        triggerRef(_pageMap);
    };

    // 刷新当前页面
    const refreshCurrentPage = async () => {
        return refreshPage(_currentRoute.fullPath);
    };

    const _checkCloseCurrentPage = async () => {
        if (_pageMap.value.has(_currentRoute.fullPath)) {
            return;
        }

        const latPageFullPath = Array.from(_pageMap.value.keys()).pop();
        if (latPageFullPath) {
            return await _router.push(latPageFullPath);
        }

        return await _router.push("/");
    };

    // 关闭指定路由页面
    const closePage = async (fullPath: string) => {
        if (!_pageMap.value.has(fullPath)) {
            throw new Error(`页面${fullPath}不存在`);
        }

        _pageMap.value.delete(fullPath);
        await _checkCloseCurrentPage();
        triggerRef(_pageMap);
    };

    const closeCurrentPage = async () => {
        return closePage(_currentRoute.fullPath);
    };

    // 关闭其他页面
    const closeOtherPage = async () => {
        if (_pageMap.value.size <= 1) {
            return;
        }

        const currentFullPath = _currentRoute.fullPath;
        const currentPage = _pageMap.value.get(currentFullPath);
        if (!currentPage) {
            throw new Error(`当前页面${currentFullPath}不存在`);
        }

        for (const fullPath of _pageMap.value.keys()) {
            if (fullPath !== currentFullPath) {
                _pageMap.value.delete(fullPath);
            }
        }

        await _checkCloseCurrentPage();
        triggerRef(_pageMap);
    };

    // 关闭所有页面
    const closeAllPage = async () => {
        _pageMap.value.clear();
        await _checkCloseCurrentPage();
        triggerRef(_pageMap);
    };

    return {
        pages,
        keepAliveInclude,
        pageTransitionDuration,
        _pageMap,

        createOrGetPage,
        refreshCurrentPage,
        closeCurrentPage,
        closePage,
        closeOtherPage,
        closeAllPage,
    };
};

export const usePageStore = defineStore("page", storeSetup);
