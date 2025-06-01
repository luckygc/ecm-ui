<script setup lang="ts">
// 菜单2-2页面
</script>

<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单2-2</span>
        </div>
      </template>

      <div class="content">
        <h3>这是菜单2-2的内容</h3>
        <p>这是一个三级菜单示例页面</p>
        <el-alert
          title="三级菜单示例"
          type="warning"
          description="这是一个三级菜单页面，用于展示多级菜单的效果"
          show-icon
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  padding: 20px 0;
}
</style>
