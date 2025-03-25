<script setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { User, Close, Paperclip, UserFilled, Headset, Tools, Setting, SwitchButton, Document } from '@element-plus/icons-vue'
import { HomeFilled } from '@element-plus/icons-vue'
import pigeOnhole from './nav-item/nav-item-pigeonhole.vue'
import other from './nav-item/nav-item-other.vue'
import DayNightToggleButton from '../DayNightToggle/index'
import { useColorMode } from '@vueuse/core'
import navSearch from '../navSearch/index.vue'
import Mobile from './Mobilenavigation/index.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/User'

const userStore = useUserStore()

const router = useRouter()
const dialogVisible = ref(false)
const loginVisible = ref(false)
const userDrawer = ref(false)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 用户登录状态和信息
const isLoggedIn = ref(false)
const userInfo = ref({
  username: '',
  nickname: '',
  avatar: '',
  bio: ''
})

onMounted(async () => {
  customElements.define("toggle-button", DayNightToggleButton);
})

// 监听 Pinia 中 `token` 的变化，动态更新登录状态
watchEffect(() => {
  if (userStore.token) {
    isLoggedIn.value = true;
    userInfo.value.username = userStore.username;
    userInfo.value.avatar = userStore.useravatar;
  } else {
    isLoggedIn.value = false;
    userInfo.value = { username: "", avatar: "" };
  }
});


// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    logout()
  } else {
    navigateTo(`/user/${command}`)
  }
}

// 导航到指定页面
const navigateTo = (path) => {
  router.push(path)
  drawer.value = false
  userDrawer.value = false
}

// 退出登录
const logout = () => {
  userStore.removeUserInfo()
  isLoggedIn.value = false
  userInfo.value = {
    username: '',
    nickname: '',
    avatar: '',
    bio: ''
  }
  ElMessage.success('已退出登录')
  router.push('/')
}

// 打开移动端用户菜单
const openUserMenu = () => {
  userDrawer.value = true
}

const mode = useColorMode()
function changeToggle({ detail }) {
  mode.value = detail
}
const isHidden = ref(true)
const drawer = ref(false)


const handleWheelEvent = (event) => {
  if (event.deltaY < 0) {
    isHidden.value = true;
    console.log(isHidden.value)
  } else if (event.deltaY > 0) {
    isHidden.value = false;
    console.log(isHidden.value)
  }
};

const loginDialogVisible = () => {
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('wheel', handleWheelEvent);
});

// 在组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('wheel', handleWheelEvent);
});
</script>

