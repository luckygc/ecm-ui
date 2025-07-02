import {ApiError, type ApiResult} from "./types.ts";
import {getConfig} from "@/utils/config-utils";
import axios, {type AxiosResponse, type InternalAxiosRequestConfig} from "axios";
import {ElMessage} from "element-plus";
import {useStorage} from "@vueuse/core";

const authToken = useStorage<string>(getConfig().storageTokenKey, null);

export const axiosInstance = axios.create({
    baseURL: getConfig().apiBaseUrl,
    timeout: getConfig().requestTimeout,
    withCredentials: false,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        config.headers.set(getConfig().requestHeaderTokenKey, authToken.value, true);
        return config;
    }
);

const defaultErrorHandle = (config: { skipDefaultErrorHandle?: boolean }, message: string) => {
    const {skipDefaultErrorHandle} = config;
    if (!skipDefaultErrorHandle) {
        ElMessage.error(message);
    }
}

const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
        if (error.code) {
            // 网络错误 / 超时 / 取消
            console.error('[Network Error]', error.code, error.message);

            let msg;
            switch (error.code) {
                case 'ECONNABORTED':
                    msg = '请求超时，请稍后重试';
                    break;
                case 'ERR_NETWORK':
                    msg = '与服务器断开连接';
                    break;
                case 'ERR_CANCELED':
                    msg = '请求已取消';
                    break;
                default:
                    msg = `网络错误 (${error.code})`;
            }

            defaultErrorHandle(error.config || {}, msg);
            throw new ApiError({code: error.code, message: msg});
        } else if (error.response) {
            // HTTP 错误
            const status = error.response.status;
            const apiError = error.response.data.error as ApiError;

            console.error('[HTTP Error]', status, apiError);

            let msg = apiError.message || `请求错误 (${status})`;
            if (status === 401) {
                authToken.value = null;
                window.location.href = '/#/login'
            }

            defaultErrorHandle(error.config || {}, msg);
            throw new ApiError(apiError);
        }
    }

    // 非 Axios 错误
    console.error('[Unknown Error]', error);
    defaultErrorHandle({}, '未知错误');
    throw new ApiError({code: 'unknown', message: '未知错误'});
}

// 响应拦截器
axiosInstance.interceptors.response.use((response: AxiosResponse) => {
        const {success, error, data} = response.data as ApiResult<any>;

        if (!success) {
            defaultErrorHandle(response.config, error.message ?? '未知错误')
            throw new ApiError(error)
        } else {
            return data;
        }
    },
    handleError
);
