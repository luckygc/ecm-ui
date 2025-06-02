<template>
  <div class="page-manager-test">
    <el-card class="mb-4">
      <template #header>
        <h3>统一页面管理系统测试</h3>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <h4>当前页面信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="页面名称">{{ activePage?.name }}</el-descriptions-item>
            <el-descriptions-item label="页面标题">{{ activePage?.title }}</el-descriptions-item>
            <el-descriptions-item label="组件名称">{{ activePage?.componentName }}</el-descriptions-item>
            <el-descriptions-item label="完整路径">{{ activePage?.fullPath }}</el-descriptions-item>
            <el-descriptions-item label="页面Key">{{ activePage?.key }}</el-descriptions-item>
            <el-descriptions-item label="是否缓存">{{ activePage?.keepalive ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="是否已缓存">{{ activePage?.cached ? '是' : '否' }}</el-descriptions-item>
            <el-descriptions-item label="允许多实例">{{ activePage?.allowMultiple ? '是' : '否' }}</el-descriptions-item>
          </el-descriptions>
        </el-col>

        <el-col :span="12">
          <h4>页面统计</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="总页面数">{{ pageStats?.total || 0 }}</el-descriptions-item>
            <el-descriptions-item label="已访问页面">{{ pageStats?.visited || 0 }}</el-descriptions-item>
            <el-descriptions-item label="已缓存页面">{{ pageStats?.cached || 0 }}</el-descriptions-item>
            <el-descriptions-item label="最大缓存数">{{ pageStats?.maxCache || 0 }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <h4>已访问页面列表</h4>
      </template>

      <el-table :data="visitedPages" style="width: 100%">
        <el-table-column prop="title" label="页面标题" width="150" />
        <el-table-column prop="componentName" label="组件名称" width="150" />
        <el-table-column prop="fullPath" label="完整路径" width="200" />
        <el-table-column prop="cached" label="是否缓存" width="100">
          <template #default="{ row }">
            <el-tag :type="row.cached ? 'success' : 'info'">
              {{ row.cached ? '已缓存' : '未缓存' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="affix" label="固定页面" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.affix" type="warning">固定</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastVisitedAt" label="最后访问时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.lastVisitedAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="goToPage(row)">跳转</el-button>
            <el-button size="small" type="danger" @click="removePage(row)" :disabled="row.affix">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="mb-4">
      <template #header>
        <h4>KeepAlive 缓存列表</h4>
      </template>

      <el-table :data="cachedPages" style="width: 100%">
        <el-table-column prop="title" label="页面标题" width="150" />
        <el-table-column prop="componentName" label="组件名称" width="150" />
        <el-table-column prop="fullPath" label="完整路径" width="200" />
        <el-table-column prop="lastVisitedAt" label="最后访问时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.lastVisitedAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" type="warning" @click="removeFromCache(row)">
              移出缓存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <template #header>
        <h4>操作按钮</h4>
      </template>

      <el-space wrap>
        <el-button type="primary" @click="refreshCurrentPage">刷新当前页面</el-button>
        <el-button type="warning" @click="closeOtherPages">关闭其他页面</el-button>
        <el-button type="danger" @click="closeAllPages">关闭所有页面</el-button>
        <el-button type="info" @click="clearAllCache">清空所有缓存</el-button>
        <el-button @click="testMultiInstance">测试多实例页面</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePageStore } from '@/stores/page-store'
import { computePageStats } from '@/utils/page-stats-utils'
import type { PageObject } from '@/types/page-types'
import {
  ElCard,
  ElRow,
  ElCol,
  ElDescriptions,
  ElDescriptionsItem,
  ElTable,
  ElTableColumn,
  ElTag,
  ElButton,
  ElSpace,
  ElMessage
} from 'element-plus'

const router = useRouter()
const pageStore = usePageStore()

// 计算属性
const activePage = computed(() => pageStore.activePage)
const visitedPages = computed(() => Array.from(pageStore.pages.values()).filter(p => p.visited))
const cachedPages = computed(() => Array.from(pageStore.pages.values()).filter(p => p.cached))
const pageStats = computed(() => {
  try {
    return computePageStats(
      pageStore.pages.value,
      pageStore.visitedPages.value,
      pageStore.cachedPages.value,
      pageStore.config.value
    )
  } catch (error) {
    console.error('计算页面统计时出错:', error)
    return {
      total: 0,
      visited: 0,
      cached: 0,
      maxCache: 0,
      cacheUsageRate: 0,
      visitedRate: 0,
    }
  }
})

// 方法
const goToPage = (page: PageObject) => {
  router.push(page.fullPath)
}

const removePage = (page: PageObject) => {
  pageStore.removePageByFullPath(page.fullPath)
  ElMessage.success(`已移除页面: ${page.title}`)
}

const removeFromCache = (page: PageObject) => {
  // 缓存现在是自动管理的，这里只是演示
  ElMessage.info('缓存现在是自动管理的')
}

const refreshCurrentPage = () => {
  pageStore.refreshActivePage()
  ElMessage.success('当前页面已刷新')
}

const closeOtherPages = () => {
  // 关闭其他页面：保留当前页面，删除其他非固定页面
  if (activePage.value) {
    const currentPages = Array.from(pageStore.pages.values()).filter(p => p.visited)
    currentPages.forEach(page => {
      if (page.fullPath !== activePage.value!.fullPath && !page.affix) {
        pageStore.removePageByFullPath(page.fullPath)
      }
    })
    ElMessage.success('已关闭其他页面')
  }
}

const closeAllPages = () => {
  // 关闭所有非固定页面
  const currentPages = Array.from(pageStore.pages.values()).filter(p => p.visited)
  currentPages.forEach(page => {
    if (!page.affix) {
      pageStore.removePageByFullPath(page.fullPath)
    }
  })
  ElMessage.success('已关闭所有页面')
}

const clearAllCache = () => {
  // 缓存现在是自动管理的
  ElMessage.info('缓存现在是自动管理的')
}

const testMultiInstance = () => {
  // 跳转到表单测试页面，测试多实例功能
  router.push('/system/form-test?id=' + Date.now())
}
</script>

<style scoped>
.page-manager-test {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
