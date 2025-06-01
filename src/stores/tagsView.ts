import type { RouteLocationNormalized } from 'vue-router'
import { defineStore } from 'pinia'

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
  icon?: string
}

interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: string[] // 缓存的组件名称
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: [],
  }),

  getters: {
    getVisitedViews: state => state.visitedViews,
    getCachedViews: state => state.cachedViews,
  },

  actions: {
    // 添加访问视图
    addVisitedView(view: TagView) {
      if (this.visitedViews.some(v => v.path === view.path))
        return

      // 确保视图有标题
      const title = view.meta?.title || '未命名页面'
      const icon = view.meta?.icon

      this.visitedViews.push(
        Object.assign({}, view, {
          title,
          icon,
        }),
      )
    },

    // 添加缓存视图
    addCachedView(view: TagView) {
      if (!view.name || this.cachedViews.includes(view.name as string))
        return

      if (view.meta?.keepAlive) {
        this.cachedViews.push(view.name as string)
      }
    },

    // 添加视图（同时添加访问和缓存）
    addView(view: TagView) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },

    // 删除访问视图
    delVisitedView(view: TagView) {
      const index = this.visitedViews.findIndex(v => v.path === view.path)
      if (index !== -1) {
        this.visitedViews.splice(index, 1)
      }
    },

    // 删除缓存视图
    delCachedView(view: TagView) {
      if (!view.name)
        return

      const index = this.cachedViews.indexOf(view.name as string)
      if (index !== -1) {
        this.cachedViews.splice(index, 1)
      }
    },

    // 删除视图（同时删除访问和缓存）
    delView(view: TagView) {
      this.delVisitedView(view)
      this.delCachedView(view)
    },

    // 删除其他视图
    delOtherViews(view: TagView) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v.path === view.path || v.meta?.affix
      })

      const cachedViews = this.cachedViews.filter((name) => {
        return name === view.name
      })
      this.cachedViews = cachedViews
    },

    // 删除所有视图
    delAllViews() {
      // 保留固定的标签
      this.visitedViews = this.visitedViews.filter(tag => tag.meta?.affix)
      this.cachedViews = []
    },

    // 更新访问视图
    updateVisitedView(view: TagView) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
  },
})
