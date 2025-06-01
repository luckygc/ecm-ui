import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import defaultConfig, { getAppConfig } from '@/config'

// 创建axios实例（使用默认配置）
const service = axios.create({
  baseURL: defaultConfig.apiBaseUrl,
  timeout: defaultConfig.timeout,
})

// 异步初始化配置
async function initializeAxios() {
  try {
    const config = await getAppConfig()

    // 更新axios配置
    service.defaults.baseURL = config.apiBaseUrl
    service.defaults.timeout = config.timeout

    if (config.debug) {
      console.log('Axios配置已更新:', {
        baseURL: service.defaults.baseURL,
        timeout: service.defaults.timeout,
      })
    }
  }
  catch (error) {
    console.error('初始化Axios配置失败:', error)
  }
}

// 执行初始化
initializeAxios()

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 根据自定义错误码判断请求是否成功
    if (res.code && res.code !== 200) {
      // 处理错误
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000,
      })

      // 处理特定错误，例如token过期
      if (res.code === 401) {
        // 重定向到登录页或刷新token
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }
    else {
      return res
    }
  },
  (error) => {
    console.error('Response error:', error)
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

// 封装GET请求
export function get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config })
}

// 封装POST请求
export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.post(url, data, config)
}

// 封装PUT请求
export function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put(url, data, config)
}

// 封装DELETE请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, config)
}

export default service
