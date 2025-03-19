<script setup>
  import { nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const params = route.params
  const path = params.path

  nextTick(() => {
    if (path) {
      setTimeout(() => {
        router.push(decodeURIComponent(path))
      }, 100)
    }
  })
</script>

<template>
  <div>
  </div>
</template>

<style lang="scss" scoped>
</style>