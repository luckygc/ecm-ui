import {defineStore} from "pinia";
import {type Component, computed, defineComponent, h, markRaw, ref, shallowRef} from "vue";
import {type RouteLocationNormalizedLoadedGeneric, useRoute, useRouter} from "vue-router";
import type {Page} from "@/types/store/route-store-types.ts";
import {ElMessage} from "element-plus";

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

// PageComponent缓存
const pageComponentCache = new Map<string, Component>();

// 计算页面组件的名称,即使内存里组件name可以随意，但是为了符合规范，还是替换特殊符号
const computeWrappedPageComponentName = (route: RouteLocationNormalizedLoadedGeneric | Page): string => {
    return 'Page' + route.fullPath.replace(/[^a-zA-Z0-9]/g, "-");
}

/**
 * 包装页面组件,用于多实例页面的缓存
 * @param pageComponent 原始页面组件
 * @param route 路由
 */
const wrapPageComponent = (pageComponent: Component, route: RouteLocationNormalizedLoadedGeneric) => {
    if (!pageComponent) {
        return null;
    }

    const wrappedPageComponentName = computeWrappedPageComponentName(route);
    if (pageComponentCache.has(wrappedPageComponentName)) {
        return pageComponentCache.get(wrappedPageComponentName);
    }

    const wrappedPageComponent = markRaw(
        defineComponent({
            name: wrappedPageComponentName,
            setup(props, { attrs, slots }) {
                return () => h(pageComponent, { ...attrs, ...props }, slots);
            },
        })
    );

    // 将组件定义添加到缓存中
    pageComponentCache.set(wrappedPageComponentName, wrappedPageComponent);

    return wrappedPageComponent;
}

const storeSetup = () => {
    const router = useRouter();
    const route = useRoute();
    // 页面数组
    const pages = shallowRef<Page[]>([]);
    // 每个页面组件的Key的后缀,用于刷新组件
    const _componentKeySuffixMap = ref<Map<string, string>>(new Map());
    // 缓存
    const keepAliveInclude = computed(() => pages.value.filter(needKeepAlive).map(computeWrappedPageComponentName));
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

        if (pages.value.length > 14) {
            ElMessage.warning('当前打开页面过多,建议关闭部分不需要的页面');
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
    const closePage = async (routeFullPath: string) => {
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
            return await router.push('/')
        }

        // 跳转到最后一个页面
        return await router.push(pages.value[pages.value.length - 1]!.fullPath);
    }

    /**
     * 计算页面组件的Key,用于强制刷新组件
     */
    const computePageComponentKey = (r: RouteLocationNormalizedLoadedGeneric): string => {
        const fullPath = r.fullPath;
        let keySuffix = _componentKeySuffixMap.value.get(fullPath);
        if (!keySuffix) {
            keySuffix = `_${Date.now()}`;
            _componentKeySuffixMap.value.set(fullPath, keySuffix);
        }

        return `${fullPath}${keySuffix}`;
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
        return await router.push('/')
    }

    return {
        pages,
        keepAliveInclude,

        afterRouteChange,
        computePageComponentKey,
        wrapPageComponent,

        closeCurrentPage,
        closePage,
        refreshPage,
        closeOtherPage,
        closeAllPage,
    };
}

export const usePageStore = defineStore("page", storeSetup);
