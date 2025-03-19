<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import router from '@/router';
  import { ElMessage } from 'element-plus';
  import { getAllArticle } from '@/api/article';
  import dayjs from 'dayjs';
  // 文章列表
  const articles = ref([]);
  const allArticle = async () => {
    await getAllArticle().then(res => {
      if (res.code === 0) {
        articles.value = res.data;
        articles.value.forEach(item => {
          item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.tagsName = item.tagsName.map((tag, index) => ({
            id: index, // 使用索引作为 id
            name: tag
          }));
        })
      } else {
        ElMessage.error(res.msg);
      }
    })
  }

  // 监听窗口宽度变化屏幕宽度
  const width = ref(window.innerWidth);

  const handleResize = () => {
    width.value = window.innerWidth;
  }

  onMounted(async () => {
    await allArticle()
    window.addEventListener('resize', handleResize);
  });

  // 在组件卸载时移除事件监听器
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  const Filtercontent = (e) => {
    // 移除 HTML 标签
    const text = e.replace(/<[^>]*>/g, '').replace(/[*#>`~\-\\[\]()\s]|(\n\n)/g, '').substring(0, 50);
    return text + '...';
  }

  function toarticle(e) {
    router.push(`/article/${e}`);
  }
</script>

<template>
  <div>
    <el-card v-slide-in v-for="article in articles" :key="article.id">
      <div class="elcardbox" @click="toarticle(article.id)">
        <div class="right-img" v-if="article.id % 2 !== 0 || width < 768">
          <div class="cardimg">
            <div style="overflow: hidden;">
              <img v-lazy="article.articleCover" alt="" class="img">
            </div>
            <div class="text">{{ article.categoryName }}</div>
          </div>
        </div>
        <div class="main-text">
          <div class="title">{{ article.articleTitle }}</div>
          <div class="main-icon">
            <div class="flex">
              <SvgIcon name="reading" style="margin-right: 5px" />
              <span class="number">{{ article.visitCount}}</span>
            </div>
            <div class="flex">
              <SvgIcon name="comments" style="margin-right: 5px" />
              <span class="number">{{ article.commentsCount }}</span>
            </div>
            <div class="flex">
              <SvgIcon name="like" style="margin-right: 5px" />
              <span class="number">{{ article.likesCount }}</span>
            </div>
            <div class="flex">
              <SvgIcon name="collection" style="margin-right: 5px" />
              <span class="number">{{ article.favoritesCount }}</span>
            </div>
          </div>
          <p class="main-p">{{ Filtercontent(article.articleContent) }}</p>
          <div class="tag">
            <span>标签：</span>
            <div v-for="tag in article.tagsName" :key="tag.id">
              <el-tag size="small" class="eltag">{{ tag.name  }}</el-tag>
            </div>
          </div>
          <div class="main-time">
            <p class="time">发布于：{{ article.createTime }}</p>
          </div>
        </div>
        <div class="left-img" v-if="article.id % 2 === 0  && width > 768">
          <div class="cardimg">
            <div style="overflow: hidden;">
              <img v-lazy="article.articleCover" alt="" class="img">
            </div>
            <div class="text">{{ article.categoryName }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
  .el-card{
    margin: 10px 0;
    height: 220px;
    &:hover img{
      transform: scale(1.1);
      transition: transform 0.3s linear;
    }
    .elcardbox{
      display: flex;
      justify-content: space-between;
        .left-img{
        width: 50%;
        position: relative;
        .cardimg{
        height: 240px;
        .img {
          height: 240px;
          width: 100%; /* 图片宽度适应轮播区域 */
          object-fit: cover; /* 确保图片不会失真，同时覆盖整个轮播区域 */
          }
          .text{
          position: absolute;
          top: 0;
          left: 0;
          width: 50px;
          height: 40px;
          font-size:0.8rem ;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.041);
          }
        }
      }
      .right-img{
        width: 50%;
        height: 240px;
        position: relative;
        .cardimg{
        height: 240px;
        .img {
          height: 240px;
          width: 100%; /* 图片宽度适应轮播区域 */
          object-fit: cover; /* 确保图片不会失真，同时覆盖整个轮播区域 */
          }
          .text{
          position: absolute;
          top: 0;
          left: 0;
          width: 50px;
          height: 40px;
          font-size:0.8rem ;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.041);
          }
        }
      }
      .main-text{
        width: 50%;
        .title{
          display: flex;
          margin: 1.2vw 1.4vw;
          font-weight: bold;
          font-size: 1.8rem;
        }
        .main-icon{
          margin: 0.1vw 1vw;
          display: flex;
          font-size: 0.8rem;
          .flex{
            display: flex;
            align-items: center;
            .number{
              margin-right: 0.8vw;
            }
          }
        }
        .main-p{
          margin: 0.8vw 1vw;
          font-size: 1.2rem;
        }
        .tag{
          margin: 0.5vw 1vw;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
        }
        .main-time{
          margin: 0.6vw 1vw;
          display: flex;
          font-size: 0.8rem;
          .time{
            margin-right: 0.5vw;
          }
        }
      }
    }
  }
  

  :deep(.el-card__body){
    position: relative;
    padding: 0;
    }

 @media screen and (max-width: 768px) {
    .el-card {
      flex-direction: column;
      height: auto;
      .elcardbox{
        display: block;
        .right-img {
          width: 100%;
          height: auto;
          .cardimg{
            height: 170px;
            .img {
              height: 170px;
            }
          }
        }
        .main-text {
          height: 170px;
          width: 100%;
          .title{
            display: flex;
            margin: 2vh 3vw;
            font-weight: bold;
            font-size: 1.6rem;
          }
        .main-icon{
          margin: 0.1vh 3vw;
          display: flex;
          font-size: 0.9rem;
          .flex{
            display: flex;
            align-items: center;
            .number{
              margin-right: 2vw;
            }
          }
        }
        .main-p{
          margin: 1.5vh 3vw;
          font-size: 1.2rem;
        }
        .tag{
          margin: 0.8vh 3vw;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
        }
        .main-time{
          margin: 1vh 3vw;
          display: flex;
          font-size: 0.8rem;
          .time{
            margin-right: 0.8vw;
          }
        }
        }
      }
    }
 }
 .eltag{
  margin-right: 0.3rem;
 }
</style>