<script setup lang="ts">
// 菜单2页面
</script>

<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单2</span>
        </div>
      </template>

      <div class="content">
        <h3>这是菜单2的内容</h3>
        <p>这是一个二级菜单示例页面，包含多个子菜单</p>
        <el-alert
          title="二级菜单示例"
          type="success"
          description="这是一个二级菜单页面，用于展示多级菜单的效果。请点击左侧的子菜单查看更多内容。"
          show-icon
        />

        <div class="sub-menu-links">
          <h4>子菜单快速导航：</h4>
          <el-space wrap>
            <router-link to="/nested/menu2/menu2-1">
              <el-button type="primary">
                菜单2-1
              </el-button>
            </router-link>
            <router-link to="/nested/menu2/menu2-2">
              <el-button type="warning">
                菜单2-2
              </el-button>
            </router-link>
            <router-link to="/nested/menu2/menu2-3">
              <el-button type="info">
                菜单2-3
              </el-button>
            </router-link>
          </el-space>
        </div>
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

.sub-menu-links {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>
