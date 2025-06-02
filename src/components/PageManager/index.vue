<script setup lang="ts">
import { ElButton, ElCard, ElCol, ElRow, ElTag, ElIcon } from 'element-plus'
import { Close, Refresh } from '@element-plus/icons-vue'
import { useRouteStore } from '@/stores/route-store'
import { useRouter } from 'vue-router'

const routeStore = useRouteStore()
const router = useRouter()

// 关闭页面
function closePage(page: any) {
  routeStore.delVisitedPage(page)

  // 如果关闭的是当前页面，跳转到最后一个页面
  if (page.fullPath === router.currentRoute.value.fullPath) {
    const lastPage = routeStore.visitedPages[routeStore.visitedPages.length - 1]
    if (lastPage) {
      router.push(lastPage.fullPath || lastPage.path)
    } else {
      router.push('/dashboard')
    }
  }
}

// 关闭其他页面
function closeOtherPages(page: any) {
  routeStore.delOtherVisitedPages(page)
  if (page.fullPath !== router.currentRoute.value.fullPath) {
    router.push(page.fullPath || page.path)
  }
}

// 关闭所有页面
function closeAllPages() {
  routeStore.delAllVisitedPages()
  router.push('/dashboard')
}

// 刷新页面缓存
function refreshPageCache() {
  routeStore.delAllCachedPages()
  // 重新添加当前访问的页面到缓存
  routeStore.visitedPages.forEach(page => {
    if (!page.noCache && page.componentName) {
      routeStore.addCachedPage(page.componentName)
    }
  })
}

// 跳转到页面
function goToPage(page: any) {
  router.push(page.fullPath || page.path)
}
</script>

<template>
  <div class="page-manager">
    <ElCard>
      <template #header>
        <div class="card-header">
          <span>页面管理</span>
          <div class="header-actions">
            <ElButton size="small" @click="refreshPageCache">
              <ElIcon>
                <Refresh />
              </ElIcon>
              刷新缓存
            </ElButton>
            <ElButton size="small" type="danger" @click="closeAllPages">
              关闭所有
            </ElButton>
          </div>
        </div>
      </template>

      <!-- 访问过的页面 -->
      <div class="section">
        <h4>访问过的页面 ({{ routeStore.visitedPages.length }})</h4>
        <div class="page-list">
          <ElTag v-for="page in routeStore.visitedPages" :key="page.fullPath" :type="page.affix ? 'success' : 'info'"
            :closable="!page.affix" class="page-tag" @click="goToPage(page)" @close="closePage(page)">
            <ElIcon v-if="page.icon" class="tag-icon">
              <component :is="page.icon" />
            </ElIcon>
            {{ page.title }}
            <span v-if="page.params && Object.keys(page.params).length > 0" class="page-params">
              ({{Object.entries(page.params).map(([k, v]) => `${k}:${v}`).join(',')}})
            </span>
          </ElTag>
        </div>
      </div>

      <!-- 缓存的页面 -->
      <div class="section">
        <h4>缓存的页面 ({{ routeStore.cachedPages.length }})</h4>
        <div class="cache-list">
          <ElTag v-for="cacheName in routeStore.cachedPages" :key="cacheName" type="warning" class="cache-tag">
            {{ cacheName }}
          </ElTag>
        </div>
      </div>

      <!-- 固定页面 -->
      <div class="section">
        <h4>固定页面 ({{ routeStore.affixPages.length }})</h4>
        <div class="affix-list">
          <ElTag v-for="page in routeStore.affixPages" :key="page.path" type="success" class="affix-tag"
            @click="goToPage(page)">
            <ElIcon v-if="page.icon" class="tag-icon">
              <component :is="page.icon" />
            </ElIcon>
            {{ page.title }}
          </ElTag>
        </div>
      </div>

      <!-- 面包屑预览 -->
      <div class="section">
        <h4>当前面包屑</h4>
        <div class="breadcrumb-preview">
          <span v-for="(breadcrumb, index) in routeStore.breadcrumbs" :key="breadcrumb.path" class="breadcrumb-item">
            <ElIcon v-if="breadcrumb.icon" class="breadcrumb-icon">
              <component :is="breadcrumb.icon" />
            </ElIcon>
            {{ breadcrumb.title }}
            <span v-if="index < routeStore.breadcrumbs.length - 1" class="separator">/</span>
          </span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="section">
        <h4>批量操作</h4>
        <ElRow :gutter="10">
          <ElCol :span="8">
            <ElButton type="warning" size="small" @click="closeOtherPages(routeStore.currentRoute)">
              关闭其他页面
            </ElButton>
          </ElCol>
          <ElCol :span="8">
            <ElButton type="info" size="small" @click="refreshPageCache">
              重建缓存
            </ElButton>
          </ElCol>
          <ElCol :span="8">
            <ElButton type="danger" size="small" @click="closeAllPages">
              关闭所有页面
            </ElButton>
          </ElCol>
        </ElRow>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.page-manager {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.section {
  margin-bottom: 20px;
}

.section h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.page-list,
.cache-list,
.affix-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.page-tag,
.cache-tag,
.affix-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-tag:hover,
.affix-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tag-icon {
  margin-right: 4px;
  font-size: 12px;
}

.page-params {
  font-size: 12px;
  color: #909399;
  margin-left: 4px;
}

.breadcrumb-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
}

.breadcrumb-icon {
  font-size: 12px;
}

.separator {
  margin: 0 4px;
  color: #c0c4cc;
}
</style>
