// 配置接口定义
export interface AppConfig {
  // API基础URL
  apiBaseUrl: string;
  // 应用名称
  appName: string;
  // 其他可能的配置项
  [key: string]: any;
}

// 默认配置
const defaultConfig: AppConfig = {
  apiBaseUrl: "http://localhost:8080",
  appName: "Repodar Web",
};

/**
 * 同步加载配置（使用 XMLHttpRequest）
 * @returns AppConfig
 */
export function loadConfigSync(): AppConfig {
  try {
    const xhr = new XMLHttpRequest();

    const timestamp = new Date().getTime();
    const configPath = `/config.json?t=${timestamp}`;

    // 配置同步请求
    xhr.open("GET", configPath, false); // false 表示同步请求
    xhr.setRequestHeader("Content-Type", "application/json");

    // 发送请求
    xhr.send();

    // 检查请求状态
    if (xhr.status === 200) {
      try {
        // 解析 JSON 响应
        const configData = JSON.parse(xhr.responseText) as Partial<AppConfig>;

        // 合并默认配置和从文件加载的配置
        const config = {
          ...defaultConfig,
          ...configData,
        };

        console.log("同步加载配置成功:", config);
        return config;
      } catch (parseError) {
        console.warn("解析配置文件失败，使用默认配置", parseError);
        return defaultConfig;
      }
    } else {
      console.warn(`加载配置文件失败，HTTP状态码: ${xhr.status}，使用默认配置`);
      return defaultConfig;
    }
  } catch (error) {
    console.warn("同步加载配置文件失败，使用默认配置", error);
    return defaultConfig;
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
export function getConfigSync(forceReload = false): AppConfig {
  if (!cachedConfig || forceReload) {
    cachedConfig = loadConfigSync();
  }
  return cachedConfig;
}

/**
 * 重新加载配置（同步版本）
 * @returns AppConfig
 */
export function reloadConfigSync(): AppConfig {
  cachedConfig = loadConfigSync();
  return cachedConfig;
}
