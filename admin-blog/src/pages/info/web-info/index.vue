<script setup>
  import { ref, reactive } from 'vue';
  import { message, DatePicker } from 'ant-design-vue';
  import Banners from './banners/index.vue';
  import dayjs from 'dayjs';
  import { saveWebSiteInfo } from '../../../api/information';

  const props = defineProps({
    info: {
      type: Object,
    }
  })


  const emit = defineEmits(['reset:info'])
  const formData = reactive({
    ...props.info,
    startTime: dayjs(props.info.startTime),
  });
  // 处理格式
  formData.lastUpdateTime = dayjs(formData.lastUpdateTime).format('YYYY-MM-DD HH:mm:ss');
  const runTime = ref(formData.runTime);

  // 每秒更新运行时间
  setInterval(() => {
    const formattedString = dayjs(formData.startTime).format('YYYY-MM-DD HH:mm:ss')
    runTime.value = getRunTime(formattedString);
  }, 1000);

  // 获取运行时长
  function getRunTime(startTime) {
    const targetDate = new Date(startTime).getTime();
    const now = new Date().getTime();
    const timeDiff = now - targetDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
  }

  function resetWebsiteInfo() {
    emit('reset:web:info');
    Object.assign(formData, {
      ...props.info,
      startTime: dayjs(props.info.startTime), // 确保 startTime 还是 dayjs 对象
    });
  }

  function updateWebsiteInfo() {
    saveWebSiteInfo(formData).then((res) => {
      if (res.code === 0) {
        message.success('保存成功');
      } else {
        message.error(`保存失败：${res.msg || '未知错误'}`);
      }
    })
  }


</script>

<template>
  <div class="info">
    <a-form>
      <a-form-item label="网站名称">
        <a-input v-model:value="formData.websiteName" />
      </a-form-item>
      <a-form-item label="头部通知">
        <a-input v-model:value="formData.headerNotification" />
      </a-form-item>
      <a-form-item label="侧面公告">
        <a-textarea v-model:value="formData.sidebarAnnouncement" show-count :maxlength="1000" />
      </a-form-item>
      <a-divider style="margin-top: -1rem">
        网站资讯
      </a-divider>
      <a-form-item label="运行时间">
        <a-date-picker v-model:value="formData.startTime" show-time placeholder="运行时间" />
      </a-form-item>
      <div style="display: flex;justify-content:space-between">
        <a-form-item label="运行时长">
          <a-input v-model:value="runTime" disabled style="width: 12.2rem" />
        </a-form-item>
        <a-form-item label="最后更新" style="margin-left: 1rem">
          <a-input v-model:value="formData.lastUpdateTime" disabled />
        </a-form-item>
      </div>
      <div style="display: flex">
        <a-form-item label="文章数目">
          <a-input v-model:value="formData.articleCount" disabled />
        </a-form-item>
        <a-form-item label="文章总字数" style="margin-left: 1rem">
          <a-input v-model:value="formData.wordCount" disabled />
        </a-form-item>
        <a-form-item label="访问次数" style="margin-left: 1rem">
          <a-input v-model:value="formData.visitCount" disabled />
        </a-form-item>
      </div>
      <a-form-item label="备案信息">
        <a-input v-model:value="formData.recordInfo" />
      </a-form-item>
      <div style="display: flex;justify-content: center">
        <a-button type="primary" style="margin-right: 1rem" @click="updateWebsiteInfo">
          保存
        </a-button>
        <a-button type="default" @click="resetWebsiteInfo">
          重置
        </a-button>
      </div>
    </a-form>
    <Banners />
  </div>
</template>


<style lang="scss" scoped>
.info {
  width: 100%;
}

:deep(.ant-upload-list-picture-card) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

:deep(.ant-form-horizontal){
  width: 50%;
  margin: 0 auto;
}

</style>