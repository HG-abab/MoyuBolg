<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getArticle, updateArticle, addArticle } from '../../api/article';
import { getTagList } from '../../api/tag';
import { getcategoryList } from '../../api/category';
import { uploadImg } from '../../api/upload';
import Header from '../../components/header/index.vue';
import 'md-editor-v3/lib/style.css';
import { MdEditor } from 'md-editor-v3';

const route = useRoute();
const router = useRouter();
const articleId = route.params.id;

// 表单数据
const formData = ref({
  articleId: undefined,
  categoryName: undefined,
  tagsName: undefined,
  articleCover: undefined,
  articleTitle: undefined,
  articleContent: undefined,
  articleType: 1,
  userName: undefined,
  isTop: 0,
  status: 1,
});

// 分类和标签数据
const categoryList = ref([]);
const tagList = ref([]);

// 封面图片
const previewBase64 = ref('');
const fileList = ref([]);

// 加载状态
const loading = ref(false);

// 获取文章数据
const fetchArticleData = async () => {
  try {
    loading.value = true;
    const res = await getArticle(articleId);
    if (res.code === 0) {
      formData.value = res.data[0];
      previewBase64.value = res.data[0].articleCover;
    } else {
      ElMessage.error('获取文章数据失败');
    }
  } catch (error) {
    console.error('获取文章数据失败:', error);
    ElMessage.error('获取文章数据失败');
  } finally {
    loading.value = false;
  }
};

// 获取分类和标签数据
const fetchCategoryAndTags = async () => {
  try {
    const [categoryRes, tagRes] = await Promise.all([
      getcategoryList(),
      getTagList()
    ]);

    if (categoryRes.code === 0 && Array.isArray(categoryRes.data)) {
      categoryList.value = categoryRes.data.map(item => ({
        id: item.id,
        categoryName: item.categoryName || ''
      }));
    }
    if (tagRes.code === 0 && Array.isArray(tagRes.data)) {
      tagList.value = tagRes.data.map(item => ({
        id: item.id,
        tagName: item.tagName || ''
      }));
    }
  } catch (error) {
    console.error('获取分类或标签数据失败:', error);
    ElMessage.error('获取分类或标签数据失败');
  }
};

// 处理封面图片上传
const handleCoverUpload = async (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }

  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }

  try {
    const uploadData = new FormData()
    uploadData.append('file', file)
    const res = await uploadImg(uploadData)
    if (res.code === 0) {
      previewBase64.value = res.data.path
      formData.value.articleCover = res.data.path
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
  return false
}

// 提交文章
const handleSubmit = async () => {
  if (!formData.value.articleTitle || !formData.value.articleContent) {
    ElMessage.warning('请填写文章标题和内容');
    return;
  }

  if (!formData.value.articleCover) {
    ElMessage.warning('请上传文章封面');
    return;
  }

  try {
    loading.value = true;
    const res = await addArticle({
      id: Number(articleId),
      articleCover: formData.value.articleCover,
      articleTitle: formData.value.articleTitle,
      articleType: formData.value.articleType,
      categoryName: formData.value.categoryName,
      tagsName: formData.value.tagsName,
      status: formData.value.status,
      articleContent: formData.value.articleContent,
      userName: formData.value.userName,
      isTop: formData.value.isTop
    });

    if (res.code === 0) {
      ElMessage.success('更新成功');
      router.push('/user');
    } else {
      ElMessage.error(res.message || '更新失败');
    }
  } catch (error) {
    console.error('更新失败:', error);
    ElMessage.error('更新失败');
  } finally {
    loading.value = false;
  }
};

// 富文本图片上传
const handleImageUpload = async (files, callback) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImg(formData);
      if (res.code === 0) {
        return {
          url: res.data.path,
          alt: file.name
        };
      }
      throw new Error('上传失败');
    });

    const results = await Promise.all(uploadPromises);
    callback(results);
  } catch (error) {
    console.error('图片上传失败:', error);
    ElMessage.error('图片上传失败');
  }
};

onMounted(async () => {
  await Promise.all([
    fetchArticleData(),
    fetchCategoryAndTags()
  ]);
});
</script>

<template>
  <Header />
  <div class="edit-container">
    <div class="edit-header">
      <h1>编辑文章</h1>
    </div>

    <div class="edit-content" v-loading="loading">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="文章标题" required>
          <el-input v-model="formData.articleTitle" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="文章分类" required>
          <el-select v-model="formData.categoryName" placeholder="请选择分类">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName"
                       :value="item.categoryName" />
          </el-select>
        </el-form-item>

        <el-form-item label="文章标签" required>
          <el-select v-model="formData.tagsName" multiple placeholder="请选择标签">
            <el-option v-for="item in tagList" :key="item.id" :label="item.tagName" :value="item.tagName" />
          </el-select>
        </el-form-item>

        <el-form-item label="文章封面">
          <el-upload class="cover-uploader" :show-file-list="false" :before-upload="handleCoverUpload" accept="image/*">
            <img v-if="previewBase64" :src="previewBase64" class="cover-preview" />
            <el-icon v-else class="cover-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="文章内容" required>
          <MdEditor v-model="formData.articleContent" @onUploadImg="handleImageUpload" :toolbars="[
            'bold', 'underline', 'italic', 'strikethrough', '-',
            'title', 'quote', 'unorderedList', 'orderedList', '-',
            'codeRow', 'code', 'link', 'image', 'table', '-',
            'revoke', 'next', 'save', 'pageFullscreen', 'fullscreen', 'preview'
          ]" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
          <el-button @click="router.push('/profile')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edit-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 60px);
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.edit-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;

  h1 {
    font-size: 24px;
    color: #333;
    margin: 0;
  }
}

.edit-content {
  padding: 20px;
  background: #fff;
  border-radius: 8px;

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-input),
  :deep(.el-select) {
    width: 100%;
    max-width: 500px;
  }
}

.cover-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.cover-preview {
  width: 178px;
  height: 178px;
  object-fit: cover;
  display: block;
}

:deep(.md-editor) {
  height: 600px;
}

@media (max-width: 768px) {
  .edit-container {
    padding: 10px;
  }

  .edit-content {
    padding: 10px;
  }

  :deep(.el-form-item__label) {
    float: none;
    display: block;
    text-align: left;
    padding: 0 0 8px;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}
</style>