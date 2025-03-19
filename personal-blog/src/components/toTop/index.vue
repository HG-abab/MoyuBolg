<script setup>
  import { ref } from "vue";

  //节流
  function throttle(fn, delay) {
    let time;
    return function () {
      if (time) return; // 如果有定时器，说明已经执行过了，直接返回
      time = setTimeout(() => {
        fn.apply(this, arguments);
        time = null;
      })
    }
  }

  // 距离顶部高度
  const top = ref(0)
  window.addEventListener("scroll", throttle(() => {
    top.value = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
  }, 200));

  // 返回顶部
  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
</script>

<template>
  <transition name="el-zoom-in-bottom">
    <div v-if="top >= 1000" @click="backToTop" style="margin-top:5px">
      <el-tooltip effect="light" content="回到顶部" placement="right">
        <div>
          <svg-icon name="back_to_top" class="back-to-top" />
        </div>
      </el-tooltip>
    </div>
  </transition>
</template>

<style scoped lang="scss">

.back-to-top {
  height: 40px !important;
  width: 40px !important;
}
</style>