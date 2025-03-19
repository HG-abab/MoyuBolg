<script setup>
  import { onMounted } from 'vue'
  import { useUserStore } from '@/stores/User'
  const userStore = useUserStore()

  onMounted(() => {
    if (!userStore.userName || !userStore.userAvatar) {
      userStore.generateUserInfo()
    }
  })

</script>
<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>