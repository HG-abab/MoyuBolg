<template>
  <div>
    <a-layout id="components-layout-demo-top-side-2">
      <a-layout-header class="header">
        <div class="logo">
          <SvgIcon name="hdm" width="26px" height="26px"></SvgIcon>
          <span>Moyu-blog</span>
        </div>
        <div class="header-right">
          <div class="user-section">
            <template v-if="userInfo">
              <a-dropdown placement="bottomRight">
                <div class="user-dropdown-link">
                  <a-avatar :size="32" :src="userInfo.avatar || ''" class="user-avatar">
                    {{ 'U' }}
                  </a-avatar>
                  <span class="username" v-if="!collapsed">{{ userInfo.nickname || userInfo.username }}</span>
                  <down-outlined class="dropdown-icon" />
                </div>
                <template #overlay>
                  <a-menu>
                    <a-menu-divider />
                    <a-menu-item key="logout" @click="handleLogout">
                      <logout-outlined /> 退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <!-- 如果未登录，显示登录按钮 -->
            <template v-else>
              <a-button type="primary" @click="goToLogin">
                <template #icon><login-outlined /></template>
                登录
              </a-button>
            </template>
          </div>
        </div>
      </a-layout-header>
      <a-layout>
        <a-layout-sider class="sider" v-model:collapsed="collapsed" collapsible>
          <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
            <router-link to="/">
              <a-menu-item key="1">
                <template #icon>
                  <FileSearchOutlined />
                </template>
                信息管理
              </a-menu-item>
            </router-link>
            <a-sub-menu key="sub1">
              <template #icon>
                <BookOutlined />
              </template>
              <template #title>文章管理</template>
              <router-link to="/list">
                <a-menu-item key="2">
                  <template #icon>
                    <BarsOutlined />
                  </template>
                  文章列表
                </a-menu-item>
              </router-link>
              <router-link to="/publish">
                <a-menu-item key="3">
                  <template #icon>
                    <SendOutlined />
                  </template>
                  发布文章
                </a-menu-item>
              </router-link>
            </a-sub-menu>
            <router-link to="/message">
              <a-menu-item key="4">
                <template #icon>
                  <MessageOutlined />
                </template>
                留言管理
              </a-menu-item>
            </router-link>
            <router-link to="/tag">
              <a-menu-item key="5">
                <template #icon>
                  <TagsOutlined />
                </template>
                标签管理
              </a-menu-item>
            </router-link>
            <router-link to="/category">
              <a-menu-item key="6">
                <template #icon>
                  <FolderOpenOutlined />
                </template>
                分类管理
              </a-menu-item>
            </router-link>
            <router-link to="/collect">
              <a-menu-item key="7">
                <template #icon>
                  <FireOutlined />
                </template>
                收藏管理
              </a-menu-item>
            </router-link>
            <router-link to="/comment">
              <a-menu-item key="8">
                <template #icon>
                  <CommentOutlined />
                </template>
                评论管理
              </a-menu-item>
            </router-link>
            <router-link to="/tree-hole">
              <a-menu-item key="9">
                <template #icon>
                  <SlackOutlined />
                </template>
                树洞管理
              </a-menu-item>
            </router-link>
            <!-- 可以添加用户管理菜单 -->
            <router-link to="/users">
              <a-menu-item key="11">
                <template #icon>
                  <TeamOutlined />
                </template>
                用户管理
              </a-menu-item>
            </router-link>
          </a-menu>
        </a-layout-sider>
        <a-layout style="min-height: 100vh">
          <a-layout-content class="content">
            <router-tab></router-tab>
            <router-view>
            </router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { Menu, Modal, message } from 'ant-design-vue';
import { useRouter, useRoute } from "vue-router";
import {
  FileSearchOutlined,
  SendOutlined,
  BarsOutlined,
  BookOutlined,
  CommentOutlined,
  SlackOutlined,
  FolderOpenOutlined,
  FireOutlined,
  MessageOutlined,
  TagsOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  DownOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '../../store/user';

const userStore = useUserStore()
const collapsed = ref(false);
const selectedKeys = ref(['1']);
const current = ref('mail');
const router = useRouter();

// 用户信息
const userInfo = ref({
  username: '',
  avatar: '',
});

// 是否是移动设备
const isMobile = computed(() => {
  return window.innerWidth < 768;
});

const urlmap = [
  { name: '', size: ['1'] },
  { name: 'list', size: ['2'] },
  { name: 'publish', size: ['3'] },
  { name: 'message', size: ['4'] },
  { name: 'tag', size: ['5'] },
  { name: 'category', size: ['6'] },
  { name: 'collect', size: ['7'] },
  { name: 'comment', size: ['8'] },
  { name: 'tree-hole', size: ['9'] },
  { name: 'users', size: ['11'] },
];

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
};

// 处理退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      // 清除用户信息并跳转到登录页
      userInfo.value = null;
      message.success('已安全退出登录');
      userStore.clearUser();
      router.push('/login');
    }
  });
};

onMounted(() => {
  urlmap.forEach((item) => {
    if (item.name === router.currentRoute.value.name) {
      selectedKeys.value = item.size
    }
  });

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768 && !collapsed.value) {
      collapsed.value = true;
    }
  });

  // 初始检查
  if (window.innerWidth < 768) {
    collapsed.value = true;
  }

  userInfo.value.username = userStore.userName
  userInfo.value.avatar = userStore.userAvatar
});

watch(() => router.currentRoute.value.name, (newVal) => {
  urlmap.forEach((item) => {
    if (item.name === newVal) {
      selectedKeys.value = item.size
    }
  })
});
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
  background-color: rgb(240, 242, 245);
  overflow-y: auto;
}

.sider {
  background-color: #ffffff;

  .ant-menu {
    height: 90%;
  }

  .btton {
    display: flex;
    align-items: flex-end;
  }

  :deep(.ant-menu-item-selected) {
    color: rgb(22 119 255) !important;
    background-color: #e6f4ff !important;
  }

  :deep(.ant-menu-item) {
    color: #000;
    background-color: #ffffff;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  :deep(.ant-menu .ant-menu-sub .ant-menu-item) {
    background-color: #fafafa;
  }

  :deep(.ant-layout-sider-trigger) {
    color: #000;
    background-color: #ffffff;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5vh;
  padding: 0 16px 0 24px;
  overflow: hidden;

  .logo {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;

    span {
      margin-left: 0.5rem;
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .user-section {
      margin-left: 16px;

      .user-dropdown-link {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 8px;
        height: 48px;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }

        .user-avatar {
          background-color: #1677ff;
          color: #fff;
        }

        .username {
          margin: 0 8px;
          color: #fff;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-icon {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
        }
      }
    }
  }
}

:deep(.ant-menu-overflow-item) {
  margin: 0 !important;
  background-color: #001529;
  color: #ffffff;

  :hover {}

  .icon {
    margin-right: 0.5rem;
    margin-bottom: -0.15rem;
  }
}

:deep(.header .ant-menu) {
  margin-left: 1rem;
}

:deep(.ant-menu-item-selected) {
  color: #ffffff !important;
  background-color: #1677ff !important;
}

// 响应式调整
@media (max-width: 768px) {
  .header {
    padding: 0 12px;

    .logo span {
      display: none;
    }

    .header-right {
      .user-section {
        .user-dropdown-link {
          .username {
            display: none;
          }
        }
      }
    }
  }
}
</style>