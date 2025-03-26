<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import Foter from '@/components/Foter/index.vue'
import Header from '@/components/Header/index.vue'
import useCurrentDateTime from '../../utils/time';
import Sidecard from '@/components/Sidecards/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BRightLayout from '../../components/BRightLayout/index.vue'
import Mdlog from './MdLong/index.vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { useColorMode, useTitle } from "@vueuse/core";
import { getWebInfo } from '../../api/information'
import { useUserStore } from '@/stores/User'
import comment from "@/components/comments/index.vue";
import { getAllArticle, getAroundTitle, isLike, isCollect, getIsLike, getIsCollect } from '../../api/article'
import dayjs from 'dayjs'
import { addCollect, deleteCollect } from '../../api/collect';

// 富文本
const id = 'preview-only';
const text = ref('');
const scrollElement = document.documentElement;
const mode = useColorMode()

const webInfo = ref({})
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

  return `${days}天前`;
};

const route = useRoute();
const userId = Number(route.params.id);
const articles = ref({})

const articlelist = async () => {
  await getAllArticle(route.params.id).then((res) => {
    if (res.code === 0) {
      articles.value = res.data[0]
      text.value = res.data[0].articleContent
      articles.value.createTime = dayjs(articles.value.createTime).format('YYYY-MM-DD HH:mm:ss');
      articles.value.tagsName = articles.value.tagsName.map((tag, index) => ({
        id: index, // 使用索引作为 id
        name: tag
      }));
    }
  }).catch(() => {
    ElMessage.error('未找到文章')
    router.push({ path: '/' })
  })
}

watch(() => route.params.id, async () => {
  window.scrollTo(0, 0);
  await articlelist()
  await getAroundTitleList()
  await getlikeandcollect()
})

const AroundTitle = ref([])
const getAroundTitleList = async () => {
  await getAroundTitle(route.params.id).then((res) => {
    if (res.code === 0) {
      AroundTitle.value = res.data
    } else {
      ElMessage.error('获取失败')
    }
  })
}

onMounted(async () => {
  await WebInfoGet()
  await articlelist()
  await getAroundTitleList()
  await getlikeandcollect()
  const startTimeFormatted = formatDate(webInfo.value.startTime);
  const lastUpdateFormatted = formatDate(webInfo.value.lastUpdateTime);
  const runtime = calculateDuration(webInfo.value.startTime);
  const lastUpdate = calculateLastUpdate(webInfo.value.lastUpdateTime);
  // 将数据绑定到组件的相关部分
  webInfo.value.starttimeFormatted = startTimeFormatted;
  webInfo.value.lastUpdateFormatted = lastUpdateFormatted;
  webInfo.value.runtime = runtime;
  webInfo.value.lastUpdate = lastUpdate;

  window.addEventListener('scroll', updateScrollPercentage);
})

// 处理文章字数
const HtmlMdnumber = ref(0)
const htmlmdsize = (e) => {
  const text = e.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "").replace(/[ ]/g, "").replace(/[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+/g, "")
  HtmlMdnumber.value = formatNumberToK(text.length);
}


const { date: getCurrentDate, weekday: getWeekday, time: getTime } = useCurrentDateTime()

const announcementText = ref(``);

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

function formatNumberToK(num) {
  if (num < 1000) {
    return num;
  }
  else {
    return (num / 1000).toFixed(1) + 'k';
  }
}

const collection = ref(false)
const like = ref(false)
// 获取pinia
const userStore = useUserStore()
// 获取初始状态
const getlikeandcollect = async () => {
  await getIsLike({
    articleId: Number(route.params.id),
    userName: userStore.username
  }).then(res => {
    if (res.code === 0) {
      like.value = res.data
    }
  })
  await getIsCollect({
    articleId: Number(route.params.id),
    userName: userStore.username
  }).then(res => {
    if (res.code === 0) {
      collection.value = res.data
    }
  })
}

// 点赞
const likeArticle = async () => {
  await isLike({
    articleId: Number(route.params.id),
    userName: userStore.username
  }).then(res => {
    if (like.value === false) {
      ElMessage.success('点赞成功')
    } else {
      ElMessage.success('取消点赞')
    }
  })
  like.value = !like.value
  await articlelist()
}

// 收藏
const collectArticle = async () => {
  await isCollect({
    articleId: Number(route.params.id),
    userName: userStore.username
  }).then(res => {
    if (collection.value === false) {
      ElMessage.success('收藏成功')
      createCollect()
    } else {
      ElMessage.success('取消收藏')
      deleteCollec()
    }
  })
  collection.value = !collection.value
  await articlelist()
}

// 创建收藏
const createCollect = async () => {
  await addCollect({
    type: 1,
    targetId: Number(route.params.id),
    userName: userStore.username
  }).then(res => {
    if (res.code !== 0) {
      ElMessage.error(res.msg)
    }
  })
}

