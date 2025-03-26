<template>
  <div class="profile-container">
    <!-- 个人中心页面头部 -->
    <div class="profile-header">
      <div class="cover-photo">
        <img :src="userInfoList.webmasterProfileBackground" alt="Cover photo" />
      </div>
      <!-- 个人信息区域 -->
      <div class="user-profile-section">
        <div class="avatar-container">
          <el-avatar :size="100" :src="userInfoList.avatar || defaultAvatar" />
          <input type="file" ref="avatarInput" style="display: none" @change="handleAvatarChange" accept="image/*">
        </div>

        <div class="user-info">
          <h1 class="username">{{ userInfoList.name }}</h1>
          <p class="bio">{{ userInfoList.copy || '这个人很懒，什么都没有留下...' }}</p>

          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ userInfoList.articleCount || 0 }}</div>
              <div class="stat-label">文章</div>
            </div>
            <div class="divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfoList.categoryCount || 0 }}</div>
              <div class="stat-label">评论</div>
            </div>
            <div class="divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfoList.commentCount || 0 }}</div>
              <div class="stat-label">获赞</div>
            </div>
          </div>

          <div class="user-actions">
            <el-button type="primary" @click="followUser">
              <el-icon>
                <Edit />
              </el-icon>
              编辑资料
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容展示区域 -->
    <div class="profile-content">
      <el-tabs v-model="activeTab" class="content-tabs">
        <el-tab-pane label="我的文章" name="articles">
          <div class="articles-grid">
            <div v-for="article in userArticles" :key="article.id" class="article-card">
              <div class="article-header">
                <h3 class="article-title">{{ article.articleTitle }}</h3>
                <span class="article-date">{{ article.createTime }}</span>
              </div>
              <p class="article-excerpt">{{ Filtercontent(article.articleContent, 60) }}</p>
              <div class="article-footer">
                <div class="article-tags">
                  <el-tag v-for="tag in article.tagsName" :key="tag" size="small" effect="plain" class="tag-item">
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="article-stats">
                  <span class="stat-item"><el-icon>
                      <View />
                    </el-icon> {{ article.visitCount }}</span>
                  <span class="stat-item"><el-icon>
                      <ChatDotRound />
                    </el-icon> {{ article.commentsCount }}</span>
                  <span class="stat-item"><el-icon>
                      <Star />
                    </el-icon> {{ article.favoritesCount }}</span>
                </div>
              </div>
              <div class="article-actions">
                <el-button type="primary" plain size="small" @click="viewArticle(article.id)">
                  查看文章
                </el-button>
              </div>
            </div>

            <!-- 添加文章卡片 -->
            <div class="add-article-card" @click="createNewArticle">
              <el-icon>
                <Plus />
              </el-icon>
              <p>写新文章</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="收藏夹" name="favorites">
          <div class="favorites-list">
            <div v-for="favorite in favorites" :key="favorite.id" class="favorite-card">
              <div class="favorite-header">
                <h3 v-if="favorite.type === 1" class="favorite-title">{{ Filtercontent(favorite.content,8) }}</h3>
              </div>
              <p  class="favorite-excerpt">{{ favorite.content }}</p>
              <div class="favorite-footer">
                <div class="favorite-author">
                  <el-avatar :size="24" :src="favorite.avatar"></el-avatar>
                  <span>{{ favorite.authorName }}</span>
                </div>
                <span class="favorite-date">{{ favorite.createTime }}</span>
              </div>
              <div class="favorite-actions">
                <el-button type="primary" plain size="small" @click="viewFavorite(favorite.targetId, favorite.type)">
                  查看原文
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的评论" name="comments">
          <div class="comments-list">
            <div v-for="comment in userComments" :key="comment.id" class="comment-card">
              <div class="comment-article">
                评论于：<router-link v-if="comment.type === 1" :to="`/article/${comment.typeId}`">{{ comment.commentTitle }}</router-link>
                <router-link v-else :to="`/message/detail/${comment.typeId}`">{{ comment.commentTitle }}</router-link>
              </div>
              <div class="comment-content">{{ comment.commentContent }}</div>
              <div class="comment-footer">
                <span class="comment-date">{{ comment.createTime }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { userInfo } from '@/api/user';
import { getIsCollect, getuserNameArticle } from '../../api/article';
import { getComment } from '../../api/comment'
import dayjs from "dayjs";
import { getCollect } from '../../api/collect';

const router = useRouter();
const userStore = useUserStore();
// 当前激活的标签
const activeTab = ref('articles');
// 用户信息
const userInfoList = ref({});

const refreshUserInfo = async () => {
  await userInfo(userStore.userId).then((res) => {
    if (res.code === 0) {
      userInfoList.value = res.data;
    } else {
      ElMessage.error(res.message);
    }
  })
  await getuserNameArticle(userStore.username).then((res) => {
    if (res.code === 0) {
      res.data.forEach((item) => {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss");
      })
      userArticles.value = res.data;
    } else {
      ElMessage.error(res.message);
    }
  })
  await getComment(userStore.username).then((res) => {
    if (res.code === 0) {
      userComments.value = res.data;
      res.data.forEach((item) => {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss");
      })
    } else {
      ElMessage.error(res.message);
    }
  })
  await getCollect(userStore.username).then((res) => {
    if (res.code === 0) {
      favorites.value = res.data;
      res.data.forEach((item) => {
        item.createTime = dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss");
      })
    } else {
      ElMessage.error(res.message);
    }
  })
}

onMounted(() => {
  refreshUserInfo();
})

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
// 用户文章列表
const userArticles = ref([]);

const Filtercontent = (e, index) => {
  return e.replace(/[*#>`~\-\\[\]()\s]|(\n\n)/g, '').substring(0, index) + '...';
}
// 收藏夹
const favorites = ref([]);
// 用户评论
const userComments = ref([]);

// 文章相关操作
const viewArticle = (id) => {
  router.push(`/article/${id}`);
};

// 收藏夹相关操作
const viewFavorite = (id,type) => {
  if (type === 1) { 
    router.push(`/article/${id}`);
  } else {
    router.push(`/message/detail/${id}`);
  }
};


const followUser = () => {
  window.open('http://localhost:5173', '_blank');
}

const createNewArticle = () => {
  window.open('http://localhost:5173/publish', '_blank');
}
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100%;
  min-height: calc(100vh - 60px); // 减去导航栏高度
  background-color: #f5f7fa;
  padding: 30px;

  .profile-header {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    margin-bottom: 30px;

    .cover-photo {
      height: 280px;
      background-image: linear-gradient(135deg, #67c6e7, #5872e7);
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.1);
      }

      .edit-cover {
        position: absolute;
        right: 20px;
        bottom: 20px;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

        &:hover {
          background: #fff;
          transform: translateY(-2px);
        }

        .el-icon {
          margin-right: 6px;
          font-size: 16px;
        }
      }
    }

    .user-profile-section {
      display: flex;
      padding: 0 30px 30px;
      position: relative;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .avatar-container {
        margin-top: -50px;
        margin-right: 30px;
        position: relative;
        z-index: 1;

        @media (max-width: 768px) {
          margin-right: 0;
          margin-bottom: 20px;
        }

        .el-avatar {
          border: 4px solid #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        .avatar-edit {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #5872e7;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid #fff;
          transition: all 0.2s ease;

          &:hover {
            transform: scale(1.1);
          }

          .el-icon {
            font-size: 16px;
          }
        }
      }

      .user-info {
        padding-top: 20px;
        flex: 1;

        .username {
          color: #262626;
          font-size: 24px;
          margin: 0 0 8px;
          font-weight: 600;
        }

        .bio {
          color: #666;
          margin: 0 0 25px;
          font-size: 15px;
          line-height: 1.6;
          max-width: 80%;

          @media (max-width: 768px) {
            max-width: 100%;
          }
        }

        .user-stats {
          display: flex;
          margin-bottom: 25px;

          @media (max-width: 768px) {
            justify-content: center;
          }

          .stat-item {
            text-align: center;
            padding: 0 20px;

            &:first-child {
              padding-left: 0;

              @media (max-width: 768px) {
                padding-left: 20px;
              }
            }

            .stat-value {
              font-size: 24px;
              font-weight: 600;
              color: #262626;
            }

            .stat-label {
              font-size: 14px;
              color: #8c8c8c;
              margin-top: 5px;
            }
          }

          .divider {
            width: 1px;
            background-color: #eee;
            margin: 5px 20px;
          }
        }

        .user-actions {
          .el-button {
            padding: 10px 24px;
            border-radius: 8px;
            transition: all 0.3s;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(88, 114, 231, 0.3);
            }

            .el-icon {
              margin-right: 8px;
            }
          }
        }
      }
    }
  }

  // 内容区域
  .profile-content {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    padding: 20px;

    .content-tabs {
      :deep(.el-tabs__header) {
        margin-bottom: 25px;
      }

      :deep(.el-tabs__item) {
        font-size: 16px;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;

        &.is-active {
          color: #5872e7;
          font-weight: 500;
        }
      }

      :deep(.el-tabs__active-bar) {
        background-color: #5872e7;
        height: 3px;
      }
    }

    // 文章网格布局
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;

      .article-card,
      .add-article-card {
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
        border: 1px solid #eaeaea;
        height: 100%;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .article-header {
          margin-bottom: 15px;

          .article-title {
            font-size: 18px;
            color: #262626;
            margin: 0 0 8px;
            font-weight: 600;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .article-date {
            font-size: 14px;
            color: #8c8c8c;
          }
        }

        .article-excerpt {
          color: #595959;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 15px;
          flex-grow: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .article-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 15px;

          .article-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .tag-item {
              margin-right: 0;
            }
          }

          .article-stats {
            display: flex;
            font-size: 13px;
            color: #8c8c8c;

            .stat-item {
              display: flex;
              align-items: center;
              margin-right: 15px;

              .el-icon {
                margin-right: 5px;
                font-size: 14px;
              }
            }
          }
        }

        .article-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: auto;
        }
      }

      .add-article-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #f9f9f9;
        border: 2px dashed #d9d9d9;
        color: #8c8c8c;

        &:hover {
          background-color: #f0f0f0;
          border-color: #5872e7;
          color: #5872e7;
        }

        .el-icon {
          font-size: 36px;
          margin-bottom: 10px;
        }

        p {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    // 收藏夹
    .favorites-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;

      .favorite-card {
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
        border: 1px solid #eaeaea;
        height: 100%;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .favorite-header {
          margin-bottom: 15px;

          .favorite-title {
            font-size: 18px;
            color: #262626;
            margin: 0;
            font-weight: 600;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }

        .favorite-excerpt {
          color: #595959;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 15px;
          flex-grow: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .favorite-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          .favorite-author {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #595959;

            .el-avatar {
              margin-right: 8px;
            }
          }

          .favorite-date {
            font-size: 13px;
            color: #8c8c8c;
          }
        }

        .favorite-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: auto;
        }
      }
    }

    // 评论列表
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .comment-card {
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
        border: 1px solid #eaeaea;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .comment-article {
          font-size: 14px;
          color: #8c8c8c;
          margin-bottom: 10px;

          a {
            color: #5872e7;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .comment-content {
          font-size: 15px;
          color: #262626;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .comment-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .comment-date {
            font-size: 13px;
            color: #8c8c8c;
          }
        }
      }
    }

    // 设置部分
    .settings-section {
      .section-title {
        font-size: 18px;
        color: #262626;
        margin: 0 0 20px;
      }

      .settings-form {
        max-width: 600px;
        margin-bottom: 40px;

        .el-form-item__label {
          font-weight: 500;
          color: #262626;
        }

        .mt-3 {
          margin-top: 12px;
        }
      }

      .el-divider {
        margin: 30px 0;
      }
    }
  }

  // 编辑个人资料对话框
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
      margin: 0;
      padding: 20px;
      background: #f9f9f9;
      border-bottom: 1px solid #eaeaea;
    }

    .el-dialog__body {
      padding: 30px;
    }

    .el-form-item__label {
      font-weight: 500;
    }
  }
}

