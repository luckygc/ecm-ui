import type { Component } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { defineStore } from 'pinia'
import { computed, defineComponent, h, markRaw, nextTick, shallowRef, triggerRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import routeMetaUtils from '~/utils/route/route-meta-utils'

type Page = Pick<RouteLocationNormalizedLoadedGeneric, 'fullPath' | 'meta'> & {
  component: Component
  componentName: string
  componentKey: string
}

function buildComponentKey(fullPath: string) {
  return `${fullPath}_${Date.now()}`
}

function wrapComponent(component: Component, componentName: string): Component {
  return markRaw(
    defineComponent({
      name: componentName,
      setup(props, { attrs, slots }) {
        return () => h(component, { ...attrs, ...props }, slots)
      },
    }),
  )
}

function storeSetup() {
  // 页面
  const _pageMap = shallowRef(new Map<string, Page>())
  // 页面过渡
  const pageTransitionDuration = computed(() => {
    return {
      enter: 100,
      leave: _pageMap.value.size === 0 ? 0 : 100,
    }
  })

  const pages = computed(() => {
    return Array.from(_pageMap.value.values())
  })
  const keepAliveInclude = computed(() => {
    return Array.from(_pageMap.value.values())
      .filter(routeMetaUtils.isKeepAlive)
      .map(page => page.componentName)
  })

  // 路由
  const _router = useRouter()
  const _currentRoute = useRoute()

  const _createPage = (
    originalComponent: Component,
    route: RouteLocationNormalizedLoadedGeneric,
  ): Page => {
    return {
      component: wrapComponent(originalComponent, route.fullPath),
      componentKey: buildComponentKey(route.fullPath),
      componentName: route.fullPath,
      fullPath: route.fullPath,
      meta: route.meta,
    }
  }

  const createOrGetPage = (
    originalComponent: Component,
    route: RouteLocationNormalizedLoadedGeneric,
  ): Page => {
    if (_pageMap.value.has(route.fullPath)) {
      return _pageMap.value.get(route.fullPath)!
    }

    const newPage = _createPage(originalComponent, route)
    _pageMap.value.set(newPage.fullPath, newPage)
    triggerRef(_pageMap)
    return newPage
  }

  const _refreshPage = async (waitRefreshPage: Page) => {
    waitRefreshPage.componentKey = buildComponentKey(waitRefreshPage.fullPath)
    triggerRef(_pageMap)
    await nextTick()
  }

  const refreshPage = async (fullPath: string) => {
    const waitRefreshPage = _pageMap.value.get(fullPath)
    if (!waitRefreshPage) {
      return
    }

    if (!routeMetaUtils.isKeepAlive(waitRefreshPage)) {
      return await _refreshPage(waitRefreshPage)
    }

    // 删除缓存,重渲染,加回缓存
    (waitRefreshPage.meta as any).isKeepAlive = false
    triggerRef(_pageMap)
    await _refreshPage(waitRefreshPage)
    waitRefreshPage.meta.isKeepAlive = true
    triggerRef(_pageMap)
  }

  const refreshCurrentPage = async () => {
    return refreshPage(_currentRoute.fullPath)
  }

  const _trySwitchOtherPage = async () => {
    if (_pageMap.value.has(_currentRoute.fullPath)) {
      return
    }

    const latPageFullPath = Array.from(_pageMap.value.keys()).pop()
    if (latPageFullPath) {
      return await _router.push(latPageFullPath)
    }

    return await _router.push('/')
  }

  const closePage = async (fullPath: string) => {
    if (!_pageMap.value.has(fullPath)) {
      throw new Error(`页面${fullPath}不存在`)
    }

    _pageMap.value.delete(fullPath)
    await _trySwitchOtherPage()
    triggerRef(_pageMap)
  }

  const closeCurrentPage = async () => {
    return closePage(_currentRoute.fullPath)
  }

  const closeOtherPage = async () => {
    if (_pageMap.value.size <= 1) {
      return
    }

    const currentFullPath = _currentRoute.fullPath
    const currentPage = _pageMap.value.get(currentFullPath)
    if (!currentPage) {
      throw new Error(`当前页面${currentFullPath}不存在`)
    }

    for (const fullPath of _pageMap.value.keys()) {
      if (fullPath !== currentFullPath) {
        _pageMap.value.delete(fullPath)
      }
    }

    await _trySwitchOtherPage()
    triggerRef(_pageMap)
  }

  const closeAllPage = async () => {
    _pageMap.value.clear()
    await _trySwitchOtherPage()
    triggerRef(_pageMap)
  }

  const reset = async () => {
    _pageMap.value = new Map()
    triggerRef(_pageMap)
  }

  return {
    pages,
    keepAliveInclude,
    pageTransitionDuration,
    _pageMap,

    createOrGetPage,
    refreshCurrentPage,
    closeCurrentPage,
    closePage,
    closeOtherPage,
    closeAllPage,

    reset,
  }
}

export const usePageStore = defineStore('page', storeSetup)
