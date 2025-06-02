<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElCard, ElButton, ElInput, ElMessage, ElTag } from 'element-plus'

// 组件状态
const inputValue = ref('')
const mountTime = ref('')
const updateCount = ref(0)
const timer = ref<NodeJS.Timeout>()

// 生成随机数据
const generateRandomData = () => {
  return Math.random().toString(36).substring(2, 15)
}

// 初始化数据
const initData = () => {
  inputValue.value = generateRandomData()
  mountTime.value = new Date().toLocaleString()
  updateCount.value = 0
}

// 更新计数器
const updateCounter = () => {
  updateCount.value++
}

// 清空数据
const clearData = () => {
  inputValue.value = ''
  updateCount.value = 0
  ElMessage.success('数据已清空')
}

// 组件挂载
onMounted(() => {
  console.log('[NoCacheTest] 组件挂载 - 这个页面不会被缓存')
  initData()
  
  // 启动定时器
  timer.value = setInterval(() => {
    updateCounter()
  }, 1000)
  
  ElMessage.info('页面已加载 - 此页面不会被缓存')
})

// 组件卸载
onUnmounted(() => {
  console.log('[NoCacheTest] 组件卸载 - 状态将丢失')
  
  // 清理定时器
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  ElMessage.warning('页面已卸载 - 状态已丢失')
})
</script>

<template>
  <div class="no-cache-test">
    <ElCard>
      <template #header>
        <div class="card-header">
          <span>不缓存测试页面</span>
          <ElTag type="danger">keepalive: false</ElTag>
        </div>
      </template>

      <div class="content">
        <div class="info-section">
          <h3>页面信息</h3>
          <p><strong>挂载时间:</strong> {{ mountTime }}</p>
          <p><strong>更新计数:</strong> {{ updateCount }} 秒</p>
          <p><strong>缓存状态:</strong> <ElTag type="danger">不缓存</ElTag></p>
        </div>

        <div class="test-section">
          <h3>状态测试</h3>
          <p>在下面的输入框中输入内容，然后切换到其他页面再回来，观察状态是否保持：</p>
          
          <div class="input-group">
            <ElInput 
              v-model="inputValue" 
              placeholder="输入一些内容来测试状态保持..."
              style="margin-bottom: 16px;"
            />
            <div class="button-group">
              <ElButton @click="initData">重新初始化</ElButton>
              <ElButton type="danger" @click="clearData">清空数据</ElButton>
            </div>
          </div>
        </div>

        <div class="explanation-section">
          <h3>说明</h3>
          <ul>
            <li>这个页面在路由配置中设置了 <code>meta.keepalive: false</code></li>
            <li>每次进入页面时，组件都会重新挂载</li>
            <li>离开页面时，组件会被销毁，所有状态都会丢失</li>
            <li>定时器会在组件挂载时启动，卸载时清理</li>
            <li>输入框的内容在页面切换后不会保持</li>
          </ul>
        </div>

        <div class="comparison-section">
          <h3>对比测试</h3>
          <p>你可以对比以下页面来观察缓存效果的差异：</p>
          <ul>
            <li><strong>仪表盘页面:</strong> 默认缓存，状态会保持</li>
            <li><strong>用户管理页面:</strong> 默认缓存，状态会保持</li>
            <li><strong>当前页面:</strong> 不缓存，状态不会保持</li>
          </ul>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.no-cache-test {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  max-width: 800px;
}

.info-section,
.test-section,
.explanation-section,
.comparison-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-section h3,
.test-section h3,
.explanation-section h3,
.comparison-section h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

.input-group {
  margin-top: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.explanation-section ul,
.comparison-section ul {
  margin: 0;
  padding-left: 20px;
}

.explanation-section li,
.comparison-section li {
  margin-bottom: 8px;
  line-height: 1.5;
}

code {
  background: #e7f3ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #d63384;
}
</style>
