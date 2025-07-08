import type { UserInfo } from '~/api/auth/types'
import { axiosInstance } from '~/utils/request/request'

export const getCurrentUserDetail = (): Promise<UserInfo> => {
  return axiosInstance.get('/current-user')
}
