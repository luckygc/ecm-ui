<script setup lang="ts">
import {reactive, ref} from 'vue'
import {ElMessage, type FormInstance, type FormRules} from 'element-plus'
import {getConfig} from "@/utils/config-utils.ts";
import type {LoginForm} from "@/api/auth/types.ts";
import CapWrapper from "@/components/captcha/CapWrapper.vue"
import {useRequest} from "@/hooks/use-request.ts";
import {useAuthStore} from "@/store/modules/auth/auth-store.ts";

const loginFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  capToken: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur'}
  ],
  capToken: [
    {required: true, message: '请完成人机验证'}
  ]
}

const authStore = useAuthStore();
const handleLogin = async () => {
  try {
    await loginFormRef.value?.validate();
    await authStore.login(loginForm);
    ElMessage.success('登录成功');
  } catch (e) {
    console.error(e)
  }
}

const {isFetching: isLogin, execute: login} = useRequest(handleLogin);

</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <img src="/logo.svg" alt="Logo" class="logo-img"/>
        </div>
        <h1 class="login-title">{{ getConfig().appName }}</h1>
        <p class="login-subtitle">欢迎登录</p>
      </div>

      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" size="large"
               @keyup.enter="login">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" clearable/>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
                    show-password
                    clearable/>
        </el-form-item>

        <el-form-item prop="capToken">
          <CapWrapper ref="cap" v-model="loginForm.capToken"
                      :cap-api-endpoint="`${getConfig().apiBaseUrl}/api/cap/`"></CapWrapper>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-button" :loading="isLogin" @click="login">
            {{ isLogin ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

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

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
}
</style>