// 用于小屏幕的响应式调整
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;

    .profile-content {
      padding: 15px;

      .articles-grid,
      .favorites-list {
        grid-template-columns: 1fr;
      }
    }
  }
}

.profile-container {
  width: 100%;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
  padding: 30px;
  box-sizing: border-box; // 添加这一行确保padding不会增加总宽度
  overflow-x: hidden; // 防止横向滚动

  // 其他样式保持不变...

  .profile-content {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    padding: 20px;
    max-width: 100%; // 确保不会超出容器
    box-sizing: border-box; // 重要

    // 文章网格布局
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); // 调整最小宽度
      gap: 20px;
      width: 100%; // 确保宽度不超出
    }

    // 收藏夹
    .favorites-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); // 调整最小宽度
      gap: 20px;
      width: 100%; // 确保宽度不超出
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;

    .profile-header {
      .user-profile-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0 15px 15px;
      }

      .avatar-container {
        margin-right: 0;
        margin-bottom: 15px;
      }

      .user-info {
        .bio {
          max-width: 100%;
        }

        .user-stats {
          justify-content: center;
        }
      }
    }

    .profile-content {
      padding: 15px;

      .articles-grid,
      .favorites-list {
        grid-template-columns: 1fr;
      }
    }
  }
}

.cover-photo {
  width: 100%;
  /* 设置宽度 */
  height: 300px;
  /* 设置高度 */
}

