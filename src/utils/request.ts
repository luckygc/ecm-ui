import type {ApiResult} from "@/types/utils/requests-type";
import {getConfigSync} from "@/utils/config-utils";
import type {AxiosRequestConfig, AxiosResponse} from "axios";
import axios from "axios";
import {ElMessage} from "element-plus";

// 创建axios实例（使用默认配置）
const service = axios.create({
    baseURL: getConfigSync().apiBaseUrl,
    timeout: 60 * 1000,
    withCredentials: false,
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 添加认证token
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
service.interceptors.response.use(
    (response: AxiosResponse<ApiResult<any>>) => {
        const {success, error, data} = response.data as ApiResult<any>;
        const skipErrorHandler = (response.config as any).skipErrorHandler;

        // 检查响应头中的认证token
        const authToken =
            response.headers["x-auth-token"] || response.headers["X-Auth-Token"];
        if (authToken) {
            // 默认存储到localStorage，登录页面会根据rememberMe选项调整存储位置
            localStorage.setItem("token", authToken);
        }

        // 根据自定义错误码判断请求是否成功
        if (!success) {
            // 如果没有跳过错误处理，则显示错误消息
            if (!skipErrorHandler) {
                ElMessage({
                    message: error.message || "请求失败",
                    type: "error",
                    duration: 5 * 1000,
                });
            }

            return Promise.reject(new Error(error.message || "请求失败"));
        } else {
            return data;
        }
    },
    (error) => {
        console.error("Response error:", error);
        const skipErrorHandler = error.config?.skipErrorHandler;

        // 如果没有跳过错误处理，则显示错误消息
        if (!skipErrorHandler) {
            ElMessage({
                message: error.message || "请求失败",
                type: "error",
                duration: 5 * 1000,
            });
        }
        return Promise.reject(error);
    }
);

// 封装GET请求
export function get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
): Promise<T> {
    return service.get(url, {params, ...config});
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
