import { defineComponent, h, type Component } from "vue";
import type { RouteLocationNormalizedLoaded } from "vue-router";

// 静态全局 map 记录分配的序号
const multiComponentNumberMap: Record<string, number> = {};
const routeFullPathMap: Record<string, string> = {};
const componentNameMap = new Map<string, string>();

/**
 * 生成基础组件名称（基于路由名称）
 */
const generateBaseComponentName = (
  route: RouteLocationNormalizedLoaded
): string => {
  // 优先使用路由名称
  if (route.name) {
    return String(route.name);
  }

  // 如果没有路由名称，基于路径生成
  return route.path
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
};

/**
 * 检查是否允许多实例
 */
const isMultiInstanceAllowed = (
  route: RouteLocationNormalizedLoaded
): boolean => {
  const meta = route.meta || {};
  return !!(
    meta.multi === true ||
    meta.allowMultiple === true ||
    meta.multipleInstances === true ||
    meta.formComponent === true ||
    meta.editableComponent === true ||
    meta.modalComponent === true ||
    meta.dynamicComponent === true
  );
};

/**
 * 计算最终的组件名称
 */
export const computeComponentName = (
  route: RouteLocationNormalizedLoaded,
  component?: Component
): string => {
  // 如果明确设置不缓存，返回原始组件名或匿名
  const notKeepalive = route.meta?.keepalive === false;
  if (notKeepalive) {
    return component?.name || "Anonymous";
  }

  const fullPath = route.fullPath;
  const baseComponentName = generateBaseComponentName(route);

  // 检查是否已经为此fullPath生成过组件名
  if (componentNameMap.has(fullPath)) {
    return componentNameMap.get(fullPath)!;
  }

  let finalComponentName = baseComponentName;
  const isMulti = isMultiInstanceAllowed(route);

  if (isMulti) {
    // 多实例模式：为每个不同的fullPath分配唯一序号
    if (!multiComponentNumberMap[baseComponentName]) {
      multiComponentNumberMap[baseComponentName] = 0;
    }

    multiComponentNumberMap[baseComponentName]++;
    finalComponentName = `${baseComponentName}_${multiComponentNumberMap[baseComponentName]}`;
  }

  // 缓存映射关系
  componentNameMap.set(fullPath, finalComponentName);
  routeFullPathMap[finalComponentName] = fullPath;

  return finalComponentName;
};

/**
 * 包裹组件，动态设置组件名称
 */
export const wrapperComponent = (
  route: RouteLocationNormalizedLoaded,
  component: Component
) => {
  const finalName = computeComponentName(route, component);
  const fullPath = route.fullPath;

  // 创建包裹组件，动态设置name
  const Wrapper = defineComponent({
    name: finalName,
    setup(_, { attrs }) {
      return () =>
        h(component, {
          ...attrs,
          key: fullPath,
          // 传递路由信息给被包裹的组件
          routeInfo: {
            name: route.name,
            fullPath: route.fullPath,
            params: route.params,
            query: route.query,
            meta: route.meta,
          },
        });
    },
  });

  return Wrapper;
};

/**
 * 页面管理工具
 */
export const page = {
  /**
   * 添加页面到缓存
   */
  add: (route: RouteLocationNormalizedLoaded) => {
    const componentName = computeComponentName(route);
    console.log(
      `[PageUtils] 添加页面到缓存: ${componentName} (${route.fullPath})`
    );
    return componentName;
  },

  /**
   * 从缓存中移除页面
   */
  remove: (route: RouteLocationNormalizedLoaded | string) => {
    let componentName: string;
    let fullPath: string;

    if (typeof route === "string") {
      // 如果传入的是组件名
      componentName = route;
      fullPath = routeFullPathMap[componentName] || "";
    } else {
      // 如果传入的是路由对象
      componentName = computeComponentName(route);
      fullPath = route.fullPath;
    }

    // 清理映射关系
    if (fullPath && componentNameMap.has(fullPath)) {
      componentNameMap.delete(fullPath);
    }

    if (componentName && routeFullPathMap[componentName]) {
      delete routeFullPathMap[componentName];
    }

    console.log(`[PageUtils] 从缓存移除页面: ${componentName} (${fullPath})`);
    return componentName;
  },

  /**
   * 清理所有缓存
   */
  clear: () => {
    componentNameMap.clear();
    Object.keys(routeFullPathMap).forEach((key) => {
      delete routeFullPathMap[key];
    });
    Object.keys(multiComponentNumberMap).forEach((key) => {
      delete multiComponentNumberMap[key];
    });
    console.log("[PageUtils] 清理所有页面缓存");
  },

  /**
   * 获取组件名称映射信息
   */
  getMapping: () => {
    return {
      componentNameMap: new Map(componentNameMap),
      routeFullPathMap: { ...routeFullPathMap },
      multiComponentNumberMap: { ...multiComponentNumberMap },
    };
  },

  /**
   * 检查页面是否在缓存中
   */
  has: (route: RouteLocationNormalizedLoaded | string): boolean => {
    if (typeof route === "string") {
      return componentNameMap.has(route) || !!routeFullPathMap[route];
    }
    return componentNameMap.has(route.fullPath);
  },
};
