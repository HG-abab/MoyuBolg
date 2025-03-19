<template>
  <div @click="fullscreenFunc()">
    <el-tooltip effect="light" content="网页全屏" placement="right">
      <div>
        <svg-icon name="fullscreen" class="back-to-top" />
      </div>
    </el-tooltip>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const fullscreen = ref(false);

  const fullscreenFunc = () => {
    let element = document.documentElement;
    if (fullscreen.value) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    fullscreen.value = !fullscreen.value;
  };
</script>

<style scoped lang="scss">
.back-to-top {
  height: 40px !important;
  width: 40px !important;
}
</style>
