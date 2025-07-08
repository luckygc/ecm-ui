export interface SuccessApiResult<T> {
  success: true
  data: T
  error: null
}

export interface ErrorApiResult {
  success: false
  data: null
  error: ApiError
}

export type ApiResult<T> = SuccessApiResult<T> | ErrorApiResult

export class ApiError {
  code: string
  message: string
  detail: any

  constructor(error: { code: string, message: string, detail?: any }) {
    this.code = error.code
    this.message = error.message
    this.detail = error.detail
  }
}
