<template>
  <div>
    <div class="imgs">
      <div class="item" v-for="item in imageList" :key="item.id" :style="{
        'background-image': 'url(' + item.url + ')'
      }">
      </div>
    </div>
    <div class="title">
      <div class="name">
        <p>{{title}}</p>
      </div>
      <div class="background" ref="background">
        <div class="typewriter">
          <span class="text-content">{{ currentText }}</span>
          <span class="typewriter-cursor">|</span>
        </div>
      </div>
    </div>
    <!-- 海波 -->
    <div class="hypo">
      <Hypo />
    </div>
    <!-- 向下按钮 -->
    <SvgIcon class="arrow-down" name="jt_x" color="#e0dfde" width="50px" height="50px" @click="scrollDown" />
  </div>
  <div class="bg">
    <Main />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import Hypo from '../../components/Hypo/index.vue'
  import Main from '@/view/Main/index.vue'
  import Foter from '../../components/Foter/index.vue'
  import BRightLayout from '../../components/BRightLayout/index.vue'
  import { getBackground, getWebInfo } from '../../api/information'
  import { ElMessage } from 'element-plus'

  const imageList = ref();

  const GetBackground = async () => {
    await getBackground().then(res => {
      if (res.code === 0) {
        imageList.value = res.data;
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  const fullText = ref("");
  const currentText = ref("");
  const background = ref(null);
  const title = ref('');
  let index = 0;

  onMounted(async () => {
    getText()
    setTimeout(typeWriter, 1000);
    await GetBackground()
  });

  const getText = async () => {
    await getWebInfo().then(res => {
      if (res.code === 0) {
        fullText.value = res.data.headerNotification;
        title.value = res.data.websiteName;
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  function updateBackgroundWidth(width) {
    if (background.value) {
      background.value.style.width = `${width}px`;
    }
  }

  let typingTimeout; // 用于存储当前定时器ID

  // 处理打字效果
  function typeWriter() {
    getText(); // 获取文本内容

    if (index < fullText.value.length) {
      currentText.value += fullText.value.charAt(index);
      index++;
      updateBackgroundWidth(currentText.value.length * 30);

      // 清除之前的定时器，避免重复定时器积累
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(typeWriter, 300);
    } else {
      // 打字完成后延迟删除文本
      clearTimeout(typingTimeout);  // 清除定时器
      typingTimeout = setTimeout(deleteText, 1000);
    }
  }

  // 处理删除文本效果
  function deleteText() {
    if (index > 0) {
      currentText.value = currentText.value.slice(0, -1);
      index--;
      updateBackgroundWidth(currentText.value.length * 30);

      // 清除之前的定时器，避免重复定时器积累
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(deleteText, 300);
    } else {
      // 删除完成后延迟打字
      clearTimeout(typingTimeout);  // 清除定时器
      typingTimeout = setTimeout(typeWriter, 1000);
    }
  }

  // 组件销毁时清理定时器，防止内存泄漏
  function clearTypingTimeout() {
    clearTimeout(typingTimeout);
  }


  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.93,
      behavior: 'smooth' // 平滑滚动
    });
  }

</script>

<style lang="scss" scoped>
.imgs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -9;
  background-color: #363636;
  overflow: hidden;

  .item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: no-repeat 50% 50% / cover;
    opacity: 0;
    // 一张图片 6s
    animation: imageAnimation 30s linear infinite 0s;
    backface-visibility: hidden;
    transform-style: preserve-3d;

    &:nth-child(2) {
      animation-delay: 6s;
    }

    &:nth-child(3) {
      animation-delay: 12s;
    }

    &:nth-child(4) {
      animation-delay: 18s;
    }

    &:nth-child(5) {
      animation-delay: 24s;
    }

    &:nth-child(6) {
      animation-delay: 30s;
    }
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    transition: all .2s ease-in-out 0s;
  }
}

.title{
  position: fixed; 
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
  .name{
  display: flex;
  justify-content: center;
  color: #fff;
  font-size: 4.5rem;
  font-weight: bold;
  padding: 8px 0;
  z-index: 9;
  text-shadow:
    0 0.5px 0 hsl(174, 5%, 80%), 0 1px 0 hsl(174, 5%, 75%),
    0 1.5px 0 hsl(174, 5%, 70%), 0 2px 0 hsl(174, 5%, 66%),
    0 2.5px 0 hsl(174, 5%, 64%), 0 3px 0 hsl(174, 5%, 62%),
    0 3.5px 0 hsl(174, 5%, 61%), 0 4px 0 hsl(174, 5%, 60%),
    0 0 2px rgba(0, 0, 0, 0.05), 0 0.5px 1.5px rgba(0, 0, 0, 0.2),
    0 1.5px 2.5px rgba(0, 0, 0, 0.2), 0 2.5px 5px rgba(0, 0, 0, 0.2),
    0 5px 5px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.3);
  }
  .background{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.5);
    min-width: 0; // 设置一个最小宽度，确保左边有足够的空间
    padding: 1rem;
    border-radius: 0.5rem;
    overflow: hidden; // 隐藏超过背景宽度的文字
    white-space: nowrap; // 确保文字在一行内
    display: flex;
    justify-content: center;
    .typewriter{
    letter-spacing: 0.1em;
    background: linear-gradient(90deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    font-size: 1.6rem;
    .typewriter-cursor{
      opacity: 0;
      animation: blink 0.7s infinite;
      background: linear-gradient(90deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  }
}

.arrow-down {
  position: absolute;
  left: 48.4%;
  transform: translateX(-50%);
  bottom: 25vh;
  -webkit-animation: arrow-shake 1.5s ease-out infinite;
  animation: arrow-shake 1.5s ease-out infinite;
  cursor: pointer;
  z-index: 8;
}
.bg {
  // 过渡时间
  transition: all 1s ease !important;
  background-color: var(--mao-background-color);
}

@keyframes arrow-shake {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  30% {
    opacity: 0.5;
    transform: translateY(25px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes imageAnimation {
  0% {
    opacity: 0;
    animation-timing-function: ease-in;
  }

  2% {
    opacity: 1;
  }

  8% {
    opacity: 1;
    transform: scale(1.05);
    animation-timing-function: ease-out;
  }

  17% {
    opacity: 1;
    transform: scale(1.1);
  }

  25% {
    opacity: 0;
    transform: scale(1.1);
  }

  100% {
    opacity: 0;
  }
}

// 打字机
@keyframes blink {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

</style>
