<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import Foter from '@/components/Foter/index.vue'
import useCurrentDateTime from '../../utils/time';
import Sidecard from '@/components/Sidecards/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { useColorMode, useTitle } from "@vueuse/core";
import TagCloud from '../../utils/TagCloud'
import { getWebInfo } from '../../api/information'
import { getTagList } from '../../api/tag'

// 富文本
const id = 'preview-only';
const text = ref(``);
const scrollElement = document.documentElement;
const mode = useColorMode()

const announcementText = ref(``);
const webInfo = ref();
const WebInfoGet = async () => {
  await getWebInfo().then(res => {
    if (res.code === 0) {
      webInfo.value = res.data
      announcementText.value = webInfo.value.sidebarAnnouncement
    } else {
      ElMessage.error(res.msg)
    }
  })
}

// 将 starttime 和 lastUpdatetime 格式化并计算运行时长
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

const calculateDuration = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now - start) / 1000);

  const days = Math.floor(diffInSeconds / (3600 * 24));

  return `${days}`;
};

const calculateLastUpdate = (lastUpdateDate) => {
  const lastUpdate = new Date(lastUpdateDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now - lastUpdate) / 1000);

  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  return `${days}天前`;
};

const texts = [];
const getText = async () => {
  await getTagList().then(res => {
    if (res.code === 0) {
      res.data.forEach(item => {
        texts.push(item.tagName)
      })
    } else {
      ElMessage.error(res.msg)
    }
  })
  console.log(texts)
}

onMounted(async () => {
  await getText()
  await WebInfoGet()
  // 格式化 starttime 和 lastUpdatetime
  const startTimeFormatted = formatDate(webInfo.value.startTime);
  const lastUpdateFormatted = formatDate(webInfo.value.lastUpdateTime);
  // 计算运行时长和最后更新
  const runtime = calculateDuration(webInfo.value.startTime);
  const lastUpdate = calculateLastUpdate(webInfo.value.lastUpdateTime);
  // 将数据绑定到组件的相关部分
  webInfo.value.starttimeFormatted = startTimeFormatted;
  webInfo.value.lastUpdateFormatted = lastUpdateFormatted;
  webInfo.value.runtime = runtime;
  webInfo.value.lastUpdate = lastUpdate;

  const tagCloudInstance = TagCloud('#tag-cloud-container', texts, options);
})
function announcement() {
  // 去除首位空格
  const formattedText = announcementText.value.trim()
    .replace(/&/g, "&amp;")    // 防止XSS
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, '<br/>');  // 保留换行

  const htmlContent = `<p style="white-space: pre-line">${formattedText}</p>`;

  ElMessageBox.alert(htmlContent, '公告', {
    confirmButtonText: '关闭',
    dangerouslyUseHTMLString: true,
    customClass: 'announcementText',
    customStyle: { maxWidth: '80vw' } // 响应式宽度
  });
}
const Filtercontent = (e) => {
  return e.substring(0, 80) + '...';
}

const { date: getCurrentDate, weekday: getWeekday, time: getTime } = useCurrentDateTime();
const options = {
  radius: 70, // 设置滚动半径为70px
  maxSpeed: 'fast', // 设置最大滚动速度为快
  initSpeed: 'slow', // 设置初始滚动速度为慢
  direction: 45, // 设置初始滚动方向为45度
  reverseDirection: true, // 反转滚动方向
};

const tagcloudcontainer = () => {
  // 获取容器元素
  const container = document.getElementById('tag-cloud-container');
  // 如果容器存在，先清空其内容
  if (container) {
    container.innerHTML = '';
  }
  // 然后创建新的标签云
  TagCloud('#tag-cloud-container', texts, options);
}
</script>

