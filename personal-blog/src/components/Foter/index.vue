<!-- 底部 -->
<script setup>
  import { getWebInfo } from '../../api/information'
  import { onMounted, ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const webInfo = ref({})
  onMounted(async () => {
    await getWebInfo().then(res => {
      if (res.code === 0) {
        webInfo.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
  })

</script>

<template>
  <div class="Footer">
    <!-- 文章页脚 -->
    <div class="footer_container">
      <div class="footer_text">
        <div>&copy;{{webInfo.websiteName}}</div>
        <div>备案号:{{webInfo.recordInfo}}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
</script>
<style lang="scss" scoped>
.Footer {
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 80px;
  // 渐变底部
  background: var(--mao-bg-footer);
  z-index: 9999999;
}

.footer_container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer_text {
  font-size: 1rem;
  line-height:1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
}

</style>