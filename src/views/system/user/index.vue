<script setup lang="ts">
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
  ElMessageBox.confirm(`确认删除用户"${row.username}"吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success(`删除成功，用户ID：${row.userId}`)
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 导出按钮操作
function handleExport() {
  ElMessage.success('点击了导出按钮')
}

// 状态修改
function handleStatusChange(row: any) {
  ElMessage.success(`修改用户"${row.username}"状态成功`)
}

// 分页大小改变
function handleSizeChange(val: number) {
  queryParams.pageSize = val
  getList()
}

// 页码改变
function handleCurrentChange(val: number) {
  queryParams.pageNum = val
  getList()
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

      <!-- 搜索区域 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            style="width: 180px"
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮区域 -->
      <el-row :gutter="10" class="mb-4">
        <el-col :span="1.5">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table v-loading="loading" :data="userList">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户编号" prop="userId" width="100" />
        <el-table-column label="用户名称" prop="username" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="部门" prop="deptName" :show-overflow-tooltip="true" />
        <el-table-column label="手机号码" prop="phonenumber" width="120" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column
          label="操作"
          align="center"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button type="primary" link @click="handleUpdate(scope.row)">
              <el-icon><Edit /></el-icon>修改
            </el-button>
            <el-button type="primary" link @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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

.mb-4 {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
</style>