<template>
  <div is-side-bar style=" background-color: var(--bg--article);">
    <el-container class="common-layout" style="padding-top: 80px;">
      <el-container class="main">
        <router-view />
      </el-container>
      <el-aside class="aside" style="overflow: visible">
        <layoutAside />
        <Sidecard title="公告" prefixIcon="announcement" suffix-icon="jt_y" :isDithering="true" :isArrow="true"
                  @invoke="announcement">
          <p class="cardpre">{{ Filtercontent(announcementText) }}</p>
        </Sidecard>
        <Sidecard title="电子时钟" prefixIcon="time" :isScale="true" style="height: 110px;">
          <span style="font-family:Share Tech Mono; font-size: 0.9rem; margin:0 10px">{{ getCurrentDate }}</span>
          <span style="font-family:Share Tech Mono;  font-size: 0.9rem">星期{{ getWeekday }}</span>
          <p style="font-family:Share Tech Mono;font-size: 2.4rem; margin-top:20px">{{ getTime }}</p>
        </Sidecard>
        <Sidecard title="网站资讯" prefixIcon="statistics" :isScale="true" style="height: 200px;">
          <div v-if="webInfo" style="margin: 4px 5px; line-height: 1.7rem;">
            <div style="display: flex; justify-content: space-between; font-size:1.2rem;">
              <p>文章数目：</p>
              <p>{{ webInfo.articleCount }}</p>
            </div>
            <div style="display: flex; justify-content: space-between;font-size:1.2rem">
              <p>运行时长：</p>
              <p>{{ webInfo.runtime }}天</p>
            </div>
            <div style="display: flex; justify-content: space-between;font-size:1.2rem">
              <p>全站字数：</p>
              <p>{{ webInfo.wordCount }}</p>
            </div>
            <div style="display: flex; justify-content: space-between;font-size:1.2rem">
              <p>访问次数：</p>
              <p>{{ webInfo.visitCount }}</p>
            </div>
            <div style="display: flex; justify-content: space-between;font-size:1.2rem">
              <p>最后更新：</p>
              <p>{{ webInfo.lastUpdate }}</p>
            </div>
          </div>
        </Sidecard>
        <Sidecard title="文章标签" prefixIcon="OIP-C" suffixIcon="rotate" :isScale="true" :isRotate="true"
                  style="height:200px" @invoke="tagcloudcontainer">
          <div id="tag-cloud-container" class="custom-tagcloud"></div>
        </Sidecard>
      </el-aside>
    </el-container>
    <div style="margin-top: 4rem;"></div>
    <Foter />
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  margin: 0 12.8vw;

  @media screen and (max-width: 1600px) {
    margin: 0 7%;
  }

  .main {
    border-radius: 8px;
    background-color: var(--mao-bg-content);

    .header {
      height: 340px;

      .header-img {
        border-radius: 15px;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        .text {
          padding: 60px 50px;
          color: #fff;

          .title {
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 35px;
            background-color: rgb(123, 115, 117, 0.8);
          }

          .h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 2.4vh 0;
          }

          .statistics {
            font-size: 14px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 110px;
            height: 36px;
            background-color: rgb(123, 115, 117, 0.8);
          }
        }
      }
    }

    .footer {
      height: auto;
      margin: 20px 1vw;

      .copyright {
        border: 1px solid #ccc;
        border-radius: 10px;
        margin: 1rem 0;
        padding: 1rem 2rem;

        .license {
          display: flex;
          align-items: center;
          margin: 1rem 0;

          .license_text {
            font-size: 0.8rem;
          }

          .copyright_a {
            color: var(--a--color);
          }
        }

        .link {
          display: flex;
          align-items: center;
          margin: 1rem 0;

          .copyright_a {
            color: var(--a--color);
          }
        }

        .author {
          display: flex;
          align-items: center;
          margin: 1rem 0;
        }
      }

      .tipping-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fc7444;
        margin: 5vh 20vw;
        padding: 1.5vh 0;
        border-radius: 25px;
      }

      .goOn {
        display: flex;
        justify-content: space-between;
        margin: 1vh 0;
      }
    }
  }

  .aside {
    margin-left: 1vw;
    margin-right: 2vw;
    width: 22.5%;

    @media screen and (max-width: 1600px) {
      margin-right: 4vw;
    }

    @media screen and (max-width: 910px) {
      display: none;
    }
  }

  .cardpre {
    text-align: left;
    font-size: 1rem;
    word-wrap: break-word;
    line-height: 1.2rem;
  }
}

//标签云
.custom-tagcloud {
  display: flex;
  justify-content: center;
}
</style>