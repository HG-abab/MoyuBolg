<template>
  <div v-slide-in class="card">
    <div class="title">
      <div class="title_text">
        <SvgIcon :class="[isDithering ? 'dithering' : '', isScale ? 'scale' : '']" :name="prefixIcon" width="26" height="26" />
        <span style="margin-left: 8px; color:#000; font-size: 1.2rem">{{ title }}</span>
      </div>
      <div :class="{ 'arrow' : isArrow , 'rotate' : isRotate}" :style="suffixIcon == 'rotate' ? 'cursor: pointer' : ''" @click="invoke">
        <SvgIcon :name="suffixIcon" width="26" height="26" />
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
  // 接收父组件传递过来的参数
  defineProps({
    // 前图标的名字
    prefixIcon: String,
    // 后图标的名字
    suffixIcon: {
      type: String,
      default: '',
    },
    // 是否抖动
    isDithering: {
      type: Boolean,
      default: false,
    },
    // 是否箭头效果
    isArrow: {
      type: Boolean,
      default: false,
    },
    // 是否旋转效果
    isRotate: {
      type: Boolean,
      default: false,
    },
    // 是否放大缩小
    isScale: {
      type: Boolean,
      default: false,
    },
    // 标题
    title: String,
    // 是否是目录
    isCatalog: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['invoke'])

  function invoke() {
    emit('invoke')
    console.log('invoke')
  }
</script>

<style lang="scss" scoped>
.card {
  background-color: var(--mao-bg-content);
  height: 150px;
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
  margin-top: 0.8em;
  overflow: hidden;
  // 添加阴影
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1vh 1vw;
    .title_text{
      display: flex;
      align-items: center;
      .dithering {
        animation: shake 0.3s infinite;
        transform-origin: center;

        @keyframes shake {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-20deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(20deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      }
      .scale {
        animation: scale 1s infinite;
        transform-origin: center;

        @keyframes scale {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      }
    }
    .rotate{
      display: flex;
      align-items: center;
      &:hover{
        animation: rotate 1s infinite;
        @keyframes rotate {
          0%{
            transform: rotate(0);
          }
          50%{
            transform: rotate(360deg);
          }
          100%{
            transform: rotate(0);
          }
        }
      }
    }
    .arrow{
      display: flex;
      align-items: center;
      &:hover{
        animation: move 1s infinite;
        @keyframes move {
          0%{
            transform: translateX(0);
          }
          50%{
            transform: translateX(5px);
          }
          100%{
            transform: translateX(0);
          }
        }
      }
    }
  }
  .content {
    min-height: 5em;
    text-align: center;
    line-height: 12px;
    padding: 2px 10px;
    color: grey;
  }
}

</style>