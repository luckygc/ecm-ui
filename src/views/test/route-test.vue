<script setup lang="ts">
import { ElCard, ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useRouteStore } from '@/stores/route-store'

const router = useRouter()
const routeStore = useRouteStore()

// 测试点击没有实际页面的路由
function testClickNoPageRoute() {
  try {
    router.push('/system')
    ElMessage.warning('尝试跳转到 /system 路径（这应该被阻止）')
  } catch (error) {
    ElMessage.error('跳转失败：' + error)
  }
}

function testClickNestedNoPageRoute() {
  try {
    router.push('/nested')
    ElMessage.warning('尝试跳转到 /nested 路径（这应该被阻止）')
  } catch (error) {
    ElMessage.error('跳转失败：' + error)
  }
}

function testClickValidRoute() {
  router.push('/system/user')
  ElMessage.success('跳转到用户管理页面')
}

function showRouteInfo() {
  console.log('当前路由信息：', routeStore.currentRoute)
  console.log('访问过的页面：', routeStore.visitedPages)
  console.log('侧边栏路由：', routeStore.sidebarRoutes)
  ElMessage.info('路由信息已输出到控制台')
}
</script>

<template>
  <div class="route-test-container">
    <ElCard>
      <template #header>
        <h3>路由测试页面</h3>
      </template>

      <div class="test-section">
        <h4>测试没有实际页面的路由</h4>
        <p>以下按钮测试点击没有实际组件的父级路由，应该被阻止跳转：</p>
        <div class="button-group">
          <ElButton type="warning" @click="testClickNoPageRoute">
            点击系统管理路由 (/system)
          </ElButton>
          <ElButton type="warning" @click="testClickNestedNoPageRoute">
            点击多级菜单路由 (/nested)
          </ElButton>
        </div>
      </div>

      <div class="test-section">
        <h4>测试有实际页面的路由</h4>
        <p>以下按钮测试点击有实际组件的路由，应该正常跳转：</p>
        <div class="button-group">
          <ElButton type="success" @click="testClickValidRoute">
            跳转到用户管理 (/system/user)
          </ElButton>
        </div>
      </div>

      <div class="test-section">
        <h4>路由信息调试</h4>
        <div class="button-group">
          <ElButton type="info" @click="showRouteInfo">
            查看路由信息（控制台）
          </ElButton>
        </div>
      </div>

      <div class="test-section">
        <h4>当前路由状态</h4>
        <div class="info-display">
          <p><strong>当前路径：</strong>{{ $route.path }}</p>
          <p><strong>当前路由名：</strong>{{ $route.name }}</p>
          <p><strong>访问页面数量：</strong>{{ routeStore.visitedPages.length }}</p>
          <p><strong>缓存页面数量：</strong>{{ routeStore.cachedPages.length }}</p>
        </div>
      </div>

      <div class="test-section">
        <h4>面包屑测试</h4>
        <p>当前面包屑路径：</p>
        <div class="breadcrumb-display">
          <span v-for="(breadcrumb, index) in routeStore.breadcrumbs" :key="breadcrumb.path"
            :class="{ 'clickable': breadcrumb.clickable, 'non-clickable': !breadcrumb.clickable }">
            {{ breadcrumb.title }}
            <span v-if="index < routeStore.breadcrumbs.length - 1"> / </span>
          </span>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.route-test-container {
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.test-section h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.test-section p {
  margin: 10px 0;
  color: #606266;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.info-display {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.info-display p {
  margin: 5px 0;
}

.breadcrumb-display {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  font-family: monospace;
}

.clickable {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}

.non-clickable {
  color: #909399;
  cursor: not-allowed;
}
</style>
