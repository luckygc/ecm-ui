import type { Router } from 'vue-router'
import { useRouteStore } from '@/stores/route'

/**
 * 初始化路由助手
 * 设置路由监听和页面管理
 */
export function initRouteHelper(router: Router) {
  const routeStore = useRouteStore()
  
  // 初始化固定页面
  routeStore.initAffixPages()
  
  // 监听路由变化
  router.beforeEach((to, from, next) => {
    // 设置当前路由到 store
    routeStore.setCurrentRoute(to)
    next()
  })
  
  // 路由后置守卫
  router.afterEach((to) => {
    // 确保页面信息已添加到 store
    routeStore.addVisitedPage(to)
  })
}

/**
 * 获取页面标题
 */
export function getPageTitle(route: any): string {
  return route.meta?.title || route.name || '未命名页面'
}

/**
 * 检查路由是否需要缓存
 */
export function shouldCache(route: any): boolean {
  return !route.meta?.noCache
}

/**
 * 检查路由是否为固定页面
 */
export function isAffixRoute(route: any): boolean {
  return !!route.meta?.affix
}