// 删除收藏
const deleteCollec = async () => {
  await deleteCollect({
    type: 1,
    targetId: Number(route.params.id),
    userName: userStore.username
  }).then(res => {
    if (res.code !== 0) {
      ElMessage.error(res.msg)
    }
  })
}



// 滚动条
const scrollPercentage = ref(0);
const updateScrollPercentage = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollPercentage.value = Math.round((scrollTop / scrollHeight) * 100);
};

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollPercentage);
});

// 分享
const copyToClipboard = async () => {
  try {
    const content = `欢迎访问博客文章：http://localhost:5174/article/${route.params.id}`;
    // 替换为你要分享的实际内容
    await navigator.clipboard.writeText(content);
    ElMessage.success("已复制分享链接");
  } catch (error) {
    ElMessage.error("复制失败，请联系网站管理员");
  }
}
</script>

<template>
  <Header />
  <div is-side-bar style=" background-color: var(--bg--article);">
    <el-container class="common-layout">
      <el-container class="main">
        <el-header class="header">
          <div class="header-img" v-lazy="articles.articleCover">
            <div class="text">
              <div style="display: flex; justify-content: start; align-items: center;">
                <div class="title">{{ articles.categoryName }} </div>
                <div style="margin-left:2rem" v-for="item in articles.tagsName" :key="item.id">#{{ item.name }}</div>
              </div>
              <div class="h1">{{ articles.articleTitle }}</div>
              <div class="unmber">
                <div class="statistics">字数统计:{{ HtmlMdnumber }}</div>
              </div>
              <div style="display: flex; justify-content: start; align-items: center;">
                <div class="statistics"
                     style="margin-right: 1rem; width:auto; height: 36px;margin-top: 1rem; padding: 0 3px;">
                  访问量:{{ articles.visitCount }}</div>
                <div class="statistics"
                     style="margin-right: 1rem; width:auto; height: 36px;margin-top: 1rem; padding: 0 3px;">
                  评论数:{{ articles.commentsCount }} </div>
                <div class="statistics"
                     style="margin-right: 1rem; width:auto; height: 36px;margin-top: 1rem; padding: 0 3px;">
                  点赞量:{{ articles.likesCount }} </div>
                <div class="statistics"
                     style="margin-right: 1rem; width:auto; height: 36px;margin-top: 1rem; padding: 0 3px;">
                  收藏量:{{ articles.favoritesCount }} </div>
              </div>
              <div style="display: flex; justify-content: start; align-items: center;">
                <div class="statistics"
                     style="margin-right: 1rem; width:auto; height: 36px;margin-top: 1rem; padding: 0 3px;">
                  发布:{{ articles.createTime }}</div>
              </div>
            </div>
          </div>
        </el-header>
        <el-main class="elmain">
          <MdPreview :editorId="id" :modelValue="text" :theme="mode" :onHtmlChanged="htmlmdsize" />
        </el-main>
        <el-footer class="footer">
          <el-divider border-style="dashed" content-position="left">
            <div style="display: flex;align-items: center; font-size: 1rem;">
              <svg-icon name="author_statement"></svg-icon>
              <span style="margin-left: 0.5em">声明</span>
            </div>
          </el-divider>
          <!-- 作者著作权 -->
          <div class="copyright">
            <div class="author">
              <svg-icon name="article_author" style="margin-right: 0.5em"></svg-icon>
              <strong>本文作者：{{ articles.userName }} </strong>
            </div>
            <div class="link">
              <svg-icon name="author_link" style="margin-right: 0.5em"></svg-icon>
              <strong>本文链接： </strong>
              <a class="copyright_a" href="">http://localhost:5173/article/{{ userId }}</a>
            </div>
            <div class="license">
              <div>
                <svg-icon name="author_copyright" style="margin-right: 0.5em"></svg-icon>
                <strong>版权声明： </strong>
              </div>
              <div class="license_text">
                本站所有文章除特别声明外，均采用
                &nbsp;
                <a class="copyright_a" href="" target="_blank">
                  CC BY-NC-SA 4.0
                </a> &nbsp;
                许可协议。转载请注明文章出处！
              </div>
            </div>
          </div>
          <!-- 尾部标签与点赞收藏分享 -->
          <div style="display: flex;justify-content: space-between;margin:0.6rem 0;">
            <div class="tagsName" @click="$router.push('/tabs')">
              <div v-for="item in articles.tagsName" class="tag"
                   style="margin: .5rem;padding: .5rem .9rem;border: 1px solid #ccc ;border-radius: 5px;">
                <div>#{{ item.name }}</div>
              </div>
            </div>
            <div class="like">
              <div class="icon">
                <div @click="likeArticle" style="pading:0.6rem 0; margin: 0 0.6rem;display: flex;align-items: center;">
                  <SvgIcon v-show="!like" name="like" style="margin-right: 0.5rem" />
                  <SvgIcon v-show="like" name="like-selected" style="margin-right: 0.5rem" />
                  <span>{{ articles.likesCount }}</span>
                </div>
              </div>
              <div class="icon">
                <div @click="collectArticle"
                     style="pading:0.6rem 0;margin: 0 0.6rem;display: flex;align-items: center;">
                  <SvgIcon v-show="!collection" name="collection" style="margin-right: 0.5rem" />
                  <SvgIcon v-show="collection" name="collection-selected" style="margin-right: 0.5rem" />
                  <span>{{ articles.favoritesCount }}</span>
                </div>
              </div>
              <div class="icon">
                <div @click="copyToClipboard" style="pading:0rem 0;margin: 0 0.6rem;display: flex;align-items: center;">
                  <SvgIcon name="share" style="margin-right: 0.5rem" />
                  <span>分享</span>
                </div>
              </div>
            </div>
          </div>
          <div class="categoryName">
            <div @click="$router.push('/category')" class="tag"
                 style="margin: .5rem;padding: .5rem .9rem;border: 1px solid #ccc ;border-radius: 5px;">
              <div>{{ articles.categoryName }}</div>
            </div>
          </div>
          <!-- 打赏 -->
          <div class="tipping">
            <el-tooltip class="box-item" effect="light" placement="top">
              <template #content>
                <div class="qrCode">
                  <div>
                    <div style="text-align: center;font-size: 1rem">微信</div>
                    <el-image src="https://s2.loli.net/2024/12/19/PGVvQJ9UIm2al6O.jpg" />
                  </div>
                </div>
              </template>
              <div class="tipping-icon">
                <svg-icon name="gift" style="margin-right: 0.5rem" />
                <span>ヾ(≧▽≦*)o！</span>
              </div>
            </el-tooltip>
          </div>
          <!-- 上/下 篇文章-->
          <div class="goOn">
            <!-- 上一篇 -->
            <div>
              <div>
                <el-link v-if="AroundTitle.prevTitle" @click="$router.push(`/article/${Number(route.params.id) - 1}`)">
                  上一篇：{{ AroundTitle.prevTitle }}
                </el-link>
              </div>
            </div>
            <!-- 下一篇 -->
            <div>
              <div>
                <el-link v-if="AroundTitle.nextTitle" @click="$router.push(`/article/${Number(route.params.id) + 1}`)">
                  下一篇：{{ AroundTitle.nextTitle }}
                </el-link>
              </div>
            </div>
          </div>
          <comment :type="1" :is-show-header="true" :author-Name="articles.userName" :type-id="articles.id"
                   v-if="articles.id" />
        </el-footer>
      </el-container>
      <el-aside class=" aside" style="overflow: visible">
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
        <Sidecard title="目录" prefixIcon="directory" :isScale="true" class="Mdlog">
          <Mdlog />
        </Sidecard>
      </el-aside>
    </el-container>
    <div style="margin-top: 4rem;"></div>
    <Foter />
  </div>
  <BRightLayout toTop scrollPercentage>
    <template #scroll_percentage>{{ scrollPercentage }}%</template>
  </BRightLayout>
