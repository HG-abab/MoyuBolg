<template>
  <div class="nav-item" @mouseover="showForm = true" @mouseleave="showForm = false">
    <el-icon class="elicon" :size="18">
      <IceCreamRound />
    </el-icon>
    <span class="text">其他</span>
    <SvgIcon name="jt_x" class="svgIcon" style="margin-left: 5px"></SvgIcon>
    <transition name="slide-fade">
      <div v-if="showForm" class="hover-form">
        <ul>
          <a href="/treeHoles" style="color: #000">
            <li>
              <span class="icon-folder">
                <el-icon>
                  <Fries />
                </el-icon>
                树洞
              </span>
            </li>
          </a>
          <a href="/Message" style="color: #000">
            <li>
              <span class="icon-tag">
                <el-icon>
                  <EditPen />
                </el-icon>
                留言板
              </span>
            </li>
          </a>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { Fries, EditPen, Tools, IceCreamRound } from "@element-plus/icons-vue";


  const showForm = ref(false);
</script>

<style scoped lang="scss">
  .nav-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    height: 50px;
    position: relative;
    cursor: pointer;
    &:hover .svgIcon {
    transform: rotate(180deg);
    transition: transform 0.5s linear; /* 添加过渡效果 */
    fill: #cc5de8;
  }
    .svgIcon {
      fill: #5f9cdf;
      transform: rotate(0deg); /* 初始状态 */
      transition: transform 0.3s ease-in-out; /* 动画过渡效果 */
  }
    .text {
      font-size:1rem;
      font-weight: bold;
      margin-left: 2px;
    }

    &::before {
    content: ''; // 必须设置content属性
    position: absolute;
    bottom: 10%; // 进度条位于悬浮框上方
    left: 0;
    width: 100%; // 进度条宽度为100%
    height: 1.6px; // 进度条高度
    background-color: rgb(64, 158, 255); // 进度条颜色
    transform: scaleX(0); // 初始状态缩放为0，即不可见
    transform-origin: left; // 缩放起点在左侧
    transition: transform 0.5s ease-in-out; // 缩放过渡效果
  }
  // 当鼠标悬停时，显示进度条
  &:hover::before {
    transform: scaleX(1); // 缩放变为1，即显示完整的进度条
  }
    .hover-form {
      position: absolute;
      top: 100% ;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 1000;

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        width: 100%;
        li {
          cursor: pointer;
          border-radius: 4px;
          text-align: left;
          padding: 12px 2px;
          span{
            font-size: 16px;
          }
          &:hover {
            background-color: rgb(145, 167, 255);
          }
        }
      }
    }
    
      /* 增加进入和离开的过渡 */
    .slide-fade-enter-active {
      transition: all 0.4s ease-out;
    }

    .slide-fade-leave-active {
      transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
    }

    /* 定义进入的开始状态和离开的结束状态 */
    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateY(10px);
      opacity: 0;
    }
  }
  .elicon{
    color: var(--mao-hearder-color);
  }

</style>
