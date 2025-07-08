import type { RouteRecordRaw } from 'vue-router'

export const testRoutes: Array<RouteRecordRaw> = [
  {
    path: '/test/formCreate',
    name: 'TestFormCreate',
    component: () => import('~/pages/test/TestFormCreate.vue'),
    meta: {
      icon: 'Setting',
      title: 'FormCreate',
      isSideBar: true,
      isKeepAlive: false,
    },
  },
  {
    path: '/test/formCreateDesigner',
    name: 'TestFormCreateDesigner',
    component: () => import('~/pages/test/TestFormCreateDesigner.vue'),
    meta: {
      icon: 'Setting',
      title: 'FormCreateDesigner',
      isSideBar: true,
      isKeepAlive: true,
    },
  },
  {
    path: '/test/scroll',
    name: 'TestScroll',
    component: () => import('~/pages/test-scroll.vue'),
    meta: {
      icon: 'Setting',
      title: '滚动条测试',
      isSideBar: true,
      isKeepAlive: false,
    },
  },
]
