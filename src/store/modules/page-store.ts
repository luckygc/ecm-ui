import {defineStore} from "pinia";
import {
    type Component,
    defineComponent,
    h,
    markRaw,
    nextTick,
    readonly,
    type Ref,
    ref,
    type ShallowRef,
    shallowRef,
    toValue,
} from "vue";
import {type RouteLocationNormalizedLoadedGeneric, useRoute, useRouter,} from "vue-router";
import {ElMessage} from "element-plus";

type Page = Pick<
    RouteLocationNormalizedLoadedGeneric,
    "fullPath" | "name" | "meta" | "path"
>;

type PageOrRouteOrFullPath = Page | RouteLocationNormalizedLoadedGeneric | string;

const needKeepAlive = (
    pageOrRoute: Page | RouteLocationNormalizedLoadedGeneric
): boolean => {
    return pageOrRoute.meta?.["keepAlive"] === true;
};

/**
 * 参考HashMap的computeIfAbsent方法
 * 如果map中不存在key，则调用mappingFunction计算value，并设置到map中
 * 如果map中存在key，则返回map中对应的value
 * @param map 目标map
 * @param key 目标key
 * @param mappingFunction 计算value的函数
 */
const computeIfAbsent = <K, V>(
    map: Map<K, V> | Ref<Map<K, V>>,
    key: K,
    mappingFunction: (key: K) => V
): V => {
    const _map = toValue(map);

    if (_map.has(key)) {
        return _map.get(key)!;
    }

    const value = mappingFunction(key);
    _map.set(key, value);
    return value;
};

const getFullPath = (pageOrRouteOrFullPath: PageOrRouteOrFullPath): string => {
    if (typeof pageOrRouteOrFullPath === 'string') {
        return pageOrRouteOrFullPath;
    }

    return pageOrRouteOrFullPath.fullPath;
}

// 包裹组件缓存,key:包裹组件name,value:包裹组件
const _wrapperComponentCache = new Map<string, Component>();

/**
 * 根据路由包裹一层组件,包裹组件name为路由fullPath。缓存不存在就新建
 * @param component 原始组件
 * @param route 路由
 */
const createOrGetWrapperComponentByRoute = (
    component: Component,
    route: RouteLocationNormalizedLoadedGeneric
) => {
    if (!component) {
        return null;
    }

    return computeIfAbsent(
        _wrapperComponentCache,
        getFullPath(route),
        componentName => {
            return markRaw(
                defineComponent({
                    name: componentName,
                    setup(props, {attrs, slots}) {
                        return () => h(component, {...attrs, ...props}, slots);
                    },
                })
            );
        }
    );
};

/**
 * 根据路由信息计算组件Key
 * @param pageOrRouteOrFullPath
 */
const computeComponentKey = (
    pageOrRouteOrFullPath: PageOrRouteOrFullPath
) => {
    return `${getFullPath(pageOrRouteOrFullPath)}_${Date.now()}`;
};

/**
 * 根据fullPath在页面数组查找页面
 * @param pages 页面数组
 * @param pageOrRouteOrFullPath 路由或fullPath
 */
const findPageFromPages = (pages: Page[] | ShallowRef<Page[]>, pageOrRouteOrFullPath: PageOrRouteOrFullPath): Page | undefined => {
    let fullPath = getFullPath(pageOrRouteOrFullPath)

    return toValue(pages).find((page) => page.fullPath === fullPath)
}

