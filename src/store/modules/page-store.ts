import {defineStore} from "pinia";
import {
    type Component,
    defineComponent,
    h,
    markRaw,
    nextTick,
    readonly,
    ref,
    shallowRef,
    watch,
} from "vue";
import {
    type RouteLocationNormalizedLoadedGeneric,
    useRoute,
    useRouter,
} from "vue-router";
import {ElMessage} from "element-plus";

type Page = Pick<
    RouteLocationNormalizedLoadedGeneric,
    "fullPath" | "name" | "meta" | "path"
>;

const needKeepAlive = (
    page: Page | RouteLocationNormalizedLoadedGeneric
): boolean => {
    return page.meta?.["keepAlive"] === true;
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
    map: Map<K, V>,
    key: K,
    mappingFunction: (key: K) => V
): V => {
    if (map.has(key)) {
        return map.get(key)!;
    }

    const value = mappingFunction(key);
    map.set(key, value);
    return value;
};

// 页面组件定义缓存,key:包裹组件name,value:包裹组件定义
const PageComponentCache = new Map<string, Component>();

// 计算页面组件的名称,即使内存里组件name可以随意，但是为了符合规范，还是替换特殊符号
const computeComponentName = (
    routeOrFullPath: RouteLocationNormalizedLoadedGeneric | Page | string
): string => {
    if (typeof routeOrFullPath === "string") {
        return "Page" + routeOrFullPath.replace(/[^a-zA-Z0-9]/g, "-");
    }

    return "Page" + routeOrFullPath.fullPath.replace(/[^a-zA-Z0-9]/g, "-");
};

/**
 * 包装页面组件,用于多实例页面的缓存
 * @param pageComponent 原始页面组件
 * @param route 路由
 */
const wrapPageComponent = (
    pageComponent: Component,
    route: RouteLocationNormalizedLoadedGeneric
) => {
    if (!pageComponent) {
        return null;
    }

    return computeIfAbsent(
        PageComponentCache,
        computeComponentName(route),
        (componentName) => {
            return markRaw(
                defineComponent({
                    name: componentName,
                    setup(props, {attrs, slots}) {
                        return () => h(pageComponent, {...attrs, ...props}, slots);
                    },
                })
            );
        }
    );
};

const computeComponentKey = (
    routeOrFullPath: RouteLocationNormalizedLoadedGeneric | Page | string
) => {
    if (typeof routeOrFullPath === "string") {
        return `${routeOrFullPath}_${Date.now()}`;
    }

    return `${routeOrFullPath.fullPath}_${Date.now()}`;
};

const storeSetup = () => {
    const router = useRouter();
    const route = useRoute();
    // 页面数组
    const pages = shallowRef<Page[]>([]);
    // 每个页面组件的Key的后缀,用于刷新组件
    const _componentKeySuffixMap = ref<Map<string, string>>(new Map());
    // 缓存
    const keepAliveInclude = shallowRef<string[]>([]);
    // 非页签页面路由名称
    const specialRouteNames = ["Index", "Login", "NotFound"];

    watch(
        () => pages.value,
        () => {
            keepAliveInclude.value = pages.value
                .filter(needKeepAlive)
                .map(computeComponentName);
        }
    );

    const findPageByRouteFullPath = (fullPath: string): Page | undefined => {
        return pages.value.find((page) => page.fullPath === fullPath);
    };

    const afterRouteChange = (to: RouteLocationNormalizedLoadedGeneric) => {
        // 无需管理的页面
        if (specialRouteNames.findIndex((name) => to.name === name) > -1) {
            return;
        }

        // 检查页面是否已存在
        if (findPageByRouteFullPath(to.fullPath)) {
            return;
        }

        if (pages.value.length > 14) {
            ElMessage.warning("当前打开页面过多,建议关闭部分不需要的页面");
        }

        // 新建并追加page
        const page: Page = {
            fullPath: to.fullPath,
            path: to.path,
            name: to.name,
            meta: {...to.meta},
        };

        pages.value = [...pages.value, page];
    };

    const closeCurrentPage = async () => {
        const currentPage = findPageByRouteFullPath(route.fullPath);
        if (!currentPage) {
            return;
        }

        return closePage(currentPage.fullPath);
    };

    // 关闭指定路由页面
    const closePage = async (routeFullPath: string) => {
        const waitClosePage = findPageByRouteFullPath(routeFullPath);
        if (!waitClosePage) {
            throw new Error(`页面{fullPath=${routeFullPath}}不存在`);
        }

        pages.value = pages.value.filter((page) => page.fullPath !== routeFullPath);
        _componentKeySuffixMap.value.delete(routeFullPath);
        PageComponentCache.delete(computeComponentName(waitClosePage));

        // 如果关闭的不是当前激活的页面,不需要跳转
        if (routeFullPath !== route.fullPath) {
            return;
        }

        if (pages.value.length === 0) {
            return await router.push("/");
        }

        // 跳转到最后一个页面
        return await router.push(pages.value[pages.value.length - 1]!.fullPath);
    };

    /**
     * 计算页面组件的Key,路由fullPath加时间戳，用于强制刷新组件
     */
    const getPageComponentKey = (
        r: RouteLocationNormalizedLoadedGeneric
    ): string =>
        computeIfAbsent(
            _componentKeySuffixMap.value,
            r.fullPath,
            computeComponentKey
        );

    // 刷新当前页面
    const refreshPage = async () => {
        const currentPage = findPageByRouteFullPath(route.fullPath);
        if (!currentPage) {
            return;
        }

        if (currentPage.meta?.["keepAlive"]) {
            // 删除缓存,重渲染,加回缓存
            const originalKeepAliveInclude = keepAliveInclude.value;
            keepAliveInclude.value = keepAliveInclude.value.filter(
                (name) => name !== computeComponentName(route.fullPath)
            );
            _componentKeySuffixMap.value.set(
                currentPage.fullPath,
                computeComponentKey(currentPage)
            );
            await nextTick();
            keepAliveInclude.value = originalKeepAliveInclude;
        } else {
            _componentKeySuffixMap.value.set(
                currentPage.fullPath,
                computeComponentKey(currentPage)
            );
        }
    };

    // 关闭其他页面
    const closeOtherPage = async () => {
        const currentPage = findPageByRouteFullPath(route.fullPath);
        if (!currentPage || pages.value.length <= 1) {
            return;
        }

        const pagesToClose = pages.value.filter(
            (page) => page.fullPath !== currentPage.fullPath
        );
        pages.value = [currentPage];

        for (const page of pagesToClose) {
            _componentKeySuffixMap.value.delete(page.fullPath);
            PageComponentCache.delete(computeComponentName(page));
        }
    };

    // 关闭所有页面（优化：批量操作减少响应式更新）
    const closeAllPage = async () => {
        pages.value = [];
        _componentKeySuffixMap.value.clear();
        PageComponentCache.clear();
        return await router.push("/");
    };

    return {
        pages: readonly(pages),
        keepAliveInclude: readonly(keepAliveInclude),

        // 路由和页面组件
        afterRouteChange,
        getPageComponentKey,
        wrapPageComponent,

        // 页面操作
        closeCurrentPage,
        closePage,
        refreshPage,
        closeOtherPage,
        closeAllPage,
    };
};

export const usePageStore = defineStore("page", storeSetup);
