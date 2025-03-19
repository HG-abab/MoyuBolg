<script setup>

</script>

<template>
  <div class="back-to-top-container">
    <el-tooltip effect="light" class="tooltip" content="更多功能" placement="right">
      <div class="more_rotating">
        <svg-icon name="bottom_right_more" class="back-to-top" />
      </div>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
.back-to-top {
  height: 40px !important;
  width: 40px !important;
}

.more_rotating{
  animation: rotating 3s linear infinite;
}
</style>