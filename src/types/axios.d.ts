import 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        /**
         * 跳过默认的错误处理，也就是弹出轻提示
         */
        skipDefaultErrorHandle?: boolean;
    }

    export interface AxiosInstance {
        request<T = any,  D = any>(config: AxiosRequestConfig<D>): Promise<T>;
        get<T = any,  D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
        delete<T = any,  D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
        head<T = any,  D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
        options<T = any,  D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
        post<T = any,  D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
        put<T = any,  D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
        patch<T = any,  D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
        postForm<T = any,  D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
        putForm<T = any,  D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
        patchForm<T = any,  D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
    }
}
