<template>
  <div v-slide-in class="Avatar">
    <div class="elavatar" :style="{ backgroundImage: 'url(' + webInfo.webmasterProfileBackground + ')' }">
      <div style="display: flex;justify-content: center;align-items: center;">
        <el-avatar :src="webInfo.webmasterAvatar" :size="80" />
      </div>
      <div class="username">
        {{ webInfo.webmasterName }}
      </div>
      <div class="truncate ">
        {{ webInfo.webmasterCopy}}
      </div>
    </div>
    <div class="quantity">
      <div>
        <span>{{webInfo.articleCount}}</span>
        <span>文章数</span>
      </div>
      <el-divider direction="vertical" style="font-size: 2.4rem;" />
      <div>
        <span>{{cleCount}}</span>
        <span>分类数</span>
      </div>
      <el-divider direction="vertical" style="font-size: 2.4rem" />
      <div>
        <span>{{comCount}}</span>
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
  import Avatar from '@/assets/imgs/Avatar.jpg';
  import { getWebInfo } from '../../api/information'
  import { getCategoriesCount } from '../../api/category'
  import { getCommentCount } from '../../api/comment'
  import { onMounted, ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const webInfo = ref({})
  const cleCount = ref(0)
  const comCount = ref(0)
  onMounted(async () => {
    await getWebInfo().then(res => {
      if (res.code === 0) {
        webInfo.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
    await getCategoriesCount().then(res => {
      if (res.code === 0) {
        cleCount.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
    await getCommentCount().then(res => {
      if (res.code === 0) {
        comCount.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
</script>

<style lang="scss" scoped>
.Avatar{
  width: 99%;
  height: 300px;
  background-color: var(--mao-bg-content);
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  .elavatar{
    border-radius: 5px;
    height: 190px;
     background-size: cover;
    .el-avatar{
      margin: 25px 0 10px 0;
      transition: all 1s;
      transform: rotate(0deg);
      &:hover{
        transition: all 1s;
        transform: rotate(360deg);
      }
    }
    .username{
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
      color: #ffffff;
    }
    .truncate{
      display: flex;
      justify-content: center;
      color: rgb(181, 182, 183);
      font-size: 0.8rem;
      padding: 1.2vw 0;
    }
  }
}
.quantity{
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 0.6rem;
    div {
      display: flex;
      align-items: center;
      flex-direction: column;

      span {
        font-size:1.2rem;
      }

      span:last-child {
        margin-top: 1.3vh;
        color: grey;
        font-size:1.1rem;
      }
    }
  }

  .icon {
    display: flex;
    padding: 15px 5px;
    div{
      padding-right: 10px;
    }
  }
</style>