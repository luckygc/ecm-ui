export type SuccessApiResult<T> = {
    success: true;
    data: T;
    error: null;
};

export type ErrorApiResult = {
    success: false;
    data: null;
    error: {
        code: string;
        message: string;
        detail: any;
    };
};

export type ApiResult<T> = SuccessApiResult<T> | ErrorApiResult;