import type {ApiResult} from "./types.ts";
import {getConfig} from "@/utils/config-utils";
import type {AxiosRequestConfig, AxiosResponse} from "axios";
import axios from "axios";
import {ElMessage} from "element-plus";
import {useStorage} from "@vueuse/core";

const authToken = useStorage<string>(getConfig().tokenName, null);

// 创建axios实例（使用默认配置）
export const axiosInstance = axios.create({
    baseURL: getConfig().apiBaseUrl,
    timeout: 60 * 1000,
    withCredentials: false,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        if (authToken.value) {
            config.headers['X-Auth-Token'] = authToken.value;
        }

        return config;
    },
    (error) => {
        // 对请求错误做些什么
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResult<any>>) => {
        const {success, error, data} = response.data as ApiResult<any>;
        const skipErrorHandler = (response.config as any).skipErrorHandler;

        if (!success) {
            // 如果没有跳过错误处理，则显示错误消息
            if (!skipErrorHandler) {
                ElMessage({
                    message: error.message || "请求失败",
                    type: "error",
                    duration: 5 * 1000,
                });
            }

            return Promise.reject(response);
        } else {
            return data;
        }
    },
    async (error) => {
        console.error("Response error:", error);
        const skipErrorHandler = error.config?.skipErrorHandler;

        // 处理401未授权错误
        if (error.response?.status === 401) {
            authToken.value = null;

            ElMessage({
                message: "未登录，请登录",
                type: "warning",
                duration: 3 * 1000,
            });

            window.location.href = '/#/login'

            throw error;
        }

        // 如果没有跳过错误处理，则显示错误消息
        if (!skipErrorHandler) {
            ElMessage({
                message: error.message || "请求失败",
                type: "error",
                duration: 5 * 1000,
            });
        }

        throw error;
    }
);

// 封装GET请求
export function get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
): Promise<T> {
    return axiosInstance.get(url, {params, ...config});
}

// 封装POST请求
export function post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> {
    return axiosInstance.post(url, data, config);
}

// 封装PUT请求
export function put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> {
    return axiosInstance.put(url, data, config);
}

// 封装DELETE请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete(url, config);
}
