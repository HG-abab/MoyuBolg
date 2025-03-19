<template>
  <div class="profile-container">
    <!-- 个人中心页面头部 -->
    <div class="profile-header">
      <div class="cover-photo">
        <div class="edit-cover" @click="triggerCoverUpload">
          <el-icon>
            <Camera />
          </el-icon>
          <span>更换封面</span>
        </div>
        <input type="file" ref="coverInput" style="display: none" @change="handleCoverChange" accept="image/*">
      </div>

      <!-- 个人信息区域 -->
      <div class="user-profile-section">
        <div class="avatar-container">
          <el-avatar :size="100" :src="userInfo.avatar || defaultAvatar" />
          <div class="avatar-edit" @click="triggerAvatarUpload">
            <el-icon>
              <Camera />
            </el-icon>
          </div>
          <input type="file" ref="avatarInput" style="display: none" @change="handleAvatarChange" accept="image/*">
        </div>

        <div class="user-info">
          <h1 class="username">{{ userInfo.nickname || userInfo.username }}</h1>
          <p class="bio">{{ userInfo.bio || '这个人很懒，什么都没有留下...' }}</p>

          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ stats.articles }}</div>
              <div class="stat-label">文章</div>
            </div>
            <div class="divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.comments }}</div>
              <div class="stat-label">评论</div>
            </div>
            <div class="divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.likes }}</div>
              <div class="stat-label">获赞</div>
            </div>
          </div>

          <div class="user-actions">
            <el-button type="primary" @click="showEditProfile = true">
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
                <h3 class="article-title">{{ article.title }}</h3>
                <span class="article-date">{{ article.date }}</span>
              </div>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-footer">
                <div class="article-tags">
                  <el-tag v-for="tag in article.tags" :key="tag" size="small" effect="plain" class="tag-item">
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="article-stats">
                  <span class="stat-item"><el-icon>
                      <View />
                    </el-icon> {{ article.views }}</span>
                  <span class="stat-item"><el-icon>
                      <ChatDotRound />
                    </el-icon> {{ article.comments }}</span>
                  <span class="stat-item"><el-icon>
                      <Star />
                    </el-icon> {{ article.likes }}</span>
                </div>
              </div>
              <div class="article-actions">
                <el-button type="primary" plain size="small" @click="viewArticle(article.id)">
                  查看文章
                </el-button>
                <el-button type="danger" plain size="small" @click="deleteArticle(article.id)">
                  删除
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
                <h3 class="favorite-title">{{ favorite.title }}</h3>
              </div>
              <p class="favorite-excerpt">{{ favorite.excerpt }}</p>
              <div class="favorite-footer">
                <div class="favorite-author">
                  <el-avatar :size="24" :src="favorite.authorAvatar"></el-avatar>
                  <span>{{ favorite.authorName }}</span>
                </div>
                <span class="favorite-date">{{ favorite.date }}</span>
              </div>
              <div class="favorite-actions">
                <el-button type="primary" plain size="small" @click="viewFavorite(favorite.id)">
                  查看原文
                </el-button>
                <el-button type="danger" plain size="small" @click="removeFavorite(favorite.id)">
                  取消收藏
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的评论" name="comments">
          <div class="comments-list">
            <div v-for="comment in userComments" :key="comment.id" class="comment-card">
              <div class="comment-article">
                评论于：<router-link :to="`/article/${comment.articleId}`">{{ comment.articleTitle }}</router-link>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-footer">
                <span class="comment-date">{{ comment.date }}</span>
                <div class="comment-actions">
                  <el-button type="text" size="small" @click="deleteComment(comment.id)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="设置" name="settings">
          <div class="settings-section">
            <h3 class="section-title">账号设置</h3>

            <el-form label-position="top" :model="accountSettings" class="settings-form">
              <el-form-item label="邮箱">
                <el-input v-model="accountSettings.email" placeholder="请输入邮箱地址"></el-input>
              </el-form-item>

              <el-form-item label="修改密码">
                <el-input v-model="accountSettings.oldPassword" type="password" placeholder="当前密码"
                          show-password></el-input>
                <el-input v-model="accountSettings.newPassword" type="password" placeholder="新密码" show-password
                          class="mt-3"></el-input>
                <el-input v-model="accountSettings.confirmPassword" type="password" placeholder="确认新密码" show-password
                          class="mt-3"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveAccountSettings">保存修改</el-button>
              </el-form-item>
            </el-form>

            <el-divider></el-divider>

            <h3 class="section-title">隐私设置</h3>
            <el-form label-position="top" :model="privacySettings" class="settings-form">
              <el-form-item>
                <el-checkbox v-model="privacySettings.showEmail">公开我的邮箱</el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="privacySettings.showStats">显示我的统计数据</el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="savePrivacySettings">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 编辑个人资料对话框 -->
    <el-dialog v-model="showEditProfile" title="编辑个人资料" width="500px">
      <el-form :model="editForm" label-position="top">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input v-model="editForm.bio" type="textarea" :rows="4" placeholder="介绍一下自己吧..."></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditProfile = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

// 当前激活的标签
const activeTab = ref('articles');

