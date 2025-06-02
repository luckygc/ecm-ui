<script setup lang="ts" name="PageManager">
import { ElButton, ElCard, ElCol, ElRow, ElTag, ElIcon } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { usePageStore } from '@/stores/page-store'
import { useRouter } from 'vue-router'

const pageStore = usePageStore()
const router = useRouter()



// 关闭页面
function closePage(page: any) {
  pageStore.removePageByFullPath(page.fullPath)

  // 如果关闭的是当前页面，跳转到最后一个页面
  if (page.fullPath === router.currentRoute.value.fullPath) {
    const allPages = Array.from(pageStore.pages.values())
    const lastPage = allPages[allPages.length - 1]
    if (lastPage) {
      router.push(lastPage.fullPath || lastPage.path)
    } else {
      router.push('/dashboard')
    }
  }
}

// 关闭其他页面
function closeOtherPages(page: any) {
  if (page) {
    // 关闭其他页面：保留指定页面
    const allPages = Array.from(pageStore.pages.values())
    allPages.forEach(p => {
      if (p.fullPath !== page.fullPath) {
        pageStore.removePageByFullPath(p.fullPath)
      }
    })
    if (page.fullPath !== router.currentRoute.value.fullPath) {
      router.push(page.fullPath || page.path)
    }
  }
}

// 关闭所有页面
function closeAllPages() {
  // 关闭所有页面
  const allPages = Array.from(pageStore.pages.values())
  allPages.forEach(page => {
    pageStore.removePageByFullPath(page.fullPath)
  })
  router.push('/dashboard')
}

// 刷新页面缓存
function refreshPageCache() {
  // 缓存现在是自动管理的，这里刷新当前页面
  pageStore.refreshActivePage()
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

      <!-- 所有页面 -->
      <div class="section">
        <h4>所有页面 ({{ Array.from(pageStore.pages.values()).length }})</h4>
        <div class="page-list">
          <ElTag v-for="page in Array.from(pageStore.pages.values())" :key="page.fullPath" type="info" closable
            class="page-tag" @click="goToPage(page)" @close="closePage(page)">
            <ElIcon v-if="page.icon" class="tag-icon">
              <component :is="page.icon" />
            </ElIcon>
            {{ page.title }}
          </ElTag>
        </div>
      </div>

      <!-- 缓存的页面 -->
      <div class="section">
        <h4>缓存的页面 ({{Array.from(pageStore.pages.values()).filter(p => p.cached).length}})</h4>
        <div class="cache-list">
          <ElTag v-for="page in Array.from(pageStore.pages.values()).filter(p => p.cached)" :key="page.name"
            type="warning" class="cache-tag">
            {{ page.name }}
          </ElTag>
        </div>
      </div>

      <!-- 页面统计 -->
      <div class="section">
        <h4>页面统计</h4>
        <ElRow :gutter="10">
          <ElCol :span="12">
            <div class="stat-item">
              <div class="stat-number">{{ Array.from(pageStore.pages.values()).length }}</div>
              <div class="stat-label">总页面数</div>
            </div>
          </ElCol>
          <ElCol :span="12">
            <div class="stat-item">
              <div class="stat-number">{{Array.from(pageStore.pages.values()).filter(p => p.cached).length}}</div>
              <div class="stat-label">已缓存</div>
            </div>
          </ElCol>
        </ElRow>
      </div>

      <!-- 操作按钮 -->
      <div class="section">
        <h4>批量操作</h4>
        <ElRow :gutter="10">
          <ElCol :span="8">
            <ElButton type="warning" size="small" @click="closeOtherPages(pageStore.activePage)">
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
  margin-bottom: 10px;
  color: #333;
}

.page-list,
.cache-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.page-tag,
.cache-tag {
  cursor: pointer;
  margin: 0;
}

.page-tag:hover {
  opacity: 0.8;
}

.tag-icon {
  margin-right: 4px;
}

.page-params {
  font-size: 12px;
  opacity: 0.7;
  margin-left: 4px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>
