<script setup lang="ts">
import Page from '~/components/page/Page.vue'

defineOptions({
  name: 'TestFormCreate',
})
</script>

<template>
  <Page>
    <div class="form-container">
      <div class="header-section">
        <h2>表单创建</h2>
        <p class="subtitle">
          这个页面没有toolbar，用于测试当没有toolbar内容时布局是否正确。
        </p>
      </div>

      <div class="content-section">
        <div class="card">
          <h3>基本信息</h3>
          <div class="form-grid">
            <div class="form-item">
              <label>名称：</label>
              <input type="text" placeholder="请输入名称" class="form-input">
            </div>
            <div class="form-item">
              <label>描述：</label>
              <textarea placeholder="请输入描述" class="form-textarea" />
            </div>
            <div class="form-item">
              <label>类型：</label>
              <select class="form-select">
                <option>选项1</option>
                <option>选项2</option>
                <option>选项3</option>
              </select>
            </div>
            <div class="form-item">
              <label>状态：</label>
              <div class="form-radio-group">
                <label class="radio-item">
                  <input type="radio" name="status" value="active" checked>
                  <span>启用</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="status" value="inactive">
                  <span>禁用</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>高级设置</h3>
          <div class="form-grid">
            <div class="form-item">
              <label>优先级：</label>
              <select class="form-select">
                <option>低</option>
                <option>中</option>
                <option>高</option>
              </select>
            </div>
            <div class="form-item">
              <label>标签：</label>
              <input type="text" placeholder="请输入标签，用逗号分隔" class="form-input">
            </div>
          </div>
        </div>

        <div class="card">
          <h3>内容预览</h3>
          <div class="preview-content">
            <p>这里有很多内容来测试页面的滚动功能...</p>
            <div class="demo-list">
              <div v-for="i in 15" :key="i" class="demo-list-item">
                <div class="demo-number">
                  {{ i.toString().padStart(2, '0') }}
                </div>
                <div class="demo-content">
                  <div class="demo-title">
                    测试项目 {{ i }}
                  </div>
                  <div class="demo-desc">
                    这是第 {{ i }} 个测试项目的内容描述
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.form-container {
  padding: 20px;
}

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
  border: 1px solid var(--el-border-color);
}

.card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 8px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.1);
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.form-radio-group {
  display: flex;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.radio-item input[type='radio'] {
  margin: 0;
}

.preview-content {
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.6;
}

.demo-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-fill-color-lighter);
  transition: all 0.2s ease;
}

.demo-list-item:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary);
}

.demo-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.demo-content {
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
</style>
