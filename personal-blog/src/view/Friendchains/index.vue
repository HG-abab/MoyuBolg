<script setup>
  import containerbg from '@/assets/imgs/card04.jpg';
  import { onMounted, reactive, ref, watch } from 'vue';
  import Foter from '@/components/Foter/index.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getLinkList, createLink } from '@/api/link';
  import { useUserStore } from '@/stores/User'
  const userStore = useUserStore()


  const route = useRoute();
  const articlesList = ref();
  const isQueryArticle = ref(false);
  const title = ref('');
  const dialogVisible = ref(false)


  const form = reactive({
    name: '',
    url: '',
    description: '',
    background: '',
    email: '',
    type: '1'
  })

  const ruleFormRef = ref()

  const links = ref([])
  const getLink = async () => {
    await getLinkList().then(res => {
      if (res.code === 0) {
        links.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
  }

  onMounted(async () => {
    await getLink()
  })


  const rules = reactive({
    name: [
      { required: true, message: '请填写网站名称', trigger: 'blur' },
      { min: 3, max: 15, message: '长度小3，最大15', trigger: 'blur' },
    ],
    url: [
      { required: true, message: '请填写网站地址', trigger: 'blur' },
      { min: 3, max: 50, message: '长度小3，最大50', trigger: 'blur' },
    ],
    description: [
      { required: true, message: '请填写网站描述', trigger: 'blur' },
      { min: 3, max: 30, message: '长度小3，最大15', trigger: 'blur' },
    ],
    background: [
      { required: true, message: '请填写友链背景图链接', trigger: 'blur' },
      { min: 3, max: 100, message: '长度小3，最大100', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请填写电子邮件地址', trigger: 'blur' },
      { min: 3, max: 20, message: '长度小3，最大15', trigger: 'blur' },
    ]
  })

  // 提交按钮
  function applyLinkFunc() {
    if (!ruleFormRef) return
    ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        ElNotification({
          title: '成功',
          showClose: false,
          duration: 6000,
          message: '友链申请提交成功，待通过审核后会通过邮件通知您，请注意查收',
          type: 'success',
        })
        await createLink({
          ...form,
          userName: userStore.userName
        }).then(async (res) => {
          await getLink()
        })
        dialogVisible.value = false
      } else {
        return false
      }
    })
  }

</script>

<template>
  <div class="common-layout">
    <div class="header">
      <div class="img_text">
        <img :src="containerbg" alt="" class="img">
        <div class="title">
          <div class="title_text">友链</div>
          <div class="title_text2">link</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div v-if="!isQueryArticle" style="display: flex;justify-content: center;align-items: center;">
        <div class="category_container">
          <div class="title">
            <div class="left">
              友链
            </div>
            <div class="right">
              <el-button type="primary" :icon="Watermelon" plain @click="dialogVisible = true" style="margin-right: 1rem">申请友链</el-button>
            </div>
          </div>
          <el-divider />
          <div class="title_content">
            <span style="font-size: 1rem;color: grey">欢迎访问友链板块！</span>
            <span>友链板块是一个旨在促进不同系统间相互协作和交流的平台。通过友链板块，您可以：</span>
            <span>1、分享自己系统的介绍和链接。</span>
            <span>2、发现更多的优秀博客网站。</span>
            <span style="font-size: 1rem;color: grey">注意：</span>
            <span>1、友链申请前必须先登录本网站，申请通过后会通过邮件的形式通知你。</span>
            <span>2、点击网站的名称进行友链跳转。</span>
          </div>
          <div class="link">
            <template v-for="link in links" :key="link.id">
              <div v-slide-in class="item" v-if="link.isCheck">
                <div class="bg" :style="{background: `url(${link.background})`}"></div>
                <div class="content_link">
                  <div>
                    <el-avatar v-lazy="link.avatar" />
                    <div class="name"><a :href="link.url">{{ link.name }}</a></div>
                  </div>
                  <div class="description">{{ link.description }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 申请显示 -->
  <el-dialog v-model="dialogVisible" title="申请友链" width="35%" style="border-radius: 15px" :close-on-click-modal="false" :lock-scroll="false">
    <div class="form">
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="请输入网站名称" maxlength="15" show-word-limit>
            <template #prepend>
              网站名称
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="url">
          <el-input v-model="form.url" placeholder="请输入网站地址" maxlength="50" show-word-limit>
            <template #prepend>
              网站地址
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="description">
          <el-input v-model="form.description" placeholder="请输入网站描述" maxlength="30" show-word-limit>
            <template #prepend>
              网站描述
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="background">
          <el-input v-model="form.background" placeholder="请提供http地址" maxlength="100" show-word-limit>
            <template #prepend>
              背景图片
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="填写邮箱地址" maxlength="20" show-word-limit>
            <template #prepend>
              邮箱地址
            </template>
          </el-input>
        </el-form-item>
        <div style="width: 100%;display: flex;flex-direction: row-reverse">
          <el-button type="primary" plain @click="applyLinkFunc">提交申请</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <Foter />
</template>

<style lang="scss" scoped>
.common-layout {
  .header {
    height: 50vh;
    .img_text {
      position: relative;
      .img {
        width: 100%;
        height: 50vh;
        object-fit: cover;
      }
      .title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-family: 'Open Sans', sans-serif;
      }
      .title_text {
        margin: 3vh 0;
        color: white;
        font-size: 4.6rem;
        font-weight: normal;
        text-shadow: 0 1px 0 hsl(174, 5%, 80%), 0 2px 0 hsl(174, 5%, 75%),
        0 3px 0 hsl(174, 5%, 70%), 0 4px 0 hsl(174, 5%, 66%),
        0 5px 0 hsl(174, 5%, 64%), 0 6px 0 hsl(174, 5%, 62%),
        0 7px 0 hsl(174, 5%, 61%), 0 8px 0 hsl(174, 5%, 60%),
        0 0 5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2),
        0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.2),
        0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.3);
      }
        $shadow: #be1d7b;
        $red: #5e0c01;
        $green: #14bbc7;
        $yellow: #ae8b17;
        $shadow: #35262f;
      .title_text2 {
        font-size: 1.5rem;
        transform: skew(-10deg);
        text-shadow: $shadow 1px 1px, $shadow 2px 2px, $shadow 3px 3px,
        $shadow 4px 4px, $shadow 5px 5px, $shadow 6px 6px;
        &:nth-child(1) {
          color: $red;
        }
        &:nth-child(2) {
          color: $green;
        }
        &:nth-child(3) {
          color: $yellow;
        }
      }
    }
  }
  .main {
    min-height: 50vh;
     background-color: var(--mao-background-color);
    .category_container{
      width: 80%;
      min-height: 30vh;
      margin: 15vh 0;
      background-color: var(--mao-bg-content);
      border-radius: 10px;
      box-shadow: 0 0 10px #0003;
      padding: 1rem;
      .title{
        font-size: 1.72rem;
        padding: 1rem;
        color: var(--mao-hearder-color);
        font-weight: 600;
        display: flex;
        align-self: center;
        justify-content: space-between;
      }
      .title_content {
        font-weight: bold;
        font-size: 0.8rem;
        color: #999;
        display: flex;
        flex-direction: column;
        background: var(--mao-bg-message);
        padding: 1rem;
        border-radius: 15px;
        margin-bottom: 1rem;
        span {
        margin-bottom: 1rem;
        line-height: 1rem;
        }
      }
      .link{
        display: flex;
        flex-wrap: wrap;
        transition: all 0.3s ease-in-out;
        .item {
          margin: 0.5rem;
          width: calc(100% / 3 - 1.1rem);
          height: 13rem;
          border: #0072ff 1px solid;
          border-radius: 15px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s ease-in-out;
          @media screen and (max-width: 830px) {
            width: calc(100% / 2 - 1rem);
          }
          @media screen and (max-width: 580px) {
            width: calc(100% - 1rem);
          }
          &:hover {
            .content_link {
              height: 50%;
              background: #0072ff;
              .name {
                color: #fdeeee;
              }
              .description {
                color: #fdeeee;
              }
            }
            .bg {
              height: 50%;
              filter: blur(2px);
            }
          }
          .bg {
            transition: all 0.3s ease-in-out;
            background-size: cover !important;
            background-position: center !important;
            width: 100%;
            height: 65%;
          }
          .content_link {
            transition: all 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            align-items: center;
            //background: white;
            height: 35%;
            width: 100%;
            padding: 0.5rem 0;
             div {
              display: flex;
              align-items: center;
              justify-content: center;
              .el-avatar {
                width: 2.5rem;
                height: 2.5rem;
                margin-left: -2rem;
              }
              .name {
                font-size: 1rem;
                font-weight: bold;
                margin-left: 0.5rem;

                a {
                  color: inherit;
                  text-decoration: none;
                  cursor: pointer;
                }
              }
            }
            .description {
              line-height: 1rem;
              width: 15rem;
              font-size: 0.85rem;
              margin-left: 0.5rem;
              margin-top: 0.5rem;
              color: #7C7C7C;
            }
          }
        }
      }
    }
  }
}
</style>
