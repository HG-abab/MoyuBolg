<template>
  <div v-slide-in class="Avatar">
    <div class="elavatar" :style="{ backgroundImage: 'url(' + webInfo.webmasterProfileBackground + ')' }">
      <div style="display: flex;justify-content: center;align-items: center;">
        <el-avatar :src="webInfo.avatar" :size="80" />
      </div>
      <div class="username">
        {{ webInfo.name }}
      </div>
      <div class="truncate ">
        {{ webInfo.copy }}
      </div>
    </div>
    <div class="quantity">
      <div>
        <span>{{ webInfo.articleCount || 0 }}</span>
        <span>文章数</span>
      </div>
      <el-divider direction="vertical" style="font-size: 2.4rem;" />
      <div>
        <span>{{ webInfo.categoryCount  }}</span>
        <span>分类数</span>
      </div>
      <el-divider direction="vertical" style="font-size: 2.4rem" />
      <div>
        <span>{{ webInfo.commentCount  }}</span>
        <span>评论数</span>
      </div>
    </div>
    <div class="icon">
      <a :href="webInfo.githubLink" target="_blank">
        <div>
          <SvgIcon name="github_icon" width="24px" height="24px" />
        </div>
      </a>
      <a :href="webInfo.giteeLink" target="_blank">
        <div>
          <SvgIcon name="gitee_icon" width="24px" height="24px" />
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/User';
import { userInfo } from '../../api/user';

const userStrore = useUserStore()
const webInfo = ref({})
onMounted(async () => {
  console.log(userStrore.userId)
  const res = await userInfo(
    userStrore.userId
  )
  if (res.code === 0) {
    webInfo.value = res.data
  } else {
    ElMessage.error(res.message)
  }
})
</script>

<style lang="scss" scoped>
.Avatar {
  width: 99%;
  height: 300px;
  background-color: var(--mao-bg-content);
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);

  .elavatar {
    border-radius: 5px;
    height: 190px;
    background-size: cover;

    .el-avatar {
      margin: 25px 0 10px 0;
      transition: all 1s;
      transform: rotate(0deg);

      &:hover {
        transition: all 1s;
        transform: rotate(360deg);
      }
    }

    .username {
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
      color: #ffffff;
    }

    .truncate {
      display: flex;
      justify-content: center;
      color: rgb(181, 182, 183);
      font-size: 0.8rem;
      padding: 1.2vw 0;
    }
  }
}

.quantity {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 0.6rem;

  div {
    display: flex;
    align-items: center;
    flex-direction: column;

    span {
      font-size: 1.2rem;
    }

    span:last-child {
      margin-top: 1.3vh;
      color: grey;
      font-size: 1.1rem;
    }
  }
}

.icon {
  display: flex;
  padding: 15px 5px;

  div {
    padding-right: 10px;
  }
}
</style>