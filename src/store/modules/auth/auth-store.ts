import type { LoginForm, UserInfo } from '~/api/auth/types'
import { useSessionStorage, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { authApi } from '~/api/auth/auth-api'
import { getCurrentUserDetail } from '~/api/user/user-api'
import { getConfig } from '~/utils/config-utils'

export const useAuthStore = defineStore('auth', () => {
  const userInfo = useSessionStorage<UserInfo>(getConfig().storageUserInfoKey, {} as any)

  const _token = useStorage<string>(getConfig().storageTokenKey, null)
  const _router = useRouter()

  const refreshUserInfo = async () => {
    userInfo.value = await getCurrentUserDetail()
  }

  const login = async (loginForm: LoginForm) => {
    const { token } = await authApi.login(loginForm)
    _token.value = token
    await refreshUserInfo()
    await _router.push('/')
  }

  const logout = async () => {
    await authApi.logout()
    _token.value = null
    userInfo.value = null
    await _router.push('/login')
  }

  refreshUserInfo()

  return {
    userInfo,
    login,
    logout,
  }
})
