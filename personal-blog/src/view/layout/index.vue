<template>
  <Header />
  <div>
    <router-view v-slot="{Component}">
      <transition name="el-fade-in-linear" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <BRightLayout toTop />
</template>

<script setup>
  import Header from '../../components/header/index.vue'
  import Foter from '../../components/Foter/index.vue'
  import BRightLayout from '../../components/BRightLayout/index.vue'
</script>

<style lang="scss">
</style>