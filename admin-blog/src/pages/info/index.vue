<script setup>
import { reactive, ref, onMounted } from "vue";
import StationmasterInfo from './stationmaster-info/index.vue'
import WebInfo from './web-info/index.vue'
import { getWebSiteInfo } from '../../api/information'
import { useUserStore } from "../../store/user";
import { getUserById } from "../../api/users";

const data = reactive(['用户信息', '网站信息'])
const value = ref(data[0])
const userStore = useUserStore()
const userInfo = ref()

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

function decodeJWT(token) {
  const base64Url = token.split('.')[1]; // 获取 Payload 部分
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 转换为标准 Base64
  const jsonPayload = JSON.parse(atob(base64)); // 解码并转换为 JSON 对象

  return jsonPayload; // 返回解码后的 Payload
}

onMounted(() => {
  const userId = decodeJWT(userStore.userToken).sub;
  getUserById(userId).then((res) => {
    if (res.code === 0) {
      userInfo.value = res.data;
    } else {
      message.error(res.message);
    }
  })
})

</script>

<template>
  <div class="info">
    <div class="crumbs">
      <a-breadcrumb>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
        <a-breadcrumb-item>信息管理</a-breadcrumb-item>
      </a-breadcrumb>
      <h1>信息管理</h1>
    </div>
    <div class="content">
      <div class="info_title">
        <a-segmented v-model:value="value" :options="data" />
      </div>
      <div>
        <div v-show="value === '用户信息'" class="info_container">
          <template v-if="userInfo">
            <StationmasterInfo :info="userInfo" @reset:info="resetStationmasterInfo" />
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

  h1 {
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
  }
}

.content {
  height: auto;
  margin: 1.5rem;
  padding-bottom: 2rem;
  margin-bottom: 5rem;
  background: white;

  .info_title {
    padding: 1rem;
  }

  @media screen and (max-width: 1400px) {
    .content {
      height: auto;
      margin-bottom: 4rem;
      background: white;
    }
  }
}
</style>