<template>
  <div class="container">
    <div class="left">
      <div class="Avatar" v-lazy="Avatar"></div>
      <div class="text">
        <h1>Moyu</h1>
        <span>摸鱼摸鱼摸鱼,重要的事情说三遍</span>
      </div>
    </div>
    <div class="right">
      <div class="navigation">
        <a href="https://github.com/HG-abab" target="_blank" rel="noopener noreferrer">
          <div class="svgicon">
            <SvgIcon name="github_icon" width="100px" height="100px" />
          </div>
        </a>
        <a href="https://gitee.com/abaabab123/personal-blog" target="_blank" rel="noopener noreferrer">
          <div class="svgicon">
            <SvgIcon name="gitee_icon" width="100px" height="100px" />
          </div>
        </a>
        <a href="https://space.bilibili.com/3493112955537851?spm_id_from=333.1007.0.0" target="_blank" rel="noopener noreferrer">
          <div class="svgicon">
            <SvgIcon name="bilibili_icon" width="100px" height="100px" />
          </div>
        </a>
      </div>
    </div>
  </div>
  <div>
    <Foter />
  </div>
</template>
<script setup>
  import JSConfetti from 'js-confetti';
  import Foter from '@/components/Foter/index.vue'

  import { ref } from "vue";
  import Avatar from '@/assets/imgs/Avatar.jpg';


  const userAvatar = ref(Avatar);
  const confetti = new JSConfetti();
  confetti.addConfetti(); // 触发五彩纸屑效果
</script>

<style lang="scss" scoped>
*{
  position: relative;
}
.container{
  display: flex;
  width: 100%;
  height: 100vh;
  background-color:var(--mao-background-color) ;
  .left, .right {
    width: 50%;
    height: 100%;
  }
  .left{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .Avatar{
      width: 280px;
      height: 280px;
      border-radius: 50%;
      position: absolute;
      top: 42%;
      left: 64%;
      transform: translate(-50%,-50%);
      background-color: #151414;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .text{
      position: absolute;
      top: 75%;
      left: 64%;
      transform: translate(-50%,-50%);
    }
    
  }
  .right{
    display: flex;
    justify-content: center;
    align-items: center;
    .navigation{
      display: flex;
      .svgicon{
        margin: 0 30px;
        width: 130px;
        height: 130px;
        border-radius:15px ;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

h1{
  font-family: Righteous;
  font-size: 6rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
  color: #fff;
  text-shadow: .05em .05em 0 hsl(230, 40%, 50%);
}

span{
  display: flex;
  margin-top: 2rem;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}
</style>