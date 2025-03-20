<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { resetPasswordByToken } from '../../api/auth';

const password = ref('');
const router = useRouter();

// 提交表单
const handleSubmit = async () => {
  try {
    if (!password.value) {
      ElMessage.error('请输入新密码');
      return;
    }

    // 检查密码长度是否大于6
    if (password.value.length <= 6) {
      ElMessage.error('密码长度必须大于6');
      return;
    }

    await resetPasswordByToken({
      token: router.currentRoute.value.query.token,
      newPassword: password.value,
    }).then((res) => {
      if (res.code === 0) {
        console.log(res);
        ElMessage.success('密码重置成功');
        router.push('/login');
      } else {
        ElMessage.error(res.message);
      }
    });
  } catch (error) {
    ElMessage.error('密码重置失败');
  }
};
</script>

<template>
  <div class="request-reset-password">
    <div class="card">
      <h2 class="title">重置密码</h2>
      <p class="description">请输入您的新密码</p>

      <!-- 表单 -->
      <form @submit.prevent="handleSubmit">
        <div class="input-container">
          <label for="password">新密码</label>
          <input type="password" id="password" v-model="password" placeholder="请输入您的新密码" required />
        </div>
        <div class="button-container">
          <button type="submit">发送重置密码</button>
        </div>
      </form>

      <p class="footer-text">
        已有账户? <router-link to="/login" class="link">登录</router-link>
      </p>
    </div>
  </div>
</template>


<style scoped lang="scss">
.request-reset-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;

  .card {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;

    .title {
      text-align: center;
      font-size: 24px;
      color: #333;
      margin-bottom: 1rem;
    }

    .description {
      text-align: center;
      color: #666;
      margin-bottom: 1.5rem;
    }

    form {
      display: flex;
      flex-direction: column;

      .input-container {
        margin-bottom: 1rem;

        label {
          font-size: 14px;
          color: #333;
          margin-bottom: 0.5rem;
        }

        input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          outline: none;
          transition: all 0.3s ease-in-out;

          &:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
          }
        }
      }

      .button-container {
        margin-top: 1rem;

        button {
          width: 100%;
          padding: 12px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #2980b9;
          }
        }
      }
    }

    .footer-text {
      text-align: center;
      margin-top: 1rem;
      font-size: 14px;

      .link {
        color: #3498db;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
