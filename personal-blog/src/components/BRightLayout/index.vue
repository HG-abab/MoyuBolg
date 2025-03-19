<script setup>
  import { ref } from 'vue';
  import BRightMore from '../../components/BRightMore/index.vue'
  import Fullscreen from '../../components/Fullscreen/index.vue'
import ToTop from '../../components/toTop/index.vue'
  import Ai from '../../components/ai/index.vue'
  defineProps({
    // 回到顶叶
    toTop: {
      type: Boolean,
      default: false,
    },
    // 滚动百分比
    scrollPercentage: {
      type: Boolean,
      default: false,
    },
  })


  const isContainerVisible = ref(false);

  const toggleContainer = () => {
    isContainerVisible.value = !isContainerVisible.value;
  };

</script>

<template>
  <div class="container_div">
    <div class="hide" :class="{ visible: isContainerVisible }">
      <Fullscreen />
    </div>
    <div @click="toggleContainer" style="margin-top: 8px;">
      <BRightMore />
    </div>
    <div  style="margin-top: 8px;">
      <ToTop v-if="toTop" />
    </div>
    <div class="scroll_percentage" v-if="scrollPercentage">
      <slot name="scroll_percentage" />
    </div>
    <div style="margin-top: 8px;"> 
      <Ai />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container_div {
  z-index: 9999;
  position: fixed;
  bottom: 14vh !important;
  right: 3vw;
  padding: 0.5rem;
  width: 40px;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  .scroll_percentage{
    background: var(--mao-bg-content);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    font-weight: bold;
    margin-top: 8px;
  }
}

.hide {
  opacity: 0;
  height: auto;
  transition: all 0.5s;
  margin-top: 16px;
  transform: translate(90px,0);
}

.visible {
  height: auto;
  opacity: 1;
  transform: translate(0,0); 
  transition: all 0.5s;
}

</style>