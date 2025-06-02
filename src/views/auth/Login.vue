<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <img src="/logo.svg" alt="Logo" class="logo-img"/>
        </div>
        <h1 class="login-title">Repodar 管理系统</h1>
        <p class="login-subtitle">欢迎登录</p>
      </div>

      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" size="large"
               @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" clearable/>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
                    show-password
                    clearable/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, type FormInstance, type FormRules} from 'element-plus'
import {useUserStore} from '@/stores/user'
import {authApi} from "@/api";
import type {LoginForm} from "@/types/api/modules/auth-api-types.ts";

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur'}
  ]
}

// 处理登录
async function handleLogin() {
  if (!loginFormRef.value) {
    return;
  }

  try {
    // 验证表单
    await loginFormRef.value.validate()

    loading.value = true

    // 调用登录API，启用skipErrorHandler来自定义错误处理
    const response = await authApi.login(loginForm, true)

    // 登录成功，token已经在响应拦截器中自动处理
    userStore.setUserInfo(response.user)

    // 获取自动存储的token并设置到store中
    const token = localStorage.getItem('token')
    if (token) {
      userStore.setToken(token)

      // 根据rememberMe决定存储位置
      if (!loginForm.rememberMe) {
        // 如果不记住我，将token移动到sessionStorage
        localStorage.removeItem('token')
        sessionStorage.setItem('token', token)
      }
    }

    ElMessage.success('登录成功')

    // 跳转到首页
    router.push('/')

  } catch (error: any) {
    // 自定义错误处理
    const errorMessage = error.message || '登录失败，请检查用户名和密码'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04),
  0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  margin-bottom: 20px;
}

.logo-img {
  width: 64px;
  height: 64px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

:deep(.el-input__inner) {
  height: 44px;
  line-height: 44px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
