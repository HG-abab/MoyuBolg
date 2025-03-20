<template>
  <div class="auth-callback-container">
    <el-result icon="success" title="登录处理中">
      <template #extra>
        <el-icon class="is-loading" :size="20">
          <Loading />
        </el-icon>
        <p>正在处理第三方授权信息...</p>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/User'

const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

onMounted(() => {
  handleGitHubCallback()
})

const handleGitHubCallback = () => {
  const token = route.query.token
  const user = route.query.user
  const userInfo = JSON.parse(atob(user))
  if (token) {
    // 存储token并跳转
    userStore.settoken(token)
    userStore.setusername(userInfo.name)
    userStore.setuseravatar(userInfo.avatar)
    ElMessage.success('第三方登录成功')
    router.replace('/')
  } else {
    ElMessage.error('授权失败，请重试')
    router.replace('/login')
  }
}
</script>

<style scoped>
.auth-callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.el-result {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>