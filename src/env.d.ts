/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * API基础URL
   */
  readonly VITE_API_BASE_URL: string
  /**
   * 是否开启调试模式
   */
  readonly VITE_APP_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
