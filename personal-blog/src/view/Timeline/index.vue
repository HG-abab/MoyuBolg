<script setup>
  import containerbg from '@/assets/imgs/card03.jpg';
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
  import { getAllArticle } from '@/api/article';
  import dayjs from 'dayjs';
  import { ElMessage } from 'element-plus'

  const timebgRef = ref(null);

  const timilinList = ref([])
  const getArticleList = async () => {
    await getAllArticle().then(res => {
      if (res.code === 0) {
        timilinList.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    })
  }


  // 处理数据
  const handleData = (data) => {
    data = data.map((item) => {
      item.content = item.articleContent.replace(/[*#>`~\-\\[\]()\s]|(\n\n)/g, '').substring(0, 60) + '...';
      item.published = item.createTime.substring(0, 10);
      item.updated = item.createTime.substring(0, 10);
      return item;
    })
    // 根据 published 字段排序 且重新划分
    const groupedArticles = computed(() => {
      return data.reduce((groups, article) => {
        const year = new Date(article.published).getFullYear();
        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(article);
        return groups;
      }, {})
    })
    return groupedArticles.value
  }

  const items = ref([]);
  onMounted(async () => {
    await getArticleList()
    items.value = handleData(timilinList.value)
    await nextTick(() => {
      const timebgR = timebgRef.value;
      const itemElements = timebgR.querySelectorAll('.item');
      const itemsArray = Array.from(itemElements);
      // // 将第一个时间轴项目激活，并设置时间轴背景图片为第一个项目的图片
      itemsArray[0].classList.add('item--active');
      timebgR.style.backgroundImage = `url(${itemsArray[0].querySelector('.img').src})`;

      // 监听鼠标滚动事件
      window.addEventListener('scroll', () => {
        const pos = window.pageYOffset;
        itemsArray.forEach((item, index) => {
          const itemTop = item.offsetTop;
          const itemHeight = item.offsetHeight + item.offsetTop;

          if (index === itemsArray.length - 2 && pos > itemTop + item.offsetHeight / 2) {
            itemsArray.forEach(item => item.classList.remove('item--active'));
            timebgR.style.backgroundImage = `url(${itemsArray[itemsArray.length - 1].querySelector('.img').src})`;
            itemsArray[itemsArray.length - 1].classList.add('item--active');
          } else if (pos <= itemHeight - 10 && pos >= itemTop) {
            timebgR.style.backgroundImage = `url(${item.querySelector('.img').src})`;
            itemsArray.forEach(item => item.classList.remove('item--active'));
            item.classList.add('item--active');
          }
        })
      })
    })
  })



</script>

<template>
  <div class="common-layout">
    <div class="header">
      <div class="img_text">
        <img :src="containerbg" alt="" class="img">
        <div class="title">
          <div class="title_text">时间轴</div>
          <div class="title_text2">timeline</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div v-slide-in class="category_container" ref="timebgRef">
        <template v-for="(item,year) in items" :key="item.id">
          <div class="year">--{{year}}--</div>
          <div class="item" v-for="i in item" :data-text="i.published" :key="i.id" @click="$router.push(`/article/${i.id}`)">
            <div class="content">
              <img class="img" :src="i.articleCover" />
              <h2 class="content-title">{{ i.title }}</h2>
              <p class="content-desc">{{ i.content }}</p>
            </div>
          </div>
        </template>
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
    display: flex;
    justify-content: center;
    min-height: 50vh;
     background-color: var(--mao-background-color);
    .category_container{
      display: flex; 
      flex-direction: column;
      width: 80%;
      margin: 15vh 0;
      background-color: var(--mao-bg-content);
      border-radius: 10px;
      box-shadow: 0 0 10px #0003;
      padding: 1rem;
      position: relative;
      background-attachment: fixed;
      background-size: cover;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(99, 99, 99, 0.8);
        content: "";
      }
      .year{
        font-size: 2.2rem;
        display: flex;
        justify-content: center;
        background-color: #fff;
        position: sticky;
        top: 5rem;
        font-weight: 700;
        margin: 4rem 20%;
        padding: 0.5rem 0;
        color: gray;
        border-radius: 0.6em;
        opacity: 0.8;
      }
      .item {
        padding: 40px 0;
        opacity: .3;
        filter: blur(2px);
        transition: .5s;
        box-sizing: border-box;
        width: calc(30% - 2rem);
        display: flex;
        position: relative;
        transform: translateY(-80px);
        cursor: pointer;
        .content{
          position: relative;
          img{
            max-width: 100%;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4);
          }
          .content-title{
            font-weight: normal;
            font-size: 1.5em;
            margin: -10px 0 0 0;
            transition: 0.4s;
            padding: 0 10px;
            box-sizing: border-box;
            color: #fff;
          }
          .content-desc{
            margin: 0;
            font-size: 15px;
            box-sizing: border-box;
            color: rgba(255, 255, 255, 0.7);
            line-height: 25px;
          }
        }
        &:nth-child(even) {
          align-self: flex-end;
          margin-right: 20%;
        }
        &:nth-child(odd) {
          margin-left: 20%;
        }
        &:nth-child(even):before {
          right: auto;
          text-align: right;
          left: calc(-100% - 56px);
          padding-left: 0;
          border-left: none;
          border-right: 2px solid rgba(255, 255, 255, 0.5);
          padding-right: 15px;
        }
      }
    }
  }
}

.item--active {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: blur(0px) !important;
}

.item--active:before {
  top: 50% !important;
  transition: 0.3s all 0.2s !important;
  opacity: 1 !important;
}

.item--active .content-title {
  margin: -30px 0 20px 0 !important;
}

.category_container::after{
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 95%;
  background: rgba(255, 255, 255, 0.169);
}

.item:before {
  content: attr(data-text);
  letter-spacing: 3px;
  width: 100%;
  position: absolute;
  color: rgba(255, 255, 255, 0.5);
  border-left: 4px solid rgba(255, 255, 255, 0.5);
  top: 50%;
  transform: translateY(-50%);
  margin-top: -3rem;
  padding-left: 0.5rem;
  opacity: 0;
  right: calc(-100% - 56px);
  font: 900 1.5em '';
}

.category_container {
  transition: background-image 0.5s ease-in-out;
}


</style>
