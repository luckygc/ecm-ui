<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElCard, ElButton, ElMessage, ElTag, ElInput, ElDivider } from 'element-plus'

// 获取路由信息（通过props传递）
const props = defineProps<{
  routeInfo?: {
    routeName: string
    fullPath: string
    wrapperName: string
    instanceKey: string
    allowMultiple: boolean
  }
}>()

// 路由信息（带默认值）
const routeInfo = props.routeInfo || {
  routeName: 'SingleInstanceTest',
  fullPath: '/system/single-instance-test',
  wrapperName: 'SingleInstanceTest',
  instanceKey: 'single-instance-test-key',
  allowMultiple: false
}

// 组件状态
const instanceId = ref('')
const mountTime = ref('')
const updateCount = ref(0)
const sharedData = ref('')

// 定时器
let timer: NodeJS.Timeout | null = null

// 生成实例ID
const generateInstanceId = () => {
  return `single-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}

// 更新计数器
const incrementCounter = () => {
  updateCount.value++
  ElMessage.success(`计数器更新: ${updateCount.value}`)
}

// 重置计数器
const resetCounter = () => {
  updateCount.value = 0
  ElMessage.info('计数器已重置')
}

// 保存共享数据
const saveSharedData = () => {
  if (!sharedData.value.trim()) {
    ElMessage.warning('请输入一些数据')
    return
  }

  // 模拟保存到全局状态或localStorage
  localStorage.setItem('singleInstanceData', sharedData.value)
  ElMessage.success('数据已保存到本地存储')
}

// 加载共享数据
const loadSharedData = () => {
  const saved = localStorage.getItem('singleInstanceData')
  if (saved) {
    sharedData.value = saved
    ElMessage.success('数据已从本地存储加载')
  } else {
    ElMessage.info('没有找到保存的数据')
  }
}

// 清除共享数据
const clearSharedData = () => {
  sharedData.value = ''
  localStorage.removeItem('singleInstanceData')
  ElMessage.info('共享数据已清除')
}

// 组件挂载
onMounted(() => {
  instanceId.value = generateInstanceId()
  mountTime.value = new Date().toLocaleString()

  // 启动定时器
  timer = setInterval(() => {
    updateCount.value++
  }, 2000)

  // 加载共享数据
  loadSharedData()

  console.log('[SingleInstanceTest] 组件挂载:', {
    instanceId: instanceId.value,
    mountTime: mountTime.value,
    routeInfo: routeInfo
  })

  ElMessage.info(`单实例组件已创建: ${instanceId.value}`)
})

// 组件卸载
onUnmounted(() => {
  // 清理定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  console.log('[SingleInstanceTest] 组件卸载:', {
    instanceId: instanceId.value,
    updateCount: updateCount.value,
    sharedData: sharedData.value
  })
})
</script>

<template>
  <div class="single-instance-test">
    <ElCard>
      <template #header>
        <div class="card-header">
          <span>单实例测试页面</span>
          <ElTag type="info">单实例模式</ElTag>
        </div>
      </template>

      <!-- 实例信息 -->
      <div class="instance-info">
        <h3>实例信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>实例ID:</strong> {{ instanceId }}
          </div>
          <div class="info-item">
            <strong>挂载时间:</strong> {{ mountTime }}
          </div>
          <div class="info-item">
            <strong>包裹器名称:</strong> {{ routeInfo.wrapperName }}
          </div>
          <div class="info-item">
            <strong>组件Key:</strong> {{ routeInfo.instanceKey }}
          </div>
          <div class="info-item">
            <strong>自动计数:</strong> {{ updateCount }}
          </div>
          <div class="info-item">
            <strong>允许多实例:</strong>
            <ElTag :type="routeInfo.allowMultiple ? 'success' : 'danger'" size="small">
              {{ routeInfo.allowMultiple ? '是' : '否' }}
            </ElTag>
          </div>
        </div>
      </div>

      <ElDivider />

      <!-- 计数器操作 -->
      <div class="counter-section">
        <h3>计数器操作</h3>
        <div class="counter-display">
          <span class="counter-value">{{ updateCount }}</span>
          <span class="counter-label">当前计数</span>
        </div>
        <div class="button-group">
          <ElButton type="primary" @click="incrementCounter">
            手动增加
          </ElButton>
          <ElButton @click="resetCounter">
            重置计数
          </ElButton>
        </div>
        <p class="counter-note">
          <strong>注意:</strong> 计数器每2秒自动增加1，这个状态在单实例模式下会保持。
        </p>
      </div>

      <ElDivider />

      <!-- 共享数据 -->
      <div class="shared-data-section">
        <h3>共享数据测试</h3>
        <ElInput v-model="sharedData" type="textarea" :rows="4" placeholder="输入一些数据来测试单实例的状态保持..." />
        <div class="button-group">
          <ElButton type="success" @click="saveSharedData">
            保存数据
          </ElButton>
          <ElButton type="info" @click="loadSharedData">
            加载数据
          </ElButton>
          <ElButton type="danger" @click="clearSharedData">
            清除数据
          </ElButton>
        </div>
      </div>

      <ElDivider />

      <!-- 说明信息 -->
      <div class="explanation-section">
        <h3>单实例说明</h3>
        <ul>
          <li>这个页面配置了 <code>meta.allowMultiple: false</code></li>
          <li>无论访问多少次，都只会使用同一个组件实例</li>
          <li>组件的状态会在页面切换时保持</li>
          <li>适用于设置页面、状态管理等需要保持状态的场景</li>
          <li>包裹器名称不会有序列号后缀</li>
        </ul>
      </div>

      <!-- 测试建议 -->
      <div class="test-suggestions">
        <h3>测试建议</h3>
        <ol>
          <li>在当前页面输入一些数据并保存</li>
          <li>观察自动计数器的变化</li>
          <li>切换到其他页面，然后再回到此页面</li>
          <li>检查数据和计数器是否保持原来的状态</li>
          <li>对比与多实例页面的行为差异</li>
        </ol>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.single-instance-test {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.instance-info {
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.info-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #909399;
}

.info-item strong {
  color: #303133;
}

.counter-section,
.shared-data-section {
  margin-bottom: 24px;
}

.counter-display {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.counter-value {
  font-size: 48px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.counter-label {
  font-size: 16px;
  opacity: 0.9;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.counter-note {
  margin-top: 12px;
  padding: 8px 12px;
  background: #e1f5fe;
  border-radius: 4px;
  color: #0277bd;
  font-size: 14px;
}

.explanation-section,
.test-suggestions {
  background: #f3f4f6;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.explanation-section h3,
.test-suggestions h3 {
  margin-top: 0;
  color: #1f2937;
}

.explanation-section ul,
.test-suggestions ol {
  margin: 12px 0 0 0;
  padding-left: 20px;
}

.explanation-section li,
.test-suggestions li {
  margin-bottom: 8px;
  line-height: 1.5;
}

code {
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #374151;
}

h3 {
  color: #909399;
  margin-bottom: 16px;
}
</style>
