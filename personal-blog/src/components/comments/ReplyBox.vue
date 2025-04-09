<script setup>
import { ref } from "vue"
import { useColorMode } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import { addComment } from '@/api/comment'
import { useUserStore } from '@/stores/User'

const userStore = useUserStore()

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
})

const Input = ref('')
const mode = useColorMode();
const replyText = ref('')
const optionsName = {
  "Smileys & Emotion": "笑脸&表情",
  "Food & Drink": "食物&饮料",
  "Animals & Nature": "动物&自然",
  "Travel & Places": "旅行&地点",
  "People & Body": "人物&身体",
  Objects: "物品",
  Symbols: "符号",
  Flags: "旗帜",
  Activities: "活动",
}


const clickEmoji = (emoji) => {
  replyText.value += emoji
}

const addChildComment = async (vlaues) => {
  if (!replyText.value) {
    ElMessage.error('评论内容不能为空')
    return
  }
  await addComment({
    Avatar: userStore.useravatar,
    commentTitle: vlaues.commentTitle,
    commentUserName: userStore.username,
    type: vlaues.type,
    typeId: vlaues.typeId,
    commentContent: replyText.value,
    parentId: vlaues.id,
  }).then((res) => {
    if (res.code === 0) {
      ElMessage.success('评论成功')
      replyText.value = ''
    } else {
      ElMessage.error(res.msg)
    }
  })
}
</script>

<template>
  <div class="reply">
    <textarea style="color: #7B5F69;" ref="Input" v-model="replyText" :placeholder="'@' + comment.commentUserName" />
    <div>
      <div ref="emojiBtn" class="emojiBtn">
        <V3Emoji :recent="true" :theme="mode" @click-emoji="clickEmoji" :options-name="optionsName" />
        <el-button type="danger" plain size="small" @click="addChildComment(comment)">发布</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reply {
  padding-right: 1rem;

  textarea {
    height: 1rem;
    width: 100%;
    transition: height 0.5s;
    border: 1px solid #ebebeb;
    border-radius: 0.5rem;
    padding: 0.5rem;
    resize: none;
    outline: none;
    font-size: 0.8rem;
    margin-top: 1rem;
    background: #f8f8f8;

    &:focus {
      height: 3rem;
    }

    &::-webkit-input-placeholder {
      padding-left: 0.5rem;
      font-size: 0.8rem;
      font-weight: bold;
      color: #7B5F69;
    }
  }

  .emojiBtn {
    display: flex;
    align-items: center;
    margin: 2rem 0;
  }
}
</style>