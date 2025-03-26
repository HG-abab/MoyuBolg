<script setup>
  import Treeholesimg from '@/assets/imgs/Treeholes.png'
  import { ElMessage } from 'element-plus'
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/stores/User'
  import { treeHoleList, createTreeHole } from '@/api/tree-hole'
  import Danmaku from 'danmaku-vue'

  const userStore = useUserStore()
  const isShowSubmit = ref(false)
  const content = ref('')

  const TreeholesList = ref([{}])
  const refresh = async () => {
    await treeHoleList().then((res) => {
      if (res.code === 0) {
        TreeholesList.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
  }

  onMounted(async () => {
    await refresh()
  })

  const addTreeHoleBtn = async () => {
    if (content.value === '') {
      ElMessage.warning('请输入内容')
      return;
    }

    await createTreeHole({
      userName: userStore.username,
      avatar: userStore.useravatar,
      content: content.value
    }).then((res) => {
      if (res.code === 0) {
        refresh()
      } else {
        ElMessage.error(res.msg)
      }
    })

    ElMessage.success('添加成功')
    content.value = ''
  }

</script>


<template>
  <div class="container" :style="{
        'background-image': 'url(' + Treeholesimg + ')'
      }">
    <div class="content_container">
      <div class="title">树洞</div>
      <div>
        <input v-model="content" @focus="isShowSubmit = true" type="text" placeholder="在这里留下自己的足迹吧...">
        <button v-show="isShowSubmit" @click="addTreeHoleBtn()">
          <span style="color: grey;font-style: italic;font-weight: bold">提交</span>
        </button>
      </div>
    </div>
    <Danmaku :debounce="2000" randomChannel :speeds="80" :channels="5" isSuspend v-model:danmus="TreeholesList" useSlot loop style="height:100vh; width:100vw;">
      <template v-slot:dm="{ danmu }">
        <div class="barrage_container" v-if="danmu.isCheck">
          <div>
            <el-avatar :src="danmu.avatar" />
          </div>
          <div><span>{{ danmu.userName }}：</span><span>{{ danmu.content }}</span></div>
        </div>
      </template>
    </Danmaku>

  </div>
</template>

<style lang="scss" scoped>
.container{
  background-size: cover;
  background-position: center;
  min-width: 100vw;
  height: 100vh;
  .content_container{
    position: absolute;
    top: 40%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
    .title{
      color: white;
      font-size: 2rem;
      font-weight: bold;
      text-shadow: 0 0 10px #000;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.2rem;
    }
     & div:last-child {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
      input{
        width: 16rem;
        height: 2rem;
        border: #409EFF solid 1px;
        border-radius: 1rem;
        padding: 0 1rem;
        font-size: 1rem;
        background-color: rgba(255, 255, 255, 0.2)
      }
      input::placeholder {
        color: white;
        font-style: italic;
      }
    }
    button {
      width: 5rem;
      height: 2rem;
      border-radius: 1rem;
      margin-left: 0.5rem;
      background-color: rgba(255, 255, 255, 0.2);
      border: #409EFF solid 1px;
      color: white;
      font-size: 1rem;
      &:hover {
        background-color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
      }
    }
  }
}

// 弹幕
.barrage_container{
  display: flex;
  align-items: center;
  position: relative;
  &::after {
    background: red;
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0.2em;
    border-radius: 0.1em;
    background: linear-gradient(to right, #00c6ff, #0072ff);
    transition: width 0.3s ease; /* 过渡动画效果 */
  }
  &:hover::after {
     width: 100%;
  }
  div:last-child span:first-child {
    margin-left: 0.5rem;
    color: white;
    font-weight: bold;
  }
  div:last-child span:last-child {
    color: #000;
    font-size: 1.2rem;
  }
  div:last-child {
      border-bottom: 1px solid #ebebeb;
      padding: 0.5rem;
      margin-left: 0.5rem;
      border-radius: 15px;
      background-color: rgba(255, 255, 255, 0.2);
    }
    div:nth-child(1) {
      transform: scale(1.0);
      transition: all 0.3s ease-in-out;
      &:hover {
        transform: scale(1.5);
        cursor: pointer;
      }
    }
}

</style>