// 用户信息
const userInfo = reactive({
  username: '墨鱼开发',
  nickname: '墨鱼开发者',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  bio: '热爱编程和技术分享的博主，专注于前端开发与用户体验设计。'
});

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

// 用户统计信息
const stats = reactive({
  articles: 42,
  comments: 128,
  likes: 256
});

// 编辑个人资料
const showEditProfile = ref(false);
const editForm = reactive({
  nickname: userInfo.nickname,
  bio: userInfo.bio
});

// 用户文章列表
const userArticles = ref([
  {
    id: 1,
    title: 'Vue3 组合式 API 实战指南',
    date: '2023-09-15',
    excerpt: 'Vue3 的组合式 API 为我们提供了更灵活的代码组织方式，本文将探讨如何在实际项目中运用组合式 API 来提升开发效率...',
    tags: ['Vue', '前端', '教程'],
    views: 1520,
    comments: 32,
    likes: 86
  },
  {
    id: 2,
    title: 'Element Plus 主题定制全攻略',
    date: '2023-08-22',
    excerpt: '想要让你的 Element Plus 组件与众不同？本文将详细介绍如何通过变量覆盖、样式注入等方式定制独特的主题...',
    tags: ['Element Plus', 'CSS', '主题'],
    views: 945,
    comments: 17,
    likes: 54
  },
  {
    id: 3,
    title: '从零开始构建个人博客系统',
    date: '2023-07-10',
    excerpt: '分享我构建个人博客的全过程，从需求分析、技术选型到最终部署上线，一步步打造自己的线上空间...',
    tags: ['博客', '全栈', 'Vue'],
    views: 1876,
    comments: 46,
    likes: 125
  }
]);

// 收藏夹
const favorites = ref([
  {
    id: 101,
    title: '如何优化 Vue 应用性能',
    excerpt: '本文介绍了多种提升 Vue 应用性能的实用技巧，包括虚拟列表、懒加载、组件缓存等核心优化方法...',
    authorName: '技术先锋',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    date: '2023-06-20'
  },
  {
    id: 102,
    title: 'CSS Grid 布局完全指南',
    excerpt: 'Grid 布局是现代 CSS 中最强大的布局系统，本文将带你掌握 Grid 的各种属性和实际应用场景...',
    authorName: '前端达人',
    authorAvatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    date: '2023-05-15'
  }
]);

// 用户评论
const userComments = ref([
  {
    id: 201,
    content: '这篇文章写得非常详细，解决了我在项目中遇到的问题，感谢分享！',
    articleId: 405,
    articleTitle: 'Vite 与 Webpack 对比分析',
    date: '2023-09-10'
  },
  {
    id: 202,
    content: '代码示例很有帮助，但对于初学者来说可能需要更多的解释和上下文。',
    articleId: 308,
    articleTitle: 'TypeScript 高级类型应用',
    date: '2023-08-27'
  }
]);

// 账号设置
const accountSettings = reactive({
  email: 'example@example.com',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 隐私设置
const privacySettings = reactive({
  showEmail: false,
  showStats: true
});

// 处理头像上传
const avatarInput = ref(null);
const triggerAvatarUpload = () => {
  avatarInput.value.click();
};

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 这里可以添加文件类型检查和大小限制

  // 模拟头像上传
  const reader = new FileReader();
  reader.onload = (e) => {
    userInfo.avatar = e.target.result;
    ElMessage.success('头像更新成功');
  };
  reader.readAsDataURL(file);
};

// 处理封面上传
const coverInput = ref(null);
const triggerCoverUpload = () => {
  coverInput.value.click();
};

const handleCoverChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 模拟封面上传
  ElMessage.success('封面图片更新成功');
};

// 保存编辑的个人资料
const saveProfile = () => {
  userInfo.nickname = editForm.nickname;
  userInfo.bio = editForm.bio;

  ElMessage.success('个人资料更新成功');
  showEditProfile.value = false;
};

// 文章相关操作
const viewArticle = (id) => {
  router.push(`/article/${id}`);
};

const deleteArticle = (id) => {
  ElMessage.success(`文章(ID: ${id})已删除`);
  userArticles.value = userArticles.value.filter(article => article.id !== id);
};

const createNewArticle = () => {
  router.push('/editor');
};

// 收藏夹相关操作
const viewFavorite = (id) => {
  router.push(`/article/${id}`);
};

const removeFavorite = (id) => {
  ElMessage.success(`已从收藏夹移除(ID: ${id})`);
  favorites.value = favorites.value.filter(fav => fav.id !== id);
};

// 评论相关操作
const deleteComment = (id) => {
  ElMessage.success(`评论(ID: ${id})已删除`);
  userComments.value = userComments.value.filter(comment => comment.id !== id);
};

// 保存账号设置
const saveAccountSettings = () => {
  if (accountSettings.newPassword !== accountSettings.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }

  ElMessage.success('账号设置已保存');
  accountSettings.oldPassword = '';
  accountSettings.newPassword = '';
  accountSettings.confirmPassword = '';
};

// 保存隐私设置
const savePrivacySettings = () => {
  ElMessage.success('隐私设置已保存');
};
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
</style>