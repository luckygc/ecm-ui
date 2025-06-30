// 配置接口定义
export interface AppConfig {
    // API基础URL
    apiBaseUrl: string;
    // 应用名称
    appName: string;
    // token名称
    tokenName: string;
    // 最大页面数量
    maxPageCount: number
}

// 默认配置
const defaultConfig: AppConfig = {
    apiBaseUrl: "http://localhost:8080",
    appName: "管理系统demo",
    tokenName: "repodar:token",
    maxPageCount: 10
};

/**
 * 同步加载配置（使用 XMLHttpRequest）
 * @returns AppConfig
 */
export function loadConfigSync(): AppConfig {
    const xhr = new XMLHttpRequest();

    const timestamp = new Date().getTime();
    const configPath = `/config.json?t=${timestamp}`;

    xhr.open("GET", configPath, false); // false 表示同步请求
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    if (xhr.status === 200) {
        const configData = JSON.parse(xhr.responseText) as Partial<AppConfig>;

        const config = {
            ...defaultConfig,
            ...configData,
        };

        console.debug("同步加载配置成功:", config);
        return config;
    } else {
        throw new Error(`加载配置文件失败，HTTP状态码: ${xhr.status}`);
    }
}

// 同步版本的配置管理
let cachedConfig: AppConfig | null = null;

/**
 * 获取配置（同步版本）
 * 首次调用时会同步加载配置，后续调用返回缓存的配置
 * @param forceReload 是否强制重新加载配置
 * @returns AppConfig
 */
export function getConfig(forceReload = false): AppConfig {
    if (!cachedConfig || forceReload) {
        cachedConfig = loadConfigSync();
    }
    return cachedConfig;
}
