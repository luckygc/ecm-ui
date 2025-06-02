<script setup lang="ts" name="UserManagement">
import { Delete, Download, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: '',
  status: '',
})

const loading = ref(false)
const total = ref(0)
const userList = ref([
  {
    userId: 1,
    username: 'admin',
    nickName: '管理员',
    deptName: '研发部门',
    phonenumber: '13800138000',
    status: 1,
    createTime: '2023-01-01 12:00:00',
  },
  {
    userId: 2,
    username: 'test',
    nickName: '测试用户',
    deptName: '测试部门',
    phonenumber: '13800138001',
    status: 1,
    createTime: '2023-01-02 12:00:00',
  },
])

// 查询用户列表
function getList() {
  loading.value = true
  // 这里应该调用API获取用户列表
  setTimeout(() => {
    total.value = userList.value.length
    loading.value = false
  }, 500)
}

// 搜索按钮操作
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置按钮操作
function resetQuery() {
  queryParams.username = ''
  queryParams.status = ''
  handleQuery()
}

// 新增按钮操作
function handleAdd() {
  ElMessage.success('点击了新增按钮')
}

// 修改按钮操作
function handleUpdate(row: any) {
  ElMessage.success(`点击了修改按钮，用户ID：${row.userId}`)
}

// 删除按钮操作
function handleDelete(row: any) {
  ElMessageBox.confirm(`确认删除用户"${row.username}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

// 导出按钮操作
function handleExport() {
  ElMessage.success('导出功能开发中')
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>

      <!-- 查询条件 -->
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="true" label-width="68px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable>
            <el-option key="1" label="正常" value="1" />
            <el-option key="0" label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain :icon="Edit" :disabled="true">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain :icon="Delete" :disabled="true">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain :icon="Download" @click="handleExport">导出</el-button>
        </el-col>
      </el-row>

      <!-- 用户表格 -->
      <el-table v-loading="loading" :data="userList" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户编号" align="center" prop="userId" />
        <el-table-column label="用户名称" align="center" prop="username" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
        <el-table-column label="手机号码" align="center" prop="phonenumber" width="120" />
        <el-table-column label="状态" align="center" key="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" :icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button link type="primary" :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
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

.mb8 {
  margin-bottom: 8px;
}
</style>
