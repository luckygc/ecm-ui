<script setup lang="ts" name="TestDetail">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 页面状态
const pageId = ref(route.params.id)
const loadTime = ref('')
const inputValue = ref('')
const counter = ref(0)
const notes = ref('')

// 模拟数据加载
const isLoading = ref(false)
const pageData = ref({
  title: `测试页面 ${pageId.value}`,
  description: `这是ID为 ${pageId.value} 的测试页面`,
  status: 'active'
})

// 增加计数器
function increment() {
  counter.value++
}

// 减少计数器
function decrement() {
  counter.value--
}

// 重置计数器
function resetCounter() {
  counter.value = 0
}

// 模拟保存数据
function saveData() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    ElMessage.success('数据保存成功！')
  }, 1000)
}

// 模拟加载数据
function loadData() {
  isLoading.value = true
  setTimeout(() => {
    pageData.value = {
      title: `测试页面 ${pageId.value} (已刷新)`,
      description: `这是ID为 ${pageId.value} 的测试页面，数据已重新加载`,
      status: Math.random() > 0.5 ? 'active' : 'inactive'
    }
    isLoading.value = false
  }, 800)
}

onMounted(() => {
  loadTime.value = new Date().toLocaleString()
  console.log(`测试页面 ${pageId.value} 已挂载`)
})
</script>

<template>
  <div class="test-detail-container">
    <!-- 页面信息卡片 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>{{ pageData.title }}</span>
          <el-tag :type="pageData.status === 'active' ? 'success' : 'warning'">
            {{ pageData.status === 'active' ? '活跃' : '非活跃' }}
          </el-tag>
        </div>
      </template>
      
      <div class="page-info">
        <p><strong>页面ID:</strong> {{ pageId }}</p>
        <p><strong>完整路径:</strong> {{ route.fullPath }}</p>
        <p><strong>加载时间:</strong> {{ loadTime }}</p>
        <p><strong>描述:</strong> {{ pageData.description }}</p>
        
        <!-- 查询参数显示 -->
        <div v-if="Object.keys(route.query).length > 0" class="mt-3">
          <strong>查询参数:</strong>
          <el-tag v-for="(value, key) in route.query" :key="key" class="ml-2">
            {{ key }}: {{ value }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 状态测试卡片 -->
    <el-card class="mb-4">
      <template #header>
        <span>状态测试 - 验证KeepAlive缓存</span>
      </template>
      
      <div class="state-test">
        <div class="mb-4">
          <label class="block mb-2 font-medium">输入框测试（测试状态保持）:</label>
          <el-input 
            v-model="inputValue" 
            placeholder="在这里输入内容，切换页面后再回来查看是否保留"
            class="mb-2"
          />
          <p class="text-sm text-gray-600">
            当前输入: {{ inputValue || '(空)' }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">计数器测试:</label>
          <div class="flex items-center gap-3 mb-2">
            <el-button @click="decrement" :icon="'Minus'">-</el-button>
            <span class="text-2xl font-bold text-blue-600 min-w-[60px] text-center">
              {{ counter }}
            </span>
            <el-button @click="increment" :icon="'Plus'">+</el-button>
            <el-button @click="resetCounter" type="warning" size="small">重置</el-button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">备注区域:</label>
          <el-input
            v-model="notes"
            type="textarea"
            :rows="3"
            placeholder="在这里记录一些备注信息..."
          />
        </div>
      </div>
    </el-card>

    <!-- 操作按钮卡片 -->
    <el-card>
      <template #header>
        <span>操作测试</span>
      </template>
      
      <div class="actions">
        <el-button 
          type="primary" 
          @click="saveData" 
          :loading="isLoading"
          :icon="'Check'"
        >
          保存数据
        </el-button>
        
        <el-button 
          type="success" 
          @click="loadData" 
          :loading="isLoading"
          :icon="'Refresh'"
        >
          重新加载
        </el-button>
        
        <el-button 
          type="info" 
          @click="$router.go(-1)"
          :icon="'Back'"
        >
          返回上页
        </el-button>
      </div>
    </el-card>

    <!-- 说明信息 -->
    <el-alert
      class="mt-4"
      title="KeepAlive 测试说明"
      type="info"
      :closable="false"
    >
      <template #default>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>每个不同ID的页面都会独立缓存</li>
          <li>在输入框中输入内容，切换到其他页面，再回来查看内容是否保留</li>
          <li>计数器和备注也会保持状态</li>
          <li>使用fullPath作为组件名称，支持带参数和查询参数的多开</li>
          <li>关闭页签时会自动从KeepAlive缓存中移除</li>
        </ul>
      </template>
    </el-alert>
  </div>
</template>

<style scoped>
.test-detail-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-info p {
  margin: 8px 0;
  color: #606266;
}

.state-test label {
  color: #303133;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
