import { defineStore } from 'pinia'

interface UserState {
  username: string
  avatar: string
  roles: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: '',
    avatar: '',
    roles: [],
  }),
  getters: {
    getUsername: state => state.username,
    getAvatar: state => state.avatar,
    getRoles: state => state.roles,
  },
  actions: {
    setUserInfo(userInfo: Partial<UserState>) {
      if (userInfo.username)
        this.username = userInfo.username
      if (userInfo.avatar)
        this.avatar = userInfo.avatar
      if (userInfo.roles)
        this.roles = userInfo.roles
    },
    resetUserInfo() {
      this.username = ''
      this.avatar = ''
      this.roles = []
    },
  },
})
