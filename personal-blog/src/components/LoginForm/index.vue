<script setup>
import { ref, reactive } from 'vue';
import { User, Lock, Back, Message, Key } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

defineEmits(['login-success', 'close']);

// 表单类型：login, register, forgot
const formType = ref('login');
const loading = ref(false);
const forgotLoading = ref(false);
const registerLoading = ref(false);
const rememberMe = ref(false);

// 登录表单
const loginFormRef = ref(null);
const loginForm = reactive({
  username: '',
  password: ''
});

// 登录表单校验规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
};

// 忘记密码表单
const forgotFormRef = ref(null);
const forgotForm = reactive({
  email: ''
});

// 忘记密码表单校验规则
const forgotRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
};

// 注册表单
const registerFormRef = ref(null);
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 注册表单校验规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能少于3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

// 显示忘记密码表单
const showForgotPassword = () => {
  formType.value = 'forgot';
};

// 显示注册表单
const showRegister = () => {
  formType.value = 'register';
};

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      try {
        // 模拟API登录请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟用户信息
        const userData = {
          username: loginForm.username,
          nickname: '博客用户',
          avatar: '',
          bio: '这个人很懒，什么都没有留下'
        };

        // 存储登录信息
        localStorage.setItem('token', 'mock-jwt-token');
        if (rememberMe.value) {
          localStorage.setItem('rememberedUser', loginForm.username);
        }

        // 向父组件通知登录成功
        const emits = defineEmits(['login-success']);
        emits('login-success', userData);

        ElMessage.success('登录成功');
      } catch (error) {
        console.error('登录失败:', error);
        ElMessage.error('登录失败，请检查用户名和密码');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 处理忘记密码
const handleForgotPassword = async () => {
  if (!forgotFormRef.value) return;

  await forgotFormRef.value.validate(async (valid) => {
    if (valid) {
      forgotLoading.value = true;

      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        ElMessage.success(`重置密码链接已发送到邮箱: ${forgotForm.email}`);
        formType.value = 'login';
      } catch (error) {
        console.error('发送重置链接失败:', error);
        ElMessage.error('发送重置链接失败，请稍后重试');
      } finally {
        forgotLoading.value = false;
      }
    }
  });
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      registerLoading.value = true;

      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        ElMessage.success('注册成功，请登录');
        loginForm.username = registerForm.username;
        formType.value = 'login';
      } catch (error) {
        console.error('注册失败:', error);
        ElMessage.error('注册失败，请稍后重试');
      } finally {
        registerLoading.value = false;
      }
    }
  });
};
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <h2>欢迎回来</h2>
      <p>登录您的账号获取更多功能</p>
    </div>

    <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" size="large" @submit.prevent="handleLogin">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名/邮箱" prefix-icon="User" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
      </el-form-item>

      <div class="login-options">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <el-link type="primary" :underline="false" @click="showForgotPassword">忘记密码?</el-link>
      </div>

      <el-form-item>
        <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>

    <div class="divider">
      <span>或使用第三方账号登录</span>
    </div>

    <div class="social-login">
      <el-button class="social-button Github">
        <SvgIcon class="fab fa-weixin" name="github_icon" width="24px" height="24px" />
      </el-button>
      <el-button class="social-button Gitee">
        <SvgIcon class="fab fa-weibo" name="gitee_icon" width="24px" height="24px" />
      </el-button>
    </div>

    <div class="register-link">
      <span>还没有账号?</span>
      <el-link type="primary" :underline="false" @click="showRegister">立即注册</el-link>
    </div>

    <!-- 忘记密码表单 -->
    <div v-if="formType === 'forgot'" class="forgot-password-section">
      <el-divider>
        <el-icon>
          <Back />
        </el-icon>
      </el-divider>

      <div class="form-title">
        <h3>找回密码</h3>
        <p>输入您注册时使用的邮箱，我们将向您发送重置密码的链接</p>
      </div>

      <el-form :model="forgotForm" :rules="forgotRules" ref="forgotFormRef">
        <el-form-item prop="email">
          <el-input v-model="forgotForm.email" placeholder="请输入邮箱" prefix-icon="Message" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="submit-button" :loading="forgotLoading" @click="handleForgotPassword">
            发送重置链接
          </el-button>
          <el-button text class="back-button" @click="formType = 'login'">
            返回登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 注册表单 -->
    <div v-if="formType === 'register'" class="register-section">
      <el-divider>
        <el-icon>
          <Back />
        </el-icon>
      </el-divider>

      <div class="form-title">
        <h3>创建新账号</h3>
        <p>填写以下信息完成注册</p>
      </div>

      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" prefix-icon="Message" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请设置密码" prefix-icon="Lock"
                    show-password />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" prefix-icon="Key"
                    show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="submit-button" :loading="registerLoading" @click="handleRegister">
            注册
          </el-button>
          <el-button text class="back-button" @click="formType = 'login'">
            返回登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.login-container {
  padding: 20px 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 25px;

  h2 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 5px;
  }

  p {
    color: #909399;
    font-size: 14px;
  }
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  background: linear-gradient(135deg, #409EFF, #67C23A);
  border: none;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
  }
}

.divider {
  position: relative;
  text-align: center;
  margin: 25px 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #E4E7ED;
    z-index: 1;
  }

  span {
    position: relative;
    padding: 0 15px;
    background-color: white;
    color: #909399;
    font-size: 14px;
    z-index: 2;
  }
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;

  .social-button {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    i {
      font-size: 22px;
    }

    &:hover {
      transform: translateY(-3px);
    }

    &.weixin {
      background-color: #07C160;
      border: none;
      color: white;
    }

    &.qq {
      background-color: #12B7F5;
      border: none;
      color: white;
    }

    &.weibo {
      background-color: #E6162D;
      border: none;
      color: white;
    }
  }
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;

  span {
    color: #606266;
  }

  .el-link {
    margin-left: 5px;
    font-weight: 500;
  }
}

.forgot-password-section,
.register-section {
  margin-top: 20px;

  .form-title {
    text-align: center;
    margin-bottom: 20px;

    h3 {
      font-size: 20px;
      margin-bottom: 5px;
      color: #303133;
    }

    p {
      color: #909399;
      font-size: 14px;
    }
  }

  .submit-button {
    width: 100%;
    background: linear-gradient(135deg, #409EFF, #67C23A);
    border: none;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
    }
  }

  .back-button {
    width: 100%;
    margin-top: 10px;
  }
}

:deep(.el-divider__text) {
  background-color: white;
  cursor: pointer;

  .el-icon {
    font-size: 18px;
    color: #909399;
  }
}

@media (max-width: 600px) {
  .login-container {
    padding: 15px;
  }
}

:deep(.el-divider__text){
  background-color: var(--mao-size-button) !important;
}
</style>