<template>
  <div class="search_dialog_container">
    <!-- 搜索内容 -->
    <el-dialog v-model="dialogVisible" :show-close="false" :close-on-click-modal="false" :lock-scroll="true">
      <template #header>
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <span style="font-size: 1.3rem; font-weight: 600; margin-left: 6px">搜索</span>
          <el-button :icon="Close" style="background: none;font-size: 1.4rem;width: 30px;border: none"
                     @click="dialogVisible = false" />
        </div>
      </template>
      <navSearch @isShowSearch="dialogVisible = false" />
    </el-dialog>
  </div>
  <transition name="fade">
    <div class="navigation" v-if="isHidden">
      <div class="left">
        <el-link href="/" style="cursor:default;margin-left:8px; padding-right: 8px" :underline="false">
          Moyu
          <SvgIcon name="webActive" width="24px" height="16px" style="margin-left: 5px;" />
        </el-link>
        <div class="Home">
          <el-link href="/" :underline="false" class="nav_link">
            <el-icon class="elicon" :size="18" style="margin-top: -1px">
              <HomeFilled />
            </el-icon>
            <span class="text">首页</span>
          </el-link>
        </div>
        <div class="nav_item">
          <el-link :underline="false">
            <pigeOnhole />
          </el-link>
        </div>
        <div class="nav_item">
          <el-link :underline="false">
            <other />
          </el-link>
        </div>
        <div class="Home">
          <el-link href="/concerning" :underline="false">
            <el-icon class="elicon" :size="18" style="margin-top: -1px">
              <Tools />
            </el-icon>
            <span class="text">关于</span>
          </el-link>
        </div>
      </div>
      <div class="right">
        <div class="toggle">
          <toggle-button @change="changeToggle" size="1"></toggle-button>
        </div>
        <div class="search" @click="dialogVisible = true">
          <SvgIcon name="search" width="2em" height="2em" color="#409EFF" class="icon" />
        </div>
        <!-- 用户登录/头像区域 -->
        <div class="user-area">
          <template v-if="isLoggedIn">
            <!-- 已登录状态：显示头像 -->
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="avatar-wrapper">
                <el-avatar :size="32" :src="userInfo.avatar || defaultAvatar" />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon>
                      <User />
                    </el-icon>
                    <span>个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <!-- 未登录状态：显示登录按钮 -->
            <el-button @click="loginDialogVisible" type="primary" size="small" class="login-btn">
              登录
            </el-button>
          </template>
        </div>
      </div>
      <!-- 移动端 -->
      <div class="move_nav" style="margin-left: 0.7rem">
        <div class="left">
          <div @click="drawer = true" style="margin-left: 0.5rem;">
            <SvgIcon name="directory_icon" width="26" height="26" color="#409EFF" class="icon" />
          </div>
          <!-- 移动端日夜切换 -->
          <div style="margin-left: 3.5rem;">
            <toggle-button @change="changeToggle"></toggle-button>
          </div>
        </div>
        <div class="right">
          <div class="search" @click="dialogVisible = true">
            <SvgIcon name="search" width="2em" height="2em" color="#409EFF" class="icon" />
          </div>

          <!-- 移动端登录/头像区域 -->
          <div class="mobile-user-area">
            <template v-if="isLoggedIn">
              <div @click="openUserMenu" class="mobile-avatar">
                <el-avatar :size="30" :src="userInfo.avatar || defaultAvatar" />
              </div>
            </template>
            <template v-else>
              <div @click="loginVisible = true" class="mobile-login">
                <el-icon>
                  <User />
                </el-icon>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <div>
    <el-drawer v-model="drawer" :with-header="true" size="40%" direction="ltr" :show-close="false">
      <template #header>
        <span style="font-size: 1.2rem">导航</span>
        <el-button :icon="Close" style="background: none;font-size: 1.5rem;width: 30px;border: none"
                   @click="drawer = false" />
      </template>
      <template #default>
        <Mobile @Jump:closeDrawer="drawer = false" />

        <!-- 移动端抽屉中添加登录/用户信息 -->
        <div class="drawer-user-section">
          <template v-if="isLoggedIn">
            <div class="drawer-user-info">
              <el-avatar :size="50" :src="userInfo.avatar || defaultAvatar" />
              <div class="user-name">{{ userInfo.nickname || userInfo.username }}</div>
            </div>
            <div class="drawer-user-actions">
              <el-button type="primary" size="small" @click="navigateTo('/user/profile')">个人中心</el-button>
              <el-button type="danger" size="small" @click="logout">退出登录</el-button>
            </div>
          </template>
          <template v-else>
            <div class="drawer-login-section">
              <el-button type="primary" @click="loginVisible = true">登录/注册</el-button>
            </div>
          </template>
        </div>
      </template>
    </el-drawer>
  </div>

  <!-- 移动端用户菜单 -->
  <el-drawer v-model="userDrawer" :with-header="true" size="40%" direction="rtl" :show-close="false">
    <template #header>
      <span style="font-size: 1.2rem">用户中心</span>
      <el-button :icon="Close" style="background: none;font-size: 1.5rem;width: 30px;border: none"
                 @click="userDrawer = false" />
    </template>
    <template #default>
      <div class="mobile-user-options">
        <div class="user-info-header">
          <el-avatar :size="60" :src="userInfo.avatar || defaultAvatar" />
          <h3>{{ userInfo.nickname || userInfo.username }}</h3>
          <p>{{ userInfo.bio || '这个人很懒，什么都没有留下' }}</p>
        </div>
        <el-divider />
        <el-menu>
          <el-menu-item @click="navigateTo('/user/profile')">
            <el-icon>
              <User />
            </el-icon>
            <span>个人中心</span>
          </el-menu-item>
          <el-divider />
          <el-menu-item @click="logout">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出登录</span>
          </el-menu-item>
        </el-menu>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
