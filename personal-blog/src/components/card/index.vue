<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import router from '@/router';
import { ElMessage } from 'element-plus';
import { getAllArticle } from '@/api/article';
import dayjs from 'dayjs';

// 分页相关
const currentPage = ref(1);
const pageSize = ref(8);
const total = ref(0);

// 加载状态
const loading = ref(true);

// 文章列表
const articles = ref([]);
const allArticle = async () => {
  loading.value = true;
  try {
    const res = await getAllArticle();
    if (res.code === 0) {
      articles.value = res.data;
      total.value = res.data.length;
      articles.value.forEach(item => {
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        item.tagsName = item.tagsName.map((tag, index) => ({
          id: index,
          name: tag
        }));
      })
    } else {
      ElMessage.error(res.msg);
    }
  } catch (error) {
    ElMessage.error('获取文章列表失败');
  } finally {
    loading.value = false;
  }
}

// 计算当前页的文章
const currentPageArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return articles.value.slice(start, end);
});

// 处理页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
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
    <!-- 骨架屏 -->
    <template v-if="loading">
      <el-card v-for="i in pageSize" :key="i" class="skeleton-card">
        <div class="elcardbox">
          <div class="skeleton-left">
            <el-skeleton-item variant="image" style="width: 100%; height: 240px;" />
          </div>
          <div class="skeleton-right">
            <el-skeleton-item variant="text" style="width: 80%; height: 30px; margin: 20px 0;" />
            <div class="skeleton-icons">
              <el-skeleton-item variant="text" style="width: 60px; height: 20px; margin-right: 20px;" />
              <el-skeleton-item variant="text" style="width: 60px; height: 20px; margin-right: 20px;" />
              <el-skeleton-item variant="text" style="width: 60px; height: 20px; margin-right: 20px;" />
              <el-skeleton-item variant="text" style="width: 60px; height: 20px;" />
            </div>
            <el-skeleton-item variant="text" style="width: 90%; height: 60px; margin: 20px 0;" />
            <div class="skeleton-tags">
              <el-skeleton-item variant="text" style="width: 40px; height: 20px; margin-right: 10px;" />
              <el-skeleton-item variant="text" style="width: 60px; height: 20px; margin-right: 10px;" />
              <el-skeleton-item variant="text" style="width: 60px; height: 20px;" />
            </div>
            <el-skeleton-item variant="text" style="width: 200px; height: 20px; margin-top: 20px;" />
          </div>
        </div>
      </el-card>
    </template>

    <!-- 实际内容 -->
    <template v-else>
      <el-card v-slide-in v-for="(article, index) in currentPageArticles" :key="article.id">
        <div class="elcardbox" @click="toarticle(article.id)">
          <div class="right-img" v-if="index % 2 !== 0 || width < 768">
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
                <span class="number">{{ article.visitCount }}</span>
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
                <el-tag size="small" class="eltag">{{ tag.name }}</el-tag>
              </div>
            </div>
            <div class="main-time">
              <p class="time">发布于：{{ article.createTime }}</p>
            </div>
          </div>
          <div class="left-img" v-if="index % 2 === 0 && width > 768">
            <div class="cardimg">
              <div style="overflow: hidden;">
                <img v-lazy="article.articleCover" alt="" class="img">
              </div>
              <div class="text">{{ article.categoryName }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total"
                       @current-change="handleCurrentChange" layout="prev, pager, next" background />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.el-card {
  margin: 10px 0;
  height: 220px;

  &:hover img {
    transform: scale(1.1);
    transition: transform 0.3s linear;
  }

  .elcardbox {
    display: flex;
    justify-content: space-between;

    .left-img,
    .right-img {
      width: 50%;
      position: relative;

      .cardimg {
        height: 240px;

        .img {
          height: 240px;
          width: 100%;
          object-fit: cover;
        }

        .text {
          position: absolute;
          top: 0;
          left: 0;
          width: 50px;
          height: 40px;
          font-size: 0.8rem;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.041);
        }
      }
    }

    .main-text {
      width: 50%;
      padding: 0 15px;

      .title {
        display: flex;
        margin: 1.2vw 1.4vw;
        font-weight: bold;
        font-size: 1.8rem;
        line-height: 1.4;
      }

      .main-icon {
        margin: 0.1vw 1vw;
        display: flex;
        font-size: 0.8rem;
        flex-wrap: wrap;

        .flex {
          display: flex;
          align-items: center;
          margin-right: 15px;
          margin-bottom: 5px;

          .number {
            margin-right: 0.8vw;
          }
        }
      }

      .main-p {
        margin: 0.8vw 1vw;
        font-size: 1.2rem;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tag {
        margin: 0.5vw 1vw;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        span {
          margin-right: 8px;
        }
      }

      .main-time {
        margin: 0.6vw 1vw;
        display: flex;
        font-size: 0.8rem;

        .time {
          margin-right: 0.5vw;
        }
      }
    }
  }
}

:deep(.el-card__body) {
  position: relative;
  padding: 0;
}

@media screen and (max-width: 768px) {
  .el-card {
    flex-direction: column;
    height: auto;
    margin: 15px 0;

    .elcardbox {
      display: block;

      .right-img {
        width: 100%;
        height: auto;

        .cardimg {
          height: 200px;

          .img {
            height: 200px;
          }
        }
      }

      .main-text {
        width: 100%;
        padding: 15px;
        height: auto;

        .title {
          margin: 10px 0;
          font-size: 1.4rem;
          line-height: 1.4;
        }

        .main-icon {
          margin: 10px 0;
          display: flex;
          font-size: 0.9rem;
          flex-wrap: wrap;

          .flex {
            margin-right: 15px;
            margin-bottom: 5px;

            .number {
              margin-right: 5px;
            }
          }
        }

        .main-p {
          margin: 10px 0;
          font-size: 1rem;
          line-height: 1.6;
        }

        .tag {
          margin: 10px 0;
          font-size: 1rem;
          flex-wrap: wrap;

          span {
            margin-right: 8px;
          }

          .eltag {
            margin: 5px 5px 5px 0;
          }
        }

        .main-time {
          margin: 10px 0;
          font-size: 0.8rem;
        }
      }
    }
  }

  .pagination-container {
    margin: 15px 0;
    padding: 10px 0;

    :deep(.el-pagination) {
      justify-content: center;
      flex-wrap: wrap;
      gap: 5px;
    }
  }
}

.eltag {
  margin-right: 0.3rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 10px 0;
}

.skeleton-card {
  margin: 10px 0;
  height: 220px;

  .elcardbox {
    display: flex;
    justify-content: space-between;

    .skeleton-left {
      width: 50%;
      height: 240px;
    }

    .skeleton-right {
      width: 50%;
      padding: 0 20px;

      .skeleton-icons {
        display: flex;
        margin: 20px 0;
        flex-wrap: wrap;
      }

      .skeleton-tags {
        display: flex;
        margin: 20px 0;
        flex-wrap: wrap;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .skeleton-card {
    height: auto;
    margin: 15px 0;

    .elcardbox {
      flex-direction: column;

      .skeleton-left {
        width: 100%;
        height: 200px;
      }

      .skeleton-right {
        width: 100%;
        height: auto;
        padding: 15px;

        .skeleton-icons {
          margin: 10px 0;
        }

        .skeleton-tags {
          margin: 10px 0;
        }
      }
    }
  }
}
</style>