const storeSetup = () => {
    // 页面数组
    const pages = shallowRef<Page[]>([]);
    // 组件缓存
    const keepAliveInclude = shallowRef<string[]>([]);
    const maxKeepAliveCount = 10;

    // 组件Key缓存,key:路由fullPath,value:组件key
    const _componentKeyCache = ref<Map<string, string>>(new Map());
    const _router = useRouter();
    const _route = useRoute();
    // 非页签页面路由名称
    const _specialRouteNames = ["Index", "Login", "NotFound"];

    const _afterPageAdd = (newPage: Page) => {
        if (!needKeepAlive(newPage)) {
            return;
        }

        keepAliveInclude.value = pages.value
            .filter(needKeepAlive)
            .map(page => page.fullPath);
    }

    const afterRouteChange = (to: RouteLocationNormalizedLoadedGeneric) => {
        // 无需管理的页面
        if (_specialRouteNames.findIndex((name) => to.name === name) > -1) {
            return;
        }

        // 检查页面是否已存在
        if (findPageFromPages(pages, to)) {
            return;
        }

        if (pages.value.length >= maxKeepAliveCount) {
            ElMessage.warning("当前打开页面过多,建议关闭部分不需要的页面");
        }

        // 新建并追加page
        const newPage: Page = {
            fullPath: to.fullPath,
            path: to.path,
            name: to.name,
            meta: {...to.meta},
        };
        pages.value = [...pages.value, newPage];

        _afterPageAdd(newPage);
    };

    // 刷新当前页面
    const refreshCurrentPage = async () => {
        return refreshPage(_route.fullPath);
    };

    const refreshPage = async (pageOrRouteOrFullPath: PageOrRouteOrFullPath) => {
        const waitRefreshPage = findPageFromPages(pages, getFullPath(pageOrRouteOrFullPath));
        if (!waitRefreshPage) {
            return;
        }

        const reRenderPage = () => _componentKeyCache.value.set(getFullPath(waitRefreshPage), computeComponentKey(waitRefreshPage));

        if (!needKeepAlive(waitRefreshPage)) {
            reRenderPage();
            return;
        }

        // 删除缓存,重渲染,加回缓存
        const originalKeepAliveInclude = keepAliveInclude.value;
        keepAliveInclude.value = keepAliveInclude.value.filter(
            (name) => name !== _route.fullPath
        );
        reRenderPage();
        await nextTick();
        keepAliveInclude.value = originalKeepAliveInclude;
    }

    const _afterPageClose = (...closedPages: Page[]) => {
        if (pages.value.length === 0) {
            _componentKeyCache.value.clear();
            _wrapperComponentCache.clear();
            return;
        }

        for (const page of closedPages) {
            _componentKeyCache.value.delete(page.fullPath);
            _wrapperComponentCache.delete(page.fullPath);
        }
    }

    const closeCurrentPage = async () => {
        return closePage(_route.fullPath);
    };

    // 关闭指定路由页面
    const closePage = async (pageOrRouteOrFullPath: PageOrRouteOrFullPath) => {
        const waitClosePage = findPageFromPages(pages, pageOrRouteOrFullPath);
        if (!waitClosePage) {
            throw new Error(`页面${pageOrRouteOrFullPath}不存在`);
        }

        pages.value = pages.value.filter(page => page.fullPath !== waitClosePage.fullPath);

        _afterPageClose(waitClosePage)

        // 如果关闭的不是当前激活的页面,不需要跳转
        if (waitClosePage.fullPath !== _route.fullPath) {
            return;
        }

        // 没有页面了就跳转到首页
        if (pages.value.length === 0) {
            return await _router.push("/");
        }

        // 跳转到最后一个页面
        return await _router.push(pages.value[pages.value.length - 1]!.fullPath);
    };

    /**
     * 根据路由获取组件的Key,路由fullPath加时间戳,缓存不存在就新建
     */
    const createOrGetComponentKeyByRoute = (routeOrPageOrFullPath: PageOrRouteOrFullPath): string => {
        return computeIfAbsent(_componentKeyCache, getFullPath(routeOrPageOrFullPath), computeComponentKey);
    }

    // 关闭其他页面
    const closeOtherPage = async () => {
        if (pages.value.length <= 1) {
            return;
        }

        const currentPage = findPageFromPages(pages, _route.fullPath)!;
        if (!currentPage) {
            throw new Error(`当前页面${_route.fullPath}不存在`)
        }

        const waitClosePages = pages.value.filter(page => page.fullPath !== currentPage.fullPath);
        pages.value = [currentPage];

        _afterPageClose(...waitClosePages)
    };

    // 关闭所有页面
    const closeAllPage = async () => {
        pages.value = [];
        _afterPageClose();
        return await _router.push("/");
    };

    return {
        pages: readonly(pages),
        keepAliveInclude: readonly(keepAliveInclude),
        maxKeepAliveCount,

        // 路由和页面组件
        afterRouteChange,
        createOrGetComponentKeyByRoute,
        createOrGetWrapperComponentByRoute,

        // 页面操作
        refreshCurrentPage,
        closeCurrentPage,
        closePage,
        closeOtherPage,
        closeAllPage,
    };
};

export const usePageStore = defineStore("page", storeSetup);
