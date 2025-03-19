<script setup>
  import containerbg from '@/assets/imgs/card03.jpg';
  import { onMounted, ref, watch } from 'vue';
  import Foter from '@/components/Foter/index.vue';
  import { useRoute, useRouter } from 'vue-router';
  import ArticleList from '../ArticleList/index.vue';
  import { getArticleByTag } from '@/api/article';
  import { ElMessage } from 'element-plus'
  import dayjs from 'dayjs';


  const route = useRoute();
  const articlesList = ref();
  const isQueryArticle = ref(false);
  const title = ref('');


  // 创建一个响应式数据列表

  const tagList = ref([])
  const refresh = async () => {
    await getArticleByTag().then((res) => {
      if (res.code === 0) {
        tagList.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
  }

  onMounted(async () => {
    await refresh()
    if (route.params.id) {
      isQueryArticle.value = true
      articlesList.value = tagList.value[Number(route.params.id) - 1].articles
      articlesList.value.forEach((item) => {
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        item.tagsName = item.tagsName.map((tag, index) => ({
          id: index, // 使用索引作为 id
          name: tag
        }));
      })
      tagList.value.forEach((item) => {
        if (item.id == Number(route.params.id)) {
          item.isActive = true
          title.value = item.tagName
        } else {
          item.isActive = false
        }
      })
    }
  })



  // 地址栏是否有分类id
  watch(() => route.params.id, (id) => {
    if (id) {
      isQueryArticle.value = true
      articlesList.value = tagList.value[Number(id) - 1].articles
      articlesList.value.forEach((item) => {
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        item.tagsName = item.tagsName.map((tag, index) => ({
          id: index, // 使用索引作为 id
          name: tag
        }));
      })
      tagList.value.forEach((item) => {
        if (item.id == Number(id)) {
          item.isActive = true
          title.value = item.tagName
        } else {
          item.isActive = false
        }
      })
    } else {
      isQueryArticle.value = false
    }
  })


</script>

<template>
  <div class="common-layout">
    <div class="header">
      <div class="img_text">
        <img :src="containerbg" alt="" class="img">
        <div class="title">
          <div class="title_text">标签页</div>
          <div class="title_text2">标签</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div v-if="!isQueryArticle" style="display: flex;justify-content: center;align-items: center;">
        <div class="category_container">
          <div class="title">
            标签 博客
          </div>
          <div style="display: flex;">
            <div class="item_container" v-for="item in tagList" :key="item.id">
              <div>
                <div v-slide-in class="item" @click="$router.push(`/tabs/${item.id}`)">
                  <div class="item_text"># {{item.tagName}}</div>
                  <div class="item_num"><span>{{item.articles.length}}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isQueryArticle" style="display: flex;justify-content: center;align-items: center;">
        <div class="category_container">
          <div class="title">
            标签 - {{title}}
          </div>
          <div>
            <el-scrollbar>
              <div class="scrollbar-flex-content">
                <template v-for="item in category" :key="item.id">
                  <p @click="$router.push(`/tabs/${item.id}`)" class="scrollbar-item" :class="item.isActive?'active':''">
                    <span>{{item.name}}</span>
                  </p>
                </template>
              </div>
            </el-scrollbar>
          </div>
          <el-divider />
          <ArticleList :articleList="articlesList" />
        </div>
      </div>
    </div>
  </div>
  <Foter />
</template>

<style lang="scss" scoped>
.common-layout {
  .header {
    height: 50vh;
    .img_text {
      position: relative;
      .img {
        width: 100%;
        height: 50vh;
        object-fit: cover;
      }
      .title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-family: 'Open Sans', sans-serif;
      }
      .title_text {
        margin: 3vh 0;
        color: white;
        font-size: 4.6rem;
        font-weight: normal;
        text-shadow: 0 1px 0 hsl(174, 5%, 80%), 0 2px 0 hsl(174, 5%, 75%),
        0 3px 0 hsl(174, 5%, 70%), 0 4px 0 hsl(174, 5%, 66%),
        0 5px 0 hsl(174, 5%, 64%), 0 6px 0 hsl(174, 5%, 62%),
        0 7px 0 hsl(174, 5%, 61%), 0 8px 0 hsl(174, 5%, 60%),
        0 0 5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2),
        0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.2),
        0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.3);
      }
        $shadow: #be1d7b;
        $red: #5e0c01;
        $green: #14bbc7;
        $yellow: #ae8b17;
        $shadow: #35262f;
      .title_text2 {
        font-size: 1.5rem;
        transform: skew(-10deg);
        text-shadow: $shadow 1px 1px, $shadow 2px 2px, $shadow 3px 3px,
        $shadow 4px 4px, $shadow 5px 5px, $shadow 6px 6px;
        &:nth-child(1) {
          color: $red;
        }
        &:nth-child(2) {
          color: $green;
        }
        &:nth-child(3) {
          color: $yellow;
        }
      }
    }
  }
  .main {
    min-height: 50vh;
     background-color: var(--mao-background-color);
    .category_container{
      width: 80%;
      margin: 15vh 0;
      background-color: var(--mao-bg-content);
      border-radius: 10px;
      box-shadow: 0 0 10px #0003;
      padding: 1rem;
      .title{
        font-size: 1.72rem;
        padding: 1rem;
        color: var(--mao-hearder-color);
        font-weight: 600;
      }
      .item_container{
        .item{
          display: flex;
          font-size: 1.2rem;
          margin: .5rem;
          padding: .5rem;
          border: 1px solid var(--el-border-color);
          border-radius: 5px;
          cursor: pointer;
          transition: all .3s;
          color: #565352;
          &:hover{
              border: 1px solid blue;
          }
          .item_text{
            display: flex;
            font-size: 1.33rem;
            font-weight: 700;
            padding: 0.6rem 1rem;
            position: relative;
          }
          .item_num{
            display: flex;
            width: 0.4rem;
            align-items: center;
            justify-content: center;
            color: #fff;
            margin: 0.3rem 0;
            font-size: .6rem;
            background-color: #555;
            padding: .1rem .5rem;
            border-radius: .7em;
          }
        }
      }
    }
  }
}
.scrollbar-flex-content{
  display: flex;
  white-space: nowrap; /* 防止内容换行 */
  .scrollbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5em;
    margin: 0 1em;
    padding: 0.5rem 1rem;
    text-align: center;
    border-radius: 0.6em;
    border: 1px solid var(--el-color-danger-light-7);
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
    &:hover {
      cursor: pointer;
      color: grey;
      background: var(--el-color-danger-light-7);
    }
  }
}

</style>
