<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// ==================== 基础状态使用 ====================

// 侧边栏状态
const isSidebarOpen = computed(() => appStore.isSidebarOpened)
const currentDevice = computed(() => appStore.currentDevice)
const currentTheme = computed(() => appStore.currentTheme)

// ==================== 组件刷新键使用 ====================

// 获取当前组件的刷新键
const dashboardKey = computed(() => appStore.getComponentKey('dashboard'))
const userManagementKey = computed(() => appStore.getComponentKey('user-management'))

// ==================== 方法使用示例 ====================

// 侧边栏操作
const handleToggleSidebar = () => {
  appStore.toggleSidebar()
}

const handleCloseSidebar = () => {
  appStore.closeSidebar()
}

// 主题切换
const handleToggleTheme = () => {
  appStore.toggleTheme()
}

// 设备类型切换
const handleSetMobile = () => {
  appStore.setDeviceType('mobile')
}

const handleSetDesktop = () => {
  appStore.setDeviceType('desktop')
}

// ==================== 组件刷新操作 ====================

// 刷新主内容区域
const handleRefreshMainContent = () => {
  appStore.refreshMainContent()
}

// 刷新指定组件
const handleRefreshDashboard = () => {
  appStore.refreshComponent('dashboard')
}

// 刷新多个组件
const handleRefreshMultiple = () => {
  appStore.refreshMultipleComponents(['dashboard', 'user-management'])
}

// 刷新所有组件（除了侧边栏、标签栏、头部）
const handleRefreshAll = () => {
  appStore.refreshAllComponents()
}

// 动态添加组件键
const handleAddComponent = () => {
  appStore.addComponentKey('new-component', 'new-component-initial')
}

// 移除组件键
const handleRemoveComponent = () => {
  appStore.removeComponentKey('new-component')
}

// ==================== KeepAlive 组件刷新示例 ====================

// 在 KeepAlive 中使用组件键
const keepAliveKey = computed(() => appStore.getComponentKey('dashboard'))

// 刷新 KeepAlive 缓存的组件
const refreshKeepAliveComponent = (componentName: string) => {
  // 先刷新组件键
  appStore.refreshComponent(componentName)
  
  // 如果需要，也可以配合 TagsView store 来清除缓存
  // const tagsViewStore = useTagsViewStore()
  // tagsViewStore.delCachedView({ name: componentName })
}
</script>

<template>
  <div class="app-store-usage-example">
    <h2>App Store 使用示例</h2>
    
    <!-- 状态显示 -->
    <div class="status-section">
      <h3>当前状态</h3>
      <p>侧边栏状态: {{ isSidebarOpen ? '打开' : '关闭' }}</p>
      <p>设备类型: {{ currentDevice }}</p>
      <p>主题: {{ currentTheme }}</p>
      <p>仪表盘组件键: {{ dashboardKey }}</p>
      <p>用户管理组件键: {{ userManagementKey }}</p>
    </div>

    <!-- 操作按钮 -->
    <div class="actions-section">
      <h3>操作示例</h3>
      
      <div class="button-group">
        <h4>侧边栏操作</h4>
        <el-button @click="handleToggleSidebar">切换侧边栏</el-button>
        <el-button @click="handleCloseSidebar">关闭侧边栏</el-button>
      </div>

      <div class="button-group">
        <h4>主题和设备</h4>
        <el-button @click="handleToggleTheme">切换主题</el-button>
        <el-button @click="handleSetMobile">设为移动端</el-button>
        <el-button @click="handleSetDesktop">设为桌面端</el-button>
      </div>

      <div class="button-group">
        <h4>组件刷新</h4>
        <el-button @click="handleRefreshMainContent">刷新主内容</el-button>
        <el-button @click="handleRefreshDashboard">刷新仪表盘</el-button>
        <el-button @click="handleRefreshMultiple">刷新多个组件</el-button>
        <el-button @click="handleRefreshAll">刷新所有组件</el-button>
      </div>

      <div class="button-group">
        <h4>组件键管理</h4>
        <el-button @click="handleAddComponent">添加组件键</el-button>
        <el-button @click="handleRemoveComponent">移除组件键</el-button>
      </div>
    </div>

    <!-- KeepAlive 使用示例 -->
    <div class="keepalive-section">
      <h3>KeepAlive 使用示例</h3>
      <keep-alive>
        <component 
          :is="'div'" 
          :key="keepAliveKey"
          class="demo-component"
        >
          <p>这是一个使用动态key的组件示例</p>
          <p>组件键: {{ keepAliveKey }}</p>
          <el-button @click="() => refreshKeepAliveComponent('dashboard')">
            刷新此组件
          </el-button>
        </component>
      </keep-alive>
    </div>
  </div>
</template>

<style scoped>
.app-store-usage-example {
  padding: 20px;
}

.status-section,
.actions-section,
.keepalive-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.button-group {
  margin-bottom: 20px;
}

.button-group h4 {
  margin-bottom: 10px;
  color: #606266;
}

.button-group .el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.demo-component {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