:deep(.el-dialog) {
  width: 50vw;
  height: 70vh;
  padding-top: 0;
  padding: 0 8px;
  // 过渡效果
  transition: all .3s;

  @media (max-width: 1400px) {
    width: 45%;
  }

  @media (max-width: 1000px) {
    width: 60%;
  }

  @media (max-width: 760px) {
    width: 70%;
  }

  @media (max-width: 600px) {
    width: 90%;
  }

  @media screen and (max-width: 650px) {
    border-radius: 0;
    margin-top: 0;
    margin-bottom: 0;
    width: 100vw;
    height: 100%;
  }
}

:deep(.login-dialog) {
  width: 400px;
  height: auto;
  border-radius: 8px;

  @media screen and (max-width: 650px) {
    width: 100vw;
    height: auto;
  }
}

:deep(.divider span) {
  background-color: var(--mao-size-button)
}

:deep(.el-dialog__header) {
  padding: 0.8rem 0;
}

.navigation {
  width: 100vw;
  height: 50px;
  // 朦胧
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.041);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease-in-out;

  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 910px) {
      display: none;
    }

    .el-link {
      color: var(--mao-hearder-color);
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0 6px;
    }

    .Home {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;

      &::before {
        content: ''; // 必须设置content属性
        position: absolute;
        bottom: -69%; // 进度条位于悬浮框上方
        left: 0;
        width: 100%; // 进度条宽度为100%
        height: 1.6px; // 进度条高度
        background-color: rgb(64, 158, 255); // 进度条颜色
        transform: scaleX(0); // 初始状态缩放为0，即不可见
        transform-origin: left; // 缩放起点在左侧
        transition: transform 0.5s ease-in-out; // 缩放过渡效果
      }

      &:hover::before {
        transform: scaleX(1); // 缩放变为1，即显示完整的进度条
      }

      .text {
        font-size: 1rem;
        margin-left: 2px;
      }
    }

    .nav_item {
      display: flex;
    }
  }

  .right {
    display: flex;
    align-items: center;

    @media screen and (max-width: 910px) {
      display: none;
    }

    .toggle {
      margin-right: 3vw;
    }

    .search {
      margin-right: 1.5vw;
      margin-top: 3px;
      transform: scale(1);
      transition: all 0.3s ease-in-out;

      // 鼠标放上去 放大1.2
      &:hover {
        transform: scale(1.2);
        // 动画
        transition: all 0.3s ease-in-out;
      }
    }

    // 用户区域样式
    .user-area {
      margin-right: 2vw;
      display: flex;
      align-items: center;

      .avatar-wrapper {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: scale(1.1);
        }
      }

      .login-btn {
        background: linear-gradient(135deg, #409EFF, #67C23A);
        border: none;
        padding: 6px 15px;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
        }
      }
    }
  }
}

.elicon {
  color: var(--mao-hearder-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(10px);
}

.fade-enter-from,
.fade-leave-to {
  transition: all 0.3s ease-in-out;
  transform: translateY(-100%);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.473);
}

.move_nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100vw;

  @media screen and (min-width: 910px) {
    display: none;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
    align-items: center;

    .mobile-user-area {
      margin-right: 20px;
      margin-left: 15px;

      .mobile-avatar,
      .mobile-login {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mobile-login {
        font-size: 22px;
        color: #409EFF;
      }
    }
  }
}

// 抽屉用户区域样式
.drawer-user-section {
  margin-top: 20px;
  padding: 15px;

  .drawer-user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;

    .user-name {
      margin-top: 10px;
      font-weight: 500;
      font-size: 16px;
    }
  }

  .drawer-user-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }

  .drawer-login-section {
    text-align: center;
    padding: 15px 0;
  }
}

// 移动端用户菜单样式
.mobile-user-options {
  .user-info-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 10px;

    h3 {
      margin: 10px 0 5px;
      font-size: 18px;
    }

    p {
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  }
}
</style>