.cover-photo img {
  width: 100%;
  /* 图片填充父元素宽度 */
  height: 100%;
  /* 图片填充父元素高度 */
  object-fit: cover;
  /* 保持图片比例并覆盖 */
}

// 内容区域样式优化
.profile-content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-top: 20px;
  overflow: hidden; // 防止内容溢出
  box-sizing: border-box;

  // 标签页样式调整
  .content-tabs {
    :deep(.el-tabs__nav-wrap) {
      padding: 0 20px;
    }

    :deep(.el-tabs__content) {
      padding: 0 10px;
    }
  }

  // 文章和收藏夹网格布局统一
  .articles-grid,
  .favorites-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;

    // 卡片通用样式
    .article-card,
    .favorite-card,
    .add-article-card {
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
      }
    }

    // 添加文章卡片特殊样式
    .add-article-card {
      align-items: center;
      justify-content: center;
      background-color: #f9f9f9;
      border: 2px dashed #e0e0e0;
      color: #999;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #5872e7;
        color: #5872e7;
        background-color: #f5f7ff;
      }

      .el-icon {
        font-size: 32px;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  // 评论列表样式优化
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;

    .comment-card {
      background-color: #fff;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #f0f0f0;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      }

      .comment-article {
        font-size: 13px;
        color: #888;
        margin-bottom: 8px;

        a {
          color: #5872e7;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .comment-content {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        margin-bottom: 12px;
      }

      .comment-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .profile-content {
    padding: 15px;

    .articles-grid,
    .favorites-list {
      grid-template-columns: 1fr;
      padding: 5px;
    }

    .content-tabs {
      :deep(.el-tabs__nav-wrap) {
        padding: 0 10px;
      }
    }
  }
}
</style>