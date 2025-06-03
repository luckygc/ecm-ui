<script setup lang="ts">
import {Bell, DataAnalysis, Document, Plus, Refresh, Setting, Upload, User} from '@element-plus/icons-vue'
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAppStore} from '@/stores/modules/layout-store.ts'
import {usePageStore} from "@/stores";

const router = useRouter()
const appStore = useAppStore()

const loadTime = ref('')
const refreshCount = ref(0)

const activities = ref([
  {
    content: '系统更新至 v1.2.0 版本',
    timestamp: '2023-05-15',
    type: 'primary' as const,
  },
  {
    content: '新增数据导出功能',
    timestamp: '2023-05-10',
    type: 'success' as const,
  },
  {
    content: '修复用户管理模块的已知问题',
    timestamp: '2023-05-05',
    type: 'info' as const,
  },
  {
    content: '系统将于 2023-06-01 进行维护',
    timestamp: '2023-05-01',
    type: 'warning' as const,
  },
])

function handleRefresh() {
  usePageStore().refreshPage();
}

// 测试多开功能
function openTestPage(id: number) {
  router.push(`/test/${id}`)
}

function openTestWithQuery() {
  const id = Math.floor(Math.random() * 100)
  router.push({
    path: `/test/${id}`,
    query: {
      type: 'dashboardRoutes-test',
      timestamp: Date.now().toString()
    }
  })
}

onMounted(() => {
  loadTime.value = new Date().toLocaleString()
  refreshCount.value = parseInt(localStorage.getItem('dashboardRoutes-refresh-count') || '0') + 1
  localStorage.setItem('dashboardRoutes-refresh-count', refreshCount.value.toString())
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 刷新功能测试区域 -->
    <div class="bg-green-100 p-4 mb-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-bold text-green-800">
          刷新功能测试
        </h2>
        <el-button type="primary" size="small" @click="handleRefresh">
          <el-icon>
            <Refresh />
          </el-icon>
          手动刷新
        </el-button>
      </div>
      <div class="text-green-600 space-y-1">
        <p><strong>页面加载时间:</strong> {{ loadTime }}</p>
        <p><strong>刷新次数:</strong> {{ refreshCount }}</p>
        <p class="text-sm text-green-500">
          点击上方的"手动刷新"按钮或使用Tab栏的刷新功能来测试key刷新机制
        </p>
      </div>
    </div>

    <!-- 多开页面测试区域 -->
    <div class="bg-purple-100 p-4 mb-4 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-bold text-purple-800">
          多开页面测试
        </h2>
      </div>
      <div class="text-purple-600 space-y-2">
        <p class="text-sm">
          测试带参数路由的多开功能，每个不同参数的页面都会独立缓存
        </p>
        <div class="flex flex-wrap gap-2 mt-3">
          <el-button size="small" @click="openTestPage(1)">打开测试页面1</el-button>
          <el-button size="small" @click="openTestPage(2)">打开测试页面2</el-button>
          <el-button size="small" @click="openTestPage(3)">打开测试页面3</el-button>
          <el-button size="small" type="warning" @click="openTestWithQuery">打开带查询参数的页面</el-button>
        </div>
        <p class="text-sm text-purple-500">
          每个页面都会保持独立的状态，支持多开并缓存
        </p>
      </div>
    </div>

    <!-- Tailwind测试区域 -->
    <div class="bg-blue-100 p-4 mb-4 rounded-lg shadow-sm">
      <h2 class="text-xl font-bold text-blue-800 mb-2">
        Tailwind CSS 已成功集成!
      </h2>
      <p class="text-blue-600">
        这是一个使用Tailwind CSS样式的测试区域。
      </p>

      <!-- 自定义工具类测试 -->
      <div class="tw-card mt-4">
        <h3 class="text-lg font-semibold mb-2">
          自定义Tailwind组件
        </h3>
        <div class="flex space-x-2 mt-3">
          <button class="tw-btn-primary">
            主要按钮
          </button>
          <button class="tw-btn-success">
            成功按钮
          </button>
          <button class="tw-btn-warning">
            警告按钮
          </button>
          <button class="tw-btn-danger">
            危险按钮
          </button>
        </div>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <span>欢迎使用 Repodar 系统</span>
            </div>
          </template>
          <div class="welcome-content">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="stat-card">
                  <el-icon class="stat-icon">
                    <User />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      128
                    </div>
                    <div class="stat-label">
                      用户总数
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="stat-card">
                  <el-icon class="stat-icon">
                    <Document />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      256
                    </div>
                    <div class="stat-label">
                      文档总数
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="stat-card">
                  <el-icon class="stat-icon">
                    <Bell />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      32
                    </div>
                    <div class="stat-label">
                      待办事项
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card shadow="hover" class="stat-card">
                  <el-icon class="stat-icon">
                    <DataAnalysis />
                  </el-icon>
                  <div class="stat-info">
                    <div class="stat-value">
                      64
                    </div>
                    <div class="stat-label">
                      今日访问
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统公告</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp"
              :type="activity.type">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" plain>
              <el-icon>
                <Plus />
              </el-icon>新增用户
            </el-button>
            <el-button type="success" plain>
              <el-icon>
                <Upload />
              </el-icon>数据导入
            </el-button>
            <el-button type="warning" plain>
              <el-icon>
                <Setting />
              </el-icon>系统设置
            </el-button>
            <el-button type="info" plain>
              <el-icon>
                <Document />
              </el-icon>查看文档
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content {
  padding: 10px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  font-size: 48px;
  margin-right: 15px;
  color: #409eff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.mt-20 {
  margin-top: 20px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
