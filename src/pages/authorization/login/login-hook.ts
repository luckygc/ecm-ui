import type { FormInstance, FormRules } from 'element-plus'
import type { LoginForm } from '~/api/auth/types'
import { reactive, ref } from 'vue'

export function useLoginForm() {
  const loginFormRef = ref<FormInstance>()

  // 登录表单数据
  const loginForm = reactive<LoginForm>({
    username: '',
    password: '',
    capToken: '',
  })

  // 表单验证规则
  const loginFormRules: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '用户名长度在 2 到 20 个字符',
        trigger: 'blur',
      },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        min: 3,
        max: 20,
        message: '密码长度在 3 到 20 个字符',
        trigger: 'blur',
      },
    ],
    capToken: [{ required: true, message: '请完成人机验证' }],
  }

  return {
    loginFormRef,
    loginForm,
    loginFormRules,
  }
}
