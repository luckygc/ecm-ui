<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElCard, ElButton, ElMessage, ElTag, ElDialog, ElInput, ElDivider } from 'element-plus'

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
  routeName: 'ModalTest',
  fullPath: '/system/modal-test',
  wrapperName: 'ModalTest_1',
  instanceKey: 'modal-test-key',
  allowMultiple: true
}

// 组件状态
const instanceId = ref('')
const mountTime = ref('')
const modalCount = ref(0)

// 弹窗状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogContent = ref('')

// 生成实例ID
const generateInstanceId = () => {
  return `modal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
}

// 打开弹窗
const openDialog = (type: string) => {
  modalCount.value++
  dialogTitle.value = `${type}弹窗 - 实例${instanceId.value}`
  dialogContent.value = `这是第${modalCount.value}次打开弹窗\n实例ID: ${instanceId.value}\n包裹器: ${routeInfo.wrapperName}`
  dialogVisible.value = true

  ElMessage.info(`打开${type}弹窗`)
}

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
  ElMessage.success('弹窗已关闭')
}

// 组件挂载
onMounted(() => {
  instanceId.value = generateInstanceId()
  mountTime.value = new Date().toLocaleString()

  console.log('[ModalTest] 组件挂载:', {
    instanceId: instanceId.value,
    mountTime: mountTime.value,
    routeInfo: routeInfo
  })

  ElMessage.info(`弹窗实例已创建: ${instanceId.value}`)
})

// 组件卸载
onUnmounted(() => {
  console.log('[ModalTest] 组件卸载:', {
    instanceId: instanceId.value,
    modalCount: modalCount.value
  })
})
</script>

<template>
  <div class="modal-test">
    <ElCard>
      <template #header>
        <div class="card-header">
          <span>弹窗测试页面 - 多实例支持</span>
          <ElTag type="warning">弹窗组件</ElTag>
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
            <strong>弹窗次数:</strong> {{ modalCount }}
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

      <!-- 弹窗操作区域 -->
      <div class="modal-section">
        <h3>弹窗操作</h3>
        <div class="button-group">
          <ElButton type="primary" @click="openDialog('信息')">
            打开信息弹窗
          </ElButton>
          <ElButton type="success" @click="openDialog('确认')">
            打开确认弹窗
          </ElButton>
          <ElButton type="warning" @click="openDialog('警告')">
            打开警告弹窗
          </ElButton>
          <ElButton type="danger" @click="openDialog('错误')">
            打开错误弹窗
          </ElButton>
        </div>
      </div>

      <ElDivider />

      <!-- 说明信息 -->
      <div class="explanation-section">
        <h3>多实例说明</h3>
        <ul>
          <li>这个页面配置了 <code>meta.modalComponent: true</code></li>
          <li>每次访问此页面都会创建一个新的组件实例</li>
          <li>每个实例的弹窗状态和计数器都是独立的</li>
          <li>适用于弹窗编辑、对话框等需要多开的场景</li>
          <li>可以同时打开多个页面实例，互不干扰</li>
        </ul>
      </div>

      <!-- 测试建议 -->
      <div class="test-suggestions">
        <h3>测试建议</h3>
        <ol>
          <li>在当前页面打开几个弹窗</li>
          <li>通过菜单或新标签页再次打开此页面</li>
          <li>在新实例中也打开一些弹窗</li>
          <li>观察两个实例的弹窗计数是否独立</li>
          <li>查看实例ID和包裹器名称的差异</li>
        </ol>
      </div>
    </ElCard>

    <!-- 弹窗组件 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="closeDialog">
      <div class="dialog-content">
        <ElInput v-model="dialogContent" type="textarea" :rows="6" readonly />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="closeDialog">取消</ElButton>
          <ElButton type="primary" @click="closeDialog">确定</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.modal-test {
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
  border-left: 3px solid #e6a23c;
}

.info-item strong {
  color: #303133;
}

.modal-section {
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.explanation-section,
.test-suggestions {
  background: #fff7e6;
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
  background: #fef3e2;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #e6a23c;
}

h3 {
  color: #e6a23c;
  margin-bottom: 16px;
}

.dialog-content {
  margin: 16px 0;
}

.dialog-footer {
  text-align: right;
}
</style>
