<template>
  <div class="category">
    <template v-for="item in articleList" :key="item.id">
      <div>
        <div class="article_left">
          <img v-lazy="item.articleCover" alt="预览图">
        </div>
        <div class="article_right">
          <span class="article_time">{{item.createTime}}</span>
          <span @click="$router.push(`/article/${item.id}`)" class="article_title"><span>{{item.articleTitle}}</span> <span>
              <SvgIcon name="heat" />{{item.visitCount}}
            </span></span>
          <div class="article_tag">
            <span v-for="tag in item.tagsName" :key="tag.id"># {{tag.name}} </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup >
  defineProps({
    articleList: {
      type: Array,
      required: true
    }
  })
</script>

<style scoped lang="scss">
.category{
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  div {
    margin: 0.5rem 0;
    width: 50%;
    display: flex;
    transition: all 0.3s;
    @media screen and (max-width: 1100px) {
      width: 100%;
    }
    .article_left {
      border-radius: 1em;
      width: 12.5em;
      height: 6em;
      overflow: hidden;
      border: #22b776 2px solid;

      img {
        width: 100%;
        height: 100%;
        transition: transform 0.3s linear;
        object-fit: cover;
        &:hover {
          transform: scale(1.09);
        }
      }
    }

    .article_right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 0.4rem;
      margin-top: 1rem;

      .article_title {
        margin-top: 1.1rem ;
        margin-bottom: 0.4rem ;
        font-size: 1.2rem;
        font-weight: bold;
        transition: color 0.3s;
        display: flex;
        justify-content: space-between;

        span:last-child {
          font-size: 0.8rem;
          color: grey;
          display: flex;
          align-items: center;
        }

        &:hover {
          color: #c55011;
          cursor: pointer;
        }
      }

      .article_time {
        font-size: 1rem;
        color: rgb(132, 129, 129);
      }

      .article_tag {
        display: flex;
        align-items: center;
        width: 100%;

        span {
          margin-right: 1rem;
          font-size: 1rem;
          color: grey;
          transition: color 0.3s;
          &:hover {
            cursor: pointer;
            color: #c55011;
          }
        }
      }
    }
  }
}
</style>