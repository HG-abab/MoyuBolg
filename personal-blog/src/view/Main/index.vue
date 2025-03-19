<script setup>
  import Card from '@/components/card/index.vue'
  import layoutAside from '@/components/layoutAside/index.vue'
  import Sidecard from '@/components/sideCards/index.vue'
  import { ElMessageBox } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import useCurrentDateTime from '../../utils/time'
  import TagCloud from '../../utils/TagCloud'
  import { getTopArticle } from '../../api/article'
  import { getWebInfo } from '../../api/information'
  import { getTagList } from '../../api/tag'
  import dayjs from 'dayjs'
  import { onMounted, ref } from 'vue';
  import router from '@/router';
  const { date: getCurrentDate, weekday: getWeekday, time: getTime } = useCurrentDateTime()

  const webInfo = ref()
  // 置顶文章
  const topArticle = ref([])
  const announcementText = ref('');
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
  }

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

  // 置顶文章
  const articleall = async () => {
    await getTopArticle().then((res) => {
      if (res.code === 0) {
        topArticle.value = res.data;
        topArticle.value.forEach((item) => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          item.articleContent = Filtercontent(item.articleContent, 25)
        })
      } else {
        ElMessage.error(res.msg)
      }
    })
  }

  const options = {
    radius: 70, // 设置滚动半径为150px
    maxSpeed: 'fast', // 设置最大滚动速度为快
    initSpeed: 'slow', // 设置初始滚动速度为慢
    direction: 45, // 设置初始滚动方向为45度
    reverseDirection: true, // 反转滚动方向
  };
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
    await articleall()
    const tagCloudInstance = TagCloud('#tag-cloud-container', texts, options);
  })

  function announcement() {
    ElMessageBox.alert(`<p >${announcementText.value}</p>`, '公告', {
      confirmButtonText: '关闭',
      closeOnPressEscape: true,
      dangerouslyUseHTMLString: true,
      customClass: 'announcementText',
    })
  }

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

  const Filtercontent = (e, index) => {
    return e.replace(/[*#>`~\-\\[\]()\s]|(\n\n)/g, '').substring(0, index) + '...';
  }

  function toarticle(e) {
    router.push(`/article/${e}`);
  }
</script>

<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <el-container class="layout-main">
        <el-header>
          <div class="announcement">
            <SvgIcon name="notice" color="#409EFF" height="18px" width="18px" />
            <span style="text">禁止发无关评论，违者永久封禁! ! !</span>
          </div>
        </el-header>
        <el-main>
          <div>
            <el-divider border-style="dashed" content-position="left">
              <div class="items-center">
                <SvgIcon name="recommend" color="#409EFF" height="14" width="14" style="margin-right: 5px" />
                <span>推荐</span>
              </div>
            </el-divider>
            <el-carousel motion-blur style="height: 200px">
              <el-carousel-item v-for="(item) in topArticle" :key="item.id" @click="toarticle(item.id)">
                <img v-lazy="item.articleCover" :alt="'Image ' + item.id" class="carousel-image" />
                <div class="carousel-text">
                  <div class="title">{{item.articleTitle}}</div>
                  <div class="timi">{{item.createTime}}</div>
                  <div class="content">{{item.articleContent}}</div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="essay_title">
            <el-divider border-style="dashed" content-position="left">
              <div style="display: flex; align-items: center">
                <SvgIcon name="essay_icon" color="#409EFF" height="14" width="14" style="margin-right: 5px" />
                <span style="font-size: 0.9rem; margin-left: 0.2rem;">文章</span>
              </div>
            </el-divider>
          </div>
          <div>
            <Card />
          </div>
        </el-main>
        <el-footer>
          <el-divider border-style="dashed" content-position="center">
            <div class="footer-text" style="font-weight: bold">~~到达底部啦~~</div>
          </el-divider>
        </el-footer>
      </el-container>
      <el-aside class="layout-aside">
        <layoutAside />
        <Sidecard title="公告" prefixIcon="announcement" suffix-icon="jt_y" :isDithering="true" :isArrow="true" @invoke="announcement">
          <p class="cardpre">{{Filtercontent(announcementText)}}</p>
        </Sidecard>
        <Sidecard title="电子时钟" prefixIcon="time" :isScale="true" style="height: 110px;">
          <span style="font-family:Share Tech Mono; font-size: 0.9rem; margin:0 10px">{{getCurrentDate}}</span>
          <span style="font-family:Share Tech Mono;  font-size: 0.9rem">星期{{getWeekday}}</span>
          <p style="font-family:Share Tech Mono;font-size: 2.4rem; margin-top:20px">{{getTime}}</p>
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
              <p>{{webInfo.wordCount}}</p>
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
        <Sidecard title="文章标签" prefixIcon="OIP-C" suffixIcon="rotate" :isScale="true" :isRotate="true" style="height:200px" @invoke="tagcloudcontainer">
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
  position: absolute;
  top: 100%;
  width: 100%;
  transition: all 0.5s;
  background-color: var(--mao-background-color);
  .layout-container{
    margin: 0 12.8%;
    .el-header{
      margin: 1vh 0;
      padding: 0 1vw;
    }
    .el-footer{
      .footer-text{
        font-size: 1rem;
      }
    }
    .layout-main{
      border-radius: 5px;
      background-color: var(--mao-bg-content);
      .announcement{
        height: 4.5vh;
        margin-top: 10px;
        border: 1px dotted #ccc;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        span{
          margin-left: 10px;
          font-size: 18px;
        }
      }
    }
    .el-main{
      position: relative;
      padding: 0 1vw;
      .el-divider{
        margin: 5px 0; 
      }
      .items-center{
        display: flex;
        font-size: 0.9rem;
      }
      .el-carousel {
        width: 100%; /* 轮播图的宽度 */
        height: 120px; /* 轮播图的高度 */
        margin: 3vh 0;
        border-radius: 5px;
        .carousel-image {
        position: relative;
        width: 100%; /* 图片宽度适应轮播区域 */
        height: 100%; /* 图片高度适应轮播区域 */
        object-fit: cover; /* 确保图片不会失真，同时覆盖整个轮播区域 */
        }
        .carousel-text{
          width: 100%;
          height: 100%;
          position: absolute;
          left: 50%;
          top: 0%;
          transform: translateX(-50%);
          color: #ffffff;
          // 字体居中
          text-align: center;
          padding: 20px 0;
          .title{
              font-weight: bold;
              font-size: 2rem;
              margin: 20px 0;
          }
          .timi{
              font-size: 1.1rem;
              margin: 20px 0;
          }
          .content{
            font-weight: bold;
            font-size: 1.2rem;
            margin: 20px 0;
          }
        }
      }
      .essay_title {
        font-size: 0.9rem;
        display: flex;
    }
    }
    @media screen and (max-width: 1600px) {
      margin: 0 7% ;
    }
  }
  .layout-aside{
    margin-left: 1vw;
    margin-right: 2vw;
    width: 22.5%;
    @media screen and (max-width: 1600px) {
      margin-right: 4vw;
    }
    @media screen and (max-width: 910px){
    display: none;
  }
    .cardpre {
      text-align: left;
      font-size: 1rem;
      word-wrap: break-word;
      line-height: 1.2rem;
    }
  }
}

:deep(.el-carousel__button){
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
:deep(.el-aside){
  margin-left: 10px;
}


//标签云
.custom-tagcloud{
  display: flex;
  justify-content: center;
}





</style>