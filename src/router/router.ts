import type { RouteRecordRaw } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { createRouter, createWebHashHistory } from 'vue-router'
import FixedLayout from '~/layout/FixedLayout.vue'
import { getConfig } from '~/utils/config-utils'
import { authRoutes } from './modules/auth-routes'
import { errorRoutes } from './modules/error-routes'
import { metadataRoutes } from './modules/metadata-router'
import { testRoutes } from './modules/test-routes'

// 导出所有路由模块
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: FixedLayout,
    name: 'Index',
    meta: { title: '首页' },
    children: [
      {
        path: '/workbench',
        component: () => import('~/pages/Workbench.vue'),
        name: 'Workbench',
        meta: {
          title: '工作台',
          icon: 'HomeFilled',
          isSideBar: true,
          isKeepAlive: true,
        },
      },

      ...metadataRoutes,
      ...testRoutes,
    ],
  },

  ...authRoutes,
  ...errorRoutes,
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const token = useStorage(getConfig().storageTokenKey, null)

router.beforeEach(async (to, _, next) => {
  if (to.name === 'Login') {
    next()
    return
  }

  if (!token.value) {
    next('/login')
    return
  }

  next()
})
