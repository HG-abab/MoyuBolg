<script setup>
import { useColorMode } from '@vueuse/core'
import pageBubble from '@/utils/pageBubble'
import { h, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { notification } from 'ant-design-vue';
import {
  LockOutlined,
  UserOutlined,
  GithubOutlined,
  GoogleOutlined,
  WechatOutlined,
  QqOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { AccountLogin } from '../../api/auth';
import { useUserStore } from '../../store/user';

const userStore = useUserStore()
const mode = useColorMode()
const bubbleCanvas = ref()
const activeKey = ref('1')
const formRef = ref();
const submitLoading = ref(false)
const router = useRouter()
const rememberMe = ref(false)
const isMobile = ref(false)

const formState = reactive({
  username: '',
  password: undefined,
})

const rules = {
  username: [
    {
      required: true,
      message: '请输入2-10位数字或字母',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入4-20位数字或字母',
      trigger: 'blur',
    },
  ],
}

const modeToggle = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

// 提交逻辑
const submit = async () => {
  formRef.value
    .validate()
    .then(() => {
      submitLoading.value = true
      AccountLogin({
        account: formState.username,
        password: formState.password
      }).then((res) => {
        if (res.code === 0) {
          notification.success({
            message: '登录成功',
            description: '欢迎回来！',
            duration: 3,
          })
          userStore.setUserToken(res.data.token)
          userStore.setUserName(res.data.user.name)
          userStore.setUserAvatar(res.data.user.avatar)
          router.push('/')
        } else {
          notification.error({
            message: `登录失败`,
            description: res.msg,
            duration: 3,
          })
        }
      })
    })
    .catch((error) => {
      notification.error({
        message: `登录失败`,
        description: '请联系管理员',
        duration: 3,
      })
    }).finally(() => {
      submitLoading.value = false
    })
}

// 响应式处理
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  pageBubble.init(bubbleCanvas.value)
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  pageBubble.removeListeners()
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div class="login-container">
    <div class="canvas">
      <canvas ref="bubbleCanvas" />
    </div>

    <div class="login-content" :class="{ 'mobile': isMobile }">
      <!-- 登录头部 -->
      <div class="login-content-top">
        <div class="top-left">
          <span class="title">Moyu-Blog</span>
          <span class="subtitle">后台管理系统</span>
        </div>
        <div class="top-right" @click="modeToggle">
          <div v-if="mode === 'light'">
            <SvgIcon name="sun" color="#a8abb2" width="20px" height="20px"></SvgIcon>
          </div>
          <div v-if="mode === 'dark'">
            <SvgIcon name="moon" color="#a8abb2" width="20px" height="20px"></SvgIcon>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- 登录主体 -->
      <div class="login-content-body">
        <!-- 登录框左侧 - 仅在非移动设备显示 -->
        <div class="login-content-left" v-if="!isMobile">
          <div class="login-image">
            <img src="@/assets/images/login-left.png" alt="登录页插图">
            <div class="login-slogan">
              <h2>博客管理系统</h2>
              <p>记录生活，分享知识</p>
            </div>
          </div>
        </div>

        <div class="divider-vertical" v-if="!isMobile"></div>

        <!-- 登录框右侧 -->
        <div class="login-content-right">
          <div class="login-form-wrapper">
            <div class="login-welcome">
              <h2>{{ isMobile ? '博客管理系统' : '欢迎登录' }}</h2>
              <p>请输入您的账号和密码</p>
            </div>

            <a-form ref="formRef" :model="formState" :rules="rules" class="login-form">
              <a-tabs v-model:activeKey="activeKey" centered>
                <a-tab-pane key="1" tab="账号密码登录" />
              </a-tabs>

              <a-form-item name="username">
                <a-input size="large" placeholder="请输入用户名" allowClear v-model:value="formState.username">
                  <template #prefix>
                    <UserOutlined class="form-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item name="password">
                <a-input-password size="large" placeholder="请输入密码" allowClear v-model:value="formState.password">
                  <template #prefix>
                    <LockOutlined class="form-icon" />
                  </template>
                </a-input-password>
              </a-form-item>

              <div class="form-extra">
                <a-checkbox v-model:checked="rememberMe">记住我</a-checkbox>
              </div>

              <a-button type="primary" block :loading="submitLoading" size="large" @click="submit" class="login-button">
                登录
              </a-button>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: var(--bg-color-container);

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .login-content {
    position: relative;
    z-index: 2;
    width: 900px;
    max-width: 90%;
    background: var(--bg-color-container);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;

    &.mobile {
      width: 400px;
    }

    .login-content-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;

      .top-left {
        display: flex;
        align-items: center;

        .title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-color);
          margin-right: 12px;
        }

        .subtitle {
          font-size: 14px;
          color: var(--text-color-1);
        }
      }

      .top-right {
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s;

        &:hover {
          background: rgba(0, 0, 0, 0.04);
        }
      }
    }

    .divider {
      height: 1px;
      background-color: var(--border-color);
      margin: 0;
    }

    .divider-vertical {
      width: 1px;
      background-color: var(--border-color);
      margin: 0;
    }

    .login-content-body {
      display: flex;
      height: 500px;

      .login-content-left {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;

        .login-image {
          position: relative;
          text-align: center;

          img {
            width: 80%;
            max-height: 300px;
            object-fit: contain;
          }

          .login-slogan {
            margin-top: 20px;

            h2 {
              font-size: 24px;
              color: var(--text-color);
              margin-bottom: 8px;
            }

            p {
              color: var(--text-color-1);
              font-size: 16px;
              opacity: 0.8;
            }
          }
        }
      }

      .login-content-right {
        width: 50%;

        .login-form-wrapper {
          padding: 40px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .login-welcome {
            text-align: center;

            h2 {
              font-size: 28px;
              color: var(--text-color);
              margin-bottom: 8px;
              font-weight: 500;
            }

            p {
              color: var(--text-color-1);
              font-size: 16px;
            }
          }

          .login-form {
            .form-icon {
              color: #bfbfbf;
            }

            .form-extra {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 24px;

              .forgot-link {
                color: var(--primary-color);
                cursor: pointer;

                &:hover {
                  text-decoration: underline;
                }
              }
            }

            .login-button {
              height: 44px;
              font-size: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
            }

            .other-login {
              margin-top: 30px;

              .other-login-title {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;

                .line {
                  flex: 1;
                  height: 1px;
                  background-color: var(--border-color);
                }

                .text {
                  padding: 0 16px;
                  color: var(--text-color-1);
                  font-size: 14px;
                }
              }

              .other-login-icons {
                display: flex;
                justify-content: center;
                gap: 16px;

                .icon-button {
                  padding: 0;

                  .social-icon {
                    font-size: 24px;
                    color: var(--text-color-1);

                    &:hover {
                      color: var(--primary-color);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// 移动端适配
.login-content.mobile {
  .login-content-body {
    height: auto;
    flex-direction: column;

    .login-content-right {
      width: 100%;

      .login-form-wrapper {
        padding: 30px 20px;
      }
    }
  }
}

// 小屏幕/平板设备适配
@media (max-width: 992px) {
  .login-container {
    .login-content {
      width: 750px;

      .login-content-body {
        .login-content-left {
          padding: 20px;
        }

        .login-content-right {
          .login-form-wrapper {
            padding: 30px;
          }
        }
      }
    }
  }
}

// 超小屏幕适配
@media (max-width: 480px) {
  .login-container {
    .login-content {
      box-shadow: none;
      background: transparent;

      .login-content-top {
        padding: 16px;
      }

      .login-content-body {
        .login-content-right {
          .login-form-wrapper {
            padding: 20px 16px;
            background: var(--bg-color-container);
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);

            .login-welcome {
              margin-bottom: 20px;

              h2 {
                font-size: 24px;
              }
            }

            .login-form {
              .login-button {
                height: 40px;
              }
            }
          }
        }
      }
    }
  }
}

.oauth-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.oauth-btn {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  cursor: pointer;
}


.github {
  background: #24292e;
  color: #fff;
}

.github:hover {
  background: #1b1f23;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.gitee {
  background: #d81e06;
  color: #fff;
}

.gitee:hover {
  background: #b61605;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(216, 30, 6, 0.3);
}

.oauth-btn:active {
  transform: scale(0.8);
}
</style>
