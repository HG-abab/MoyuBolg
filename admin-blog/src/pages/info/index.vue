<script setup>
  import { reactive, ref, onMounted } from "vue";
  import avatarurl from '@/assets/images/Avatar.jpg'
  import avatarbg from '@/assets/images/image.png'
  import StationmasterInfo from './stationmaster-info/index.vue'
  import WebInfo from './web-info/index.vue'

  import { getWebSiteInfo } from '../../api/information'

  const data = reactive(['站长信息', '网站信息'])
  const value = ref(data[0])

  const isDark = ref(false)
  const info = ref()

  getWebSiteInfo().then((res) => {
    if (res.code === 0) {
      info.value = res.data;

    } else {
      info.value = {};
      message.error('加载网站信息失败');
    }
  }).catch((error) => {
    info.value = {};
    message.error('获取数据时出错');
  });


  function resetStationmasterInfo() {
    info.value.webmasterName = undefined
    info.value.webmasterCopy = undefined
    info.value.githubLink = undefined
    info.value.giteeLink = undefined
  }

  function resetWebInfo() {
    info.value.websiteName = undefined
    info.value.headerNotification = undefined
    info.value.sidebarAnnouncement = undefined
    info.value.startTime = undefined
    info.value.recordInfo = undefined
  }
</script>

<template>
  <div class="info">
    <div class="crumbs">
      <a-breadcrumb>
        <a-breadcrumb-item>网站管理</a-breadcrumb-item>
        <a-breadcrumb-item>信息管理</a-breadcrumb-item>
      </a-breadcrumb>
      <h1>信息管理</h1>
    </div>
    <div class="content">
      <div class="info_title">
        <a-segmented v-model:value="value" :options="data" />
      </div>
      <div>
        <div v-show="value === '站长信息'" class="info_container">
          <template v-if="info">
            <StationmasterInfo :info="info" @reset:info="resetStationmasterInfo" />
          </template>
        </div>
        <div v-show="value === '网站信息'" class="info_container">
          <template v-if="info">
            <WebInfo :info="info" @reset:web:info="resetWebInfo" />
          </template>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.crumbs {
  padding: 1rem;
  background: white;
  h1{
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
  }
}
.content{
  height: auto;
  margin: 1.5rem;
  padding-bottom: 2rem;
  margin-bottom: 5rem;
  background: white;
  .info_title{
    padding: 1rem;
  }
  @media screen and (max-width: 1400px) {
    .content{
      height: auto;
      margin-bottom: 4rem;
      background: white;
    }
  }
}

</style>