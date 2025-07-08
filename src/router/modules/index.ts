import type { RouteRecordRaw } from 'vue-router'
import FixedLayout from '~/layout/FixedLayout.vue'
import { testRoutes } from '~/router/modules/test-routes'
import { authRoutes } from './auth-routes'
import { errorRoutes } from './error-routes'
import { metadataRoutes } from './metadata-router'

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
