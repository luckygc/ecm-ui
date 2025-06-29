<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref, toValue} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, type FormInstance, type FormRules} from 'element-plus'
import {useUserStore} from '@/store'
import {authApi} from "@/api/auth/auth-api.ts";
import {getConfig} from "@/utils/config-utils.ts";
import type {LoginForm} from "@/api/auth/types.ts";

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

const cap = ref<HTMLElement>();

const disabled = ref(true);

// 加载状态
const loading = ref(false)

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
  ]
}

const handleCapSolve: EventListenerOrEventListenerObject = async (e: Event) => {
  loginForm.capToken = (e as CustomEvent).detail.token;
  disabled.value = false;
}

onMounted(async () => {
  await nextTick();
  cap.value?.addEventListener("solve", handleCapSolve);
  if (cap.value?.shadowRoot && (cap.value.shadowRoot.querySelector('.captcha') as HTMLElement)) {
    (cap.value.shadowRoot.querySelector('.captcha') as HTMLElement).style.boxSizing = 'border-box';
    cap.value.shadowRoot.querySelector('.credits')?.setAttribute('hidden', 'true')
  }
});

onUnmounted(() => {
  cap.value?.removeEventListener("solve", handleCapSolve);
});

// 处理登录
async function handleLogin() {
  if (!loginFormRef.value) {
    return;
  }

  console.log(toValue(loginForm))

  try {
    await loginFormRef.value.validate();
    loading.value = true;
    const userInfo = await authApi.login(loginForm);
    userStore.setUserInfo(userInfo);
    ElMessage.success('登录成功');
    // 跳转到首页
    await router.push('/')
  } finally {
    loading.value = false
  }
}
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
          <cap-widget ref="cap"
                      :data-cap-api-endpoint="`${getConfig().apiBaseUrl}/api/cap/`"
                      data-cap-i18n-verifying-label="验证中..."
                      data-cap-i18n-initial-state="人机验证"
                      data-cap-i18n-solved-label="验证通过！"
                      data-cap-i18n-error-label="验证错误！"></cap-widget>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin" :disabled="disabled">
            {{ loading ? '登录中...' : '登录' }}
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

cap-widget {
  --cap-widget-height: 40px;
  --cap-widget-width: 180px;
  --cap-checkbox-size: 20px;
  --cap-border-radius: var(--el-border-radius-base);
}
</style>
