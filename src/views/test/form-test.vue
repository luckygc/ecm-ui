<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElTag, ElDivider } from 'element-plus'

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
  routeName: 'FormTest',
  fullPath: '/system/form-test',
  wrapperName: 'FormTest_1',
  instanceKey: 'form-test-key',
  allowMultiple: true
}

// 表单数据
const formData = ref({
  name: '',
  email: '',
  phone: '',
  description: ''
})

// 组件状态
const instanceId = ref('')
const mountTime = ref('')
const saveCount = ref(0)

// 生成实例ID
const generateInstanceId = () => {
  return `form-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}

// 保存表单
const saveForm = () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入姓名')
    return
  }

  saveCount.value++
  ElMessage.success(`表单保存成功 (第${saveCount.value}次)`)

  console.log('[FormTest] 表单保存:', {
    instanceId: instanceId.value,
    formData: formData.value,
    saveCount: saveCount.value,
    routeInfo: routeInfo
  })
}

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    description: ''
  }
  saveCount.value = 0
  ElMessage.info('表单已重置')
}

// 填充测试数据
const fillTestData = () => {
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  formData.value = {
    name: `测试用户_${randomSuffix}`,
    email: `test_${randomSuffix}@example.com`,
    phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    description: `这是一个测试描述，实例ID: ${instanceId.value}`
  }
  ElMessage.success('测试数据已填充')
}

// 组件挂载
onMounted(() => {
  instanceId.value = generateInstanceId()
  mountTime.value = new Date().toLocaleString()

  console.log('[FormTest] 组件挂载:', {
    instanceId: instanceId.value,
    mountTime: mountTime.value,
    routeInfo: routeInfo
  })

  ElMessage.info(`表单实例已创建: ${instanceId.value}`)
})

// 组件卸载
onUnmounted(() => {
  console.log('[FormTest] 组件卸载:', {
    instanceId: instanceId.value,
    formData: formData.value,
    saveCount: saveCount.value
  })
})
</script>

<template>
  <div class="form-test">
    <ElCard>
      <template #header>
        <div class="card-header">
          <span>表单测试页面 - 多实例支持</span>
          <ElTag type="success">允许多实例</ElTag>
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
            <strong>保存次数:</strong> {{ saveCount }}
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

      <!-- 表单区域 -->
      <div class="form-section">
        <h3>用户信息表单</h3>
        <ElForm :model="formData" label-width="80px">
          <ElFormItem label="姓名" required>
            <ElInput v-model="formData.name" placeholder="请输入姓名" clearable />
          </ElFormItem>

          <ElFormItem label="邮箱">
            <ElInput v-model="formData.email" placeholder="请输入邮箱" clearable />
          </ElFormItem>

          <ElFormItem label="手机号">
            <ElInput v-model="formData.phone" placeholder="请输入手机号" clearable />
          </ElFormItem>

          <ElFormItem label="描述">
            <ElInput v-model="formData.description" type="textarea" :rows="4" placeholder="请输入描述信息" />
          </ElFormItem>

          <ElFormItem>
            <div class="button-group">
              <ElButton type="primary" @click="saveForm">
                保存表单
              </ElButton>
              <ElButton @click="resetForm">
                重置表单
              </ElButton>
              <ElButton type="info" @click="fillTestData">
                填充测试数据
              </ElButton>
            </div>
          </ElFormItem>
        </ElForm>
      </div>

      <ElDivider />

      <!-- 说明信息 -->
      <div class="explanation-section">
        <h3>多实例说明</h3>
        <ul>
          <li>这个页面配置了 <code>meta.formComponent: true</code> 和 <code>meta.allowMultiple: true</code></li>
          <li>每次访问此页面都会创建一个新的组件实例</li>
          <li>每个实例都有独立的状态和数据</li>
          <li>实例ID和包裹器名称会自动生成序列号</li>
          <li>适用于表单编辑、数据录入等需要多开的场景</li>
        </ul>
      </div>

      <!-- 测试建议 -->
      <div class="test-suggestions">
        <h3>测试建议</h3>
        <ol>
          <li>在当前页面填写一些数据</li>
          <li>通过菜单或新标签页再次打开此页面</li>
          <li>观察新实例的数据是否独立</li>
          <li>对比实例ID和包裹器名称的差异</li>
          <li>查看浏览器控制台的日志信息</li>
        </ol>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.form-test {
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
  border-left: 3px solid #409eff;
}

.info-item strong {
  color: #303133;
}

.form-section {
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.explanation-section,
.test-suggestions {
  background: #f0f9ff;
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
  background: #e1f5fe;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #0277bd;
}

h3 {
  color: #409eff;
  margin-bottom: 16px;
}
</style>
