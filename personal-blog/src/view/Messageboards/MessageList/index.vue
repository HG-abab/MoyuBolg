<script setup>
  import dayjs from "dayjs";
  import { ref, onMounted } from "vue";
  import { MdEditor } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { ElMessage } from "element-plus";
  import { useColorMode } from "@vueuse/core";
  import { ArrowRightBold } from "@element-plus/icons-vue";
  import { getMessageList, createMessage } from "@/api/message";
  import { useUserStore } from '@/stores/User'
  const userStore = useUserStore()

  const mode = useColorMode()
  const isShow = ref(false)
  const text = ref('')
  // 工具栏
  const toolbars = ref([
    'bold',
    'underline',
    'italic',
    'title',
    'strikeThrough',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'pageFullscreen',
    'preview',
    'catalog',
  ])
  // 将插槽中的组件下标放到对应的位置即可显示
  const footers = [0, 1, '=', 'scrollSwitch'];
  // 字数
  const wordCount = ref(0);
  const commentsList = ref([])
  const getCommentsList = async () => {
    await getMessageList().then(res => {
      if (res.code === 0) {
        commentsList.value = res.data
        commentsList.value.forEach(item => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        })
      } else {
        ElMessage.error(res.msg)
      }
    })
  }

  onMounted(async () => {
    await getCommentsList()
  })

  // 提交
  const addLeaveWord = async () => {
    if (text.value === '') {
      ElMessage.warning('请输入留言内容')
      return
    } else {
      await createMessage({
        userName: userStore.userName,
        avatar: userStore.userAvatar,
        content: text.value
      }).then(res => {
        if (res.code === 0) {
          text.value = ''
          getCommentsList()
          ElMessage.success('留言成功')
        } else {
          ElMessage.error(res.msg)
        }
      })
      isShow.value = false
    }
  }
  function mdContent(content) {
    if (content.length > 2000) {
      content = content.slice(0, 2000)
      ElMessage.warning('字数超过限制，自动截取前2000字')
    }
    text.value = content
    wordCount.value = content.length
  }


</script>

<template>
  <div class="content">
    <div>
      <div class="title">
        <div>留言板</div>
        <el-button type="primary" plain @click="isShow = true">留言</el-button>
      </div>
      <el-divider />
      <div class="title_content">
        <span>欢迎访问留言板板块！</span>
        <span>留言板是一个方便与其他用户交流、分享观点和意见的平台。通过留言板，您可以：</span>
        <span>1、留下自己的留言：无论是对特定主题的讨论、对某篇文章的评论，还是向其他用户提问，您都可以在留言板上发表自己的留言。</span>
        <span>2、回复其他用户：看到其他用户的留言后，您可以进行回复和互动，分享自己的观点，提供帮助或者表达共鸣。</span>
        <span>3、进行在线交流：留言板不仅是一个留言的平台，还是一个与其他用户进行实时交流的地方。您可以通过留言板与他人进行私聊，分享更多的讨论和信息。</span>
        <span>支持：普通文档，markdown</span>
      </div>
    </div>
    <!-- 留言部分 -->
    <div>
      <el-drawer size="45%" v-model="isShow" direction="rtl" :with-header="false">
        <div>
          <MdEditor :theme="mode" style="height: 90vh" :footers="footers" v-model="text" :toolbars="toolbars" no-upload-img :preview="false" :on-change="mdContent">
            <template #defFooters>
              <div style="height: 100%;display: flex;align-items: center;">
                <span style="margin: 0 1rem">字数：{{ wordCount }}</span>
                <span>字数限制：2000</span>
              </div>
            </template>
          </MdEditor>
          <div style="margin-top: 1rem;float: right">
            <el-button type="primary" @click="addLeaveWord" plain>提交</el-button>
          </div>
          <div style="margin-top: 1rem;margin-right: 1rem;float: right" @click="isShow = false">
            <el-button type="warning" plain>关闭</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
    <div>
      <div class="title">留言列表</div>
      <div class="form">
        <template v-for="item in commentsList">
          <el-card class="box-card" shadow="hover" v-slide-in>
            <template #header>
              <div class="card-header">
                <span>
                  <el-avatar :src="item.avatar" />
                </span>
                <span class="name">{{item.userName}}</span>
                <span class="time">{{item.createTime}}</span>
              </div>
            </template>
            <div class="text">
              {{item.content}}
            </div>
            <div class="bottom">
              <div class="count">
                <div>
                  <SvgIcon name="comments" />
                  <span>{{item.commentsCount}}</span>
                </div>
                <div>
                  <SvgIcon name="like" />
                  <span>{{item.likesCount}}</span>
                </div>
                <div>
                  <SvgIcon name="collection" />
                  <span>{{item.favoritesCount}}</span>
                </div>
              </div>
              <div>
                <el-link type="primary" @click="$router.push(`/message/detail/${item.id}`)">
                  <template #icon>
                    <el-icon>
                      <ArrowRightBold />
                    </el-icon>
                  </template>
                  查看详情
                </el-link>
              </div>
            </div>
          </el-card>
        </template>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.content{
  margin: 1.4rem;
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .title_content {
    font-weight: bold;
    font-size: 0.8rem;
    color: #999;
    display: flex;
    flex-direction: column;
    background: var(--mao-bg-message);
    padding: 0.8rem;
    border-radius: 15px;
    margin-bottom: 1rem;
    span {
      margin-bottom: 1rem;
      line-height: 1rem;
    }
  }
}

.box-card{
  margin-top: 1rem;
  font-size: 0.9rem;
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    color: grey;
    .count {
      display: flex;
      margin-top: 0.5rem;
      div {
        display: flex;
        align-items: center;
        margin-right: 1rem;
      }
      span {
        margin-left: 0.2rem;
      }
    }
  }
  .text {
    margin-bottom: 1rem;
  }
}

 .card-header {
    display: flex;
    align-items: center;

    .name {
      margin-left: 0.5rem;
      font-size: 1.3rem;
    }

    .time {
      flex: 1;
      text-align: right;
      margin-left: 1rem;
      font-size: 0.85rem;
      color: #999;
    }
  }
</style>