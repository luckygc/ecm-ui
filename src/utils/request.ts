import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { ElMessage } from "element-plus";
import { getConfigSync } from "@/utils/config-utils";
import type { ApiResult } from "@/types/utils/requests-type";

// 创建axios实例（使用默认配置）
const service = axios.create({
  baseURL: getConfigSync().apiBaseUrl,
  timeout: 60 * 1000,
  withCredentials: true,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // TODO 登录认证
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResult<any>>) => {
    const { success, error, data } = response.data as ApiResult<any>;

    // 根据自定义错误码判断请求是否成功
    if (!success) {
      // 处理错误
      ElMessage({
        message: error.message || "请求失败",
        type: "error",
        duration: 5 * 1000,
      });

      return Promise.reject(new Error(error.message || "请求失败"));
    } else {
      return data;
    }
  },
  (error) => {
    console.error("Response error:", error);
    ElMessage({
      message: error.message || "请求失败",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

// 封装GET请求
export function get<T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return service.get(url, { params, ...config });
}

// 封装POST请求
export function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return service.post(url, data, config);
}

// 封装PUT请求
export function put<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return service.put(url, data, config);
}

// 封装DELETE请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, config);
}

export default service;
