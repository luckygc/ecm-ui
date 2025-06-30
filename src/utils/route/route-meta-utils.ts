type MetaObj = {
    meta?: Record<string, any>
}

function isKeyExists<V = any>(
    route: MetaObj,
    key: string
): route is { meta: Record<string, V> } {
    return !!route.meta && key in route.meta;
}

function getValue<V>(route: MetaObj, key: string): V | undefined;
function getValue<V, D extends V = V>(route: MetaObj, key: string, defaultValue: D): V;
function getValue<V, D extends V = V>(route: MetaObj, key: string, defaultValue?: D): V | undefined {
    if (isKeyExists<V>(route, key)) {
        return route.meta[key];
    }

    if (defaultValue !== undefined) {
        return defaultValue;
    }

    return undefined;
}

const getBooleanValue = (route: MetaObj, key: string): boolean => {
    return getValue(route, key, true);
};

export const getIcon = (route: MetaObj): string | undefined => {
    return getValue(route, "icon");
};

export const getTitle = (route: MetaObj): string => {
    return getValue(route, 'title', '未命名页面');
};

export const isKeepAlive = (route: MetaObj): route is { meta: { isKeepAlive: true } } => {
    return getBooleanValue(route, 'isKeepAlive');
};

export const isSideBar = (route: MetaObj): boolean => {
    return getBooleanValue(route, 'isSideBar');
};

export default {
    getTitle,
    getIcon,
    isKeepAlive,
    isSideBar
};
