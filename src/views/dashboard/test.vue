<template>
  <div class="test-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>测试页面 - ID: {{ routeId }}</span>
          <div class="header-actions">
            <el-button type="primary" @click="openNewTest">
              打开新测试页面
            </el-button>
            <el-button @click="refreshData">
              刷新数据
            </el-button>
          </div>
        </div>
      </template>

      <div class="content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="never">
              <h3>路由信息</h3>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="路由ID">{{ routeId }}</el-descriptions-item>
                <el-descriptions-item label="完整路径">{{ route.fullPath }}</el-descriptions-item>
                <el-descriptions-item label="路径">{{ route.path }}</el-descriptions-item>
                <el-descriptions-item label="查询参数">{{ JSON.stringify(route.query) }}</el-descriptions-item>
                <el-descriptions-item label="路径参数">{{ JSON.stringify(route.params) }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card shadow="never">
              <h3>页面状态</h3>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="创建时间">{{ createTime }}</el-descriptions-item>
                <el-descriptions-item label="刷新次数">{{ refreshCount }}</el-descriptions-item>
                <el-descriptions-item label="随机数据">{{ randomData }}</el-descriptions-item>
                <el-descriptions-item label="组件实例ID">{{ componentInstanceId }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card shadow="never">
              <h3>操作区域</h3>
              <el-space wrap>
                <el-button @click="openTest(1)">打开测试页面1</el-button>
                <el-button @click="openTest(2)">打开测试页面2</el-button>
                <el-button @click="openTest(3)">打开测试页面3</el-button>
                <el-button @click="openTestWithQuery">打开带查询参数的页面</el-button>
                <el-button type="warning" @click="updateData">更新页面数据</el-button>
              </el-space>
            </el-card>
          </el-col>
        </el-row>

        <el-row style="margin-top: 20px;">
          <el-col :span="24">
            <el-card shadow="never">
              <h3>数据输入</h3>
              <el-form :model="formData" label-width="120px">
                <el-form-item label="文本数据">
                  <el-input v-model="formData.text" placeholder="输入一些文本数据" />
                </el-form-item>
                <el-form-item label="数字数据">
                  <el-input-number v-model="formData.number" :min="0" :max="1000" />
                </el-form-item>
                <el-form-item label="选择数据">
                  <el-select v-model="formData.select" placeholder="请选择">
                    <el-option label="选项1" value="option1" />
                    <el-option label="选项2" value="option2" />
                    <el-option label="选项3" value="option3" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveData">保存数据</el-button>
                  <el-button @click="resetData">重置数据</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 路由ID
const routeId = computed(() => route.params.id as string)

// 页面状态
const createTime = ref('')
const refreshCount = ref(0)
const randomData = ref('')
const componentInstanceId = ref('')

// 表单数据
const formData = ref({
  text: '',
  number: 0,
  select: ''
})

// 初始化页面数据
function initPageData() {
  createTime.value = new Date().toLocaleString()
  randomData.value = Math.random().toString(36).substring(7)
  componentInstanceId.value = `test_${routeId.value}_${Date.now()}`
  
  // 根据路由ID设置不同的默认数据
  formData.value = {
    text: `测试页面 ${routeId.value} 的数据`,
    number: parseInt(routeId.value) * 10,
    select: `option${(parseInt(routeId.value) % 3) + 1}`
  }
}

// 刷新数据
function refreshData() {
  refreshCount.value++
  randomData.value = Math.random().toString(36).substring(7)
  ElMessage.success('数据已刷新')
}

// 更新数据
function updateData() {
  randomData.value = Math.random().toString(36).substring(7)
  ElMessage.success('数据已更新')
}

// 打开新的测试页面
function openNewTest() {
  const newId = Math.floor(Math.random() * 1000)
  router.push(`/test/${newId}`)
}

// 打开指定ID的测试页面
function openTest(id: number) {
  router.push(`/test/${id}`)
}

// 打开带查询参数的页面
function openTestWithQuery() {
  const id = Math.floor(Math.random() * 100)
  router.push({
    path: `/test/${id}`,
    query: {
      type: 'query-test',
      timestamp: Date.now().toString(),
      source: 'button-click'
    }
  })
}

// 保存数据
function saveData() {
  ElMessage.success('数据已保存')
}

// 重置数据
function resetData() {
  formData.value = {
    text: '',
    number: 0,
    select: ''
  }
  ElMessage.info('数据已重置')
}

// 组件挂载时初始化
onMounted(() => {
  initPageData()
})

// 监听路由变化，重新初始化数据
// 注意：由于使用了keepAlive，这个组件实例会被复用
// 但是由于我们使用了唯一的组件名，每个参数实例都会有独立的组件实例
</script>

<style scoped>
.test-page {
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

.content {
  min-height: 400px;
}

.el-descriptions {
  margin-top: 10px;
}
</style>
