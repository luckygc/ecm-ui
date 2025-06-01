/**
 * 全局配置文件
 * 集中管理所有配置项
 *
 * 这个文件导出一个异步函数，用于获取配置
 * 配置从JSON文件加载，支持在部署时修改
 */
import type { AppConfig } from '@/utils/configLoader'
import { getConfig, reloadConfig } from '@/utils/configLoader'

// 应用版本（这个值通常不会在部署配置中修改）
const APP_VERSION = '1.0.0'

/**
 * 获取配置
 * @returns Promise<AppConfig & { appVersion: string }>
 */
export async function getAppConfig(): Promise<AppConfig & { appVersion: string }> {
  const config = await getConfig()
  return {
    ...config,
    appVersion: APP_VERSION,
  }
}

/**
 * 重新加载配置
 * @returns Promise<AppConfig & { appVersion: string }>
 */
export async function reloadAppConfig(): Promise<AppConfig & { appVersion: string }> {
  const config = await reloadConfig()
  return {
    ...config,
    appVersion: APP_VERSION,
  }
}

// 为了兼容现有代码，提供一个默认导出
// 注意：这个对象只包含默认值，实际使用时应该使用 getAppConfig() 获取最新配置
const defaultConfig: AppConfig & { appVersion: string } = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  debug: import.meta.env.VITE_APP_DEBUG === 'true',
  appName: 'Repodar Web',
  appVersion: APP_VERSION,
  timeout: 15000,
  uploadLimit: 10,
}

export default defaultConfig

// 导出类型定义，方便其他文件使用
export type { AppConfig } from '@/utils/configLoader'
