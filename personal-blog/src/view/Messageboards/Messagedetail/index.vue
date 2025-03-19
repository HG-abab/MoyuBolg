<script setup>
  import { ref, onMounted } from "vue";
  import { ArrowLeftBold } from "@element-plus/icons-vue";
  import router from '@/router';
  import { useRoute } from 'vue-router';
  import { MdEditor, MdPreview } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { ElMessage } from "element-plus";
  import { useColorMode } from "@vueuse/core";
  import comment from "../../../components/comments/index.vue";
  import { getMessageList, likeMessage, collectMessage, isLikeMessage, isCollectMessage } from "@/api/message";
  import dayjs from "dayjs";

  import { useUserStore } from '@/stores/User'
  const userStore = useUserStore()
  const route = useRoute();
  const mode = useColorMode()
  const MessageList = ref({})
  const refresh = async () => {
    await getMessageList(route.params.id).then((res) => {
      if (res.code === 0) {
        MessageList.value = res.data[0]
        MessageList.value.createTime = dayjs(MessageList.value.createTime.createTime).format('YYYY-MM-DD HH:mm:ss')
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  const like = ref(false)
  const favorite = ref(false)
  onMounted(async () => {
    await refresh()
    await isLike()
    await isFavorite()
  })

  // 点赞
  const likeMessageFn = async () => {
    await likeMessage({
      messageId: Number(route.params.id),
      userName: userStore.userName
    }).then((res) => {
      if (res.code === 0) {
        if (!like.value) {
          ElMessage.success('点赞成功')
        } else {
          ElMessage.success('取消点赞')
        }
      } else {
        ElMessage.error(res.message)
      }
    })
    like.value = !like.value
    await refresh()
  }

  // 收藏
  const favoriteMessageFn = async () => {
    await collectMessage({
      messageId: Number(route.params.id),
      userName: userStore.userName
    }).then((res) => {
      if (res.code === 0) {
        if (!favorite.value) {
          ElMessage.success('收藏成功')
        } else {
          ElMessage.success('取消收藏')
        }
      } else {
        ElMessage.error(res.message)
      }
    })
    favorite.value = !favorite.value
    await refresh()
  }

  // 用户是否点赞
  const isLike = async () => {
    await isLikeMessage({
      messageId: Number(route.params.id),
      userName: userStore.userName
    }).then((res) => {
      if (res.code === 0) {
        like.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  // 用户是否收藏
  const isFavorite = async () => {
    await isCollectMessage({
      messageId: Number(route.params.id),
      userName: userStore.userName
    }).then((res) => {
      if (res.code === 0) {
        favorite.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }

</script>

<template>
  <div class="content1">
    <div>
      <el-link :icon="ArrowLeftBold" @click="$router.push('/message')">回到留言列表</el-link>
      <el-divider />
    </div>
    <div class="user">
      <span>
        <el-avatar :src="MessageList.avatar" />
      </span>
      <div class="detail">
        <span class="name">{{ MessageList.userName }}</span>
        <span class="time">{{ MessageList.createTime }}</span>
      </div>
    </div>
    <div class="content">
      <MdPreview :modelValue="MessageList.content" :theme="mode" />
    </div>
    <div class="container">
      <div class="count">
        <div>
          <SvgIcon name="comments" />
          <span>{{ MessageList.commentsCount }}</span>
        </div>
        <div @click="likeMessageFn">
          <SvgIcon v-show="!like" name="like" />
          <SvgIcon v-show="like" name="like-selected" />
          <span>{{ MessageList.likesCount }}</span>
        </div>
        <div @click="favoriteMessageFn">
          <SvgIcon v-show="!favorite" name="collection" />
          <SvgIcon v-show="favorite" name="collection-selected" />
          <span>{{ MessageList.favoritesCount }}</span>
        </div>
      </div>
    </div>
    <el-divider content-position="left" />
    <comment :type="2" :is-show-header="true" :author-Name="MessageList.userName" :type-id="MessageList.id" v-if="MessageList.id" />
  </div>
</template>


<style lang="scss" scoped>
.content1{
  margin: 1.4rem;
  width: 100%;
  .user {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  .detail {
    display: flex;
    flex-direction: column;
    margin-left: 0.4rem;
    }
  .name {
    font-size: 1em;
    margin-bottom: 0.5em;
    color: #0072ff;
    }
  .time {
    font-size: 0.75em;
    color: grey;
    }
  }
  .content {
    margin: 1rem 0;
  }
  .container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
  }
  .count {
    display: flex;
    margin-top: 0.5rem;
    div {
      display: flex;
      align-items: center;
      margin-right: 1rem;
      color: grey;
    }
    span {
      margin-left: 0.2rem;
    }
  }
}

:deep(.md-editor-toolbar-left) {
  flex-wrap: wrap;
}
</style>