</template>

<style lang="scss" scoped>
.common-layout {
  margin: 0 12.8vw;

  @media screen and (max-width: 1600px) {
    margin: 0 7%;
  }

  .main {
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

.qrCode {
  display: flex;
  width: 100%;
  height: 100%;

  div {
    display: flex;
    justify-content: center;
    flex-direction: column-reverse;
    margin: 0 0.5rem;
  }

  .el-image {
    width: 18em;
    height: 24em;
    object-fit: cover;
  }
}

// 目录
.Mdlog {
  height: auto;
  max-height: 80vh;
  overflow-y: scroll;
  top: 20px;
  position: sticky;
}

:deep(.md-editor-catalog-active) {
  &>span {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary-light-4);
    border-radius: 8px;
    font-weight: bold;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }
}

:deep(.md-editor-catalog) {
  span:hover {
    color: var(--el-color-primary-light-5);
  }
}

:deep(.md-editor-catalog-link) {
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;

  span {
    text-align: left;
    margin: 0.25rem 0.25rem;
  }
}

:deep(.md-editor-catalog-wrapper > .md-editor-catalog-link:first-of-type) {
  padding-top: 0;
}

.tagsName {
  display: flex;
  justify-content: space-between;

  :hover {
    background: var(--el-color-primary-light-5);
  }
}

.categoryName {
  display: flex;
  justify-content: space-between;

  :hover {
    background: var(--el-color-primary-light-5);
  }
}

.icon {
  display: flex;
  padding: 0.6rem;

  :hover {
    background: #ccc;
  }
}

.like {
  display: flex;
  margin: .5rem;

  :hover {
    background: #ccc;
  }
}

.prevTitle {
  :hover {
    background-color: blue;
  }
}

.nextTitle {
  :hover {
    background-color: blue;
  }
}
</style>