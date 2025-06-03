import {type Component, defineComponent, h} from "vue";
import type {RouteLocationNormalizedLoadedGeneric} from "vue-router";
import type {Page} from "@/types/store/route-store-types.ts";

// 专用工具类,适配多实例组件的动态缓存,统一路由页面组件的命名规则

// Component缓存
export const componentCache = new Map<string, Component>();

// 组件名缓存
const componentNameCache = new Map<string, string>();

// 计算缓存组件的名称
const computeComponentName = (route: RouteLocationNormalizedLoadedGeneric | Page): string => {
    let fullPath = route.fullPath;
    if (componentNameCache.has(fullPath)) {
        return componentNameCache.get(fullPath)!;
    }

    const componentName = fullPath.replace(/[^a-zA-Z0-9]/g, "_");
    componentNameCache.set(fullPath, componentName);
    return componentName;
}

const createWrappedComponentByRoute = (wrappedComponent: Component, route: RouteLocationNormalizedLoadedGeneric) => {
    const fullPath = route.fullPath;

    if (componentCache.has(fullPath)) {
        return componentCache.get(fullPath);
    }

    const dynamicComponent = defineComponent({
        name: computeComponentName(route),
        setup(props, {attrs, slots}) {
            return () => h(wrappedComponent, {...attrs, ...props}, slots);
        },
    });

    // 将组件添加到缓存中
    componentCache.set(fullPath, dynamicComponent);

    return dynamicComponent;
}

export {computeComponentName, createWrappedComponentByRoute}