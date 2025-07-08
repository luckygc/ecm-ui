<script setup lang="ts">
// 测试页面逻辑
</script>

<template>
  <div class="test-scroll-page">
    <h1>滚动条测试页面</h1>
    <p>这个页面用于测试滚动条是否在正确的位置（header下面）</p>

    <!-- 生成大量内容来触发滚动 -->
    <div v-for="i in 50" :key="i" class="test-section">
      <h2>测试区块 {{ i }}</h2>
      <p>这是第 {{ i }} 个测试区块，用于测试滚动条的位置。</p>
      <p>如果滚动条出现在header下面，说明布局是正确的。</p>
      <p>如果滚动条出现在header底部，说明布局有问题。</p>
      <div class="test-content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-scroll-page {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 200vh;
}

.test-scroll-page h1 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.test-scroll-page h2 {
  color: #666;
  margin: 20px 0 10px 0;
  font-size: 18px;
}

.test-scroll-page p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 10px;
}

.test-section {
  background: white;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

.test-content p {
  margin-bottom: 8px;
  font-size: 14px;
}
</style>
