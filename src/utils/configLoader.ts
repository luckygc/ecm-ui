/**
 * 配置加载工具
 * 用于从JSON文件加载配置
 */
import axios from 'axios'

// 配置接口定义
export interface AppConfig {
  // API基础URL
  apiBaseUrl: string
  // 是否开启调试模式
  debug: boolean
  // 应用名称
  appName: string
  // 请求超时时间（毫秒）
  timeout: number
  // 上传文件大小限制（MB）
  uploadLimit: number
  // 其他可能的配置项
  [key: string]: any
}

// 默认配置
const defaultConfig: AppConfig = {
  apiBaseUrl: '/api',
  debug: false,
  appName: 'Repodar Web',
  timeout: 15000,
  uploadLimit: 10,
}

/**
 * 加载配置
 * @returns Promise<AppConfig>
 */
export async function loadConfig(): Promise<AppConfig> {
  try {
    // 尝试从配置文件加载
    const timestamp = new Date().getTime() // 添加时间戳防止缓存

    // 获取配置文件路径
    const configPath = '/config.json'

    // 加载配置文件
    const response = await axios.get<AppConfig>(`${configPath}?t=${timestamp}`)

    // 合并默认配置和从文件加载的配置
    const config = {
      ...defaultConfig,
      ...response.data,
    }

    return config
  }
  catch (error) {
    console.warn('加载配置文件失败，使用默认配置', error)
    return defaultConfig
  }
}

// 导出一个单例配置对象
let configPromise: Promise<AppConfig> | null = null

export function getConfig(): Promise<AppConfig> {
  if (!configPromise) {
    configPromise = loadConfig()
  }
  return configPromise
}

// 重新加载配置
export function reloadConfig(): Promise<AppConfig> {
  configPromise = loadConfig()
  return configPromise
}
