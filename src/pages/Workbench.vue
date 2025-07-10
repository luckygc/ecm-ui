<script setup lang="ts">
import { useRouter } from 'vue-router'
import Page from '~/components/page/Page.vue'

const router = useRouter()
function randomPage() {
  router.push(`/workbench?a=${Math.random()}`)
}
</script>

<template>
  <Page layout="fixed">
    <div class="workbench-container">
      <div class="header-section">
        <h2>工作台</h2>
        <p class="subtitle">
          欢迎使用文档和记录仓库管理系统
        </p>
      </div>

      <div class="content-section">
        <div class="card">
          <h3>快速操作</h3>
          <div class="action-buttons">
            <button class="action-btn" @click="randomPage">
              <span class="icon">🔄</span>
              <span>随机跳转测试</span>
            </button>
            <input type="text" placeholder="搜索内容..." class="search-input">
          </div>
        </div>

        <div class="card">
          <h3>内容预览</h3>
          <div class="content-preview">
            <p>这是一个测试页面，用于验证新的FixedLayout布局和背景显示效果。</p>
            <div class="demo-content">
              <div v-for="i in 20" :key="i" class="demo-item">
                <div class="demo-icon">
                  📄
                </div>
                <div class="demo-text">
                  <div class="demo-title">
                    示例文档 {{ i }}
                  </div>
                  <div class="demo-desc">
                    这是一个示例文档的描述信息
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #tool-bar>
      <div class="toolbar-content">
        <div class="toolbar-left">
          <span class="toolbar-label">页面操作：</span>
          <button class="toolbar-btn">
            保存
          </button>
          <button class="toolbar-btn">
            预览
          </button>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-btn primary">
            发布
          </button>
          <button class="toolbar-btn">
            更多操作
          </button>
        </div>
      </div>
    </template>
  </Page>
</template>

<style scoped>
.header-section {
  margin-bottom: 24px;
}

.header-section h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.subtitle {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--el-border-color-lighter);
}

.card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.action-btn:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary);
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  font-size: 14px;
  max-width: 300px;
}

.search-input:focus {
  outline: none;
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.1);
}

.content-preview {
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.6;
}

.demo-content {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  transition: all 0.2s ease;
}

.demo-item:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary);
}

.demo-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.demo-text {
  flex: 1;
}

.demo-title {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.demo-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* Toolbar样式 */
.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.toolbar-btn {
  padding: 6px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.toolbar-btn:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary);
}

.toolbar-btn.primary {
  background: var(--el-color-primary);
  color: white;
  border-color: var(--el-color-primary);
}

.toolbar-btn.primary:hover {
  background: var(--el-color-primary-light-3);
}
</style>
