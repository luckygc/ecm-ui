import type { UserInfo } from '~/api/auth/types'
import { axiosInstance } from '~/utils/request/request'

export function getCurrentUserDetail(): Promise<UserInfo> {
  return axiosInstance.get('/current-user')
}
