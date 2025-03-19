<script setup>
import 'md-editor-v3/lib/style.css'
import { MdEditor } from 'md-editor-v3'
import { message } from 'ant-design-vue'
import { PictureOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useMultiTab } from '../../store/multi-tab'
import { getTagList, addTag } from '../../api/tag'
import { getcategoryList, addcategory } from '../../api/category'
import { addArticle, uploadImg, getArticle } from '../../api/article'
import { arrayType } from 'ant-design-vue/es/_util/type';
import { continueWriting, polish, summarize } from '../../api/ai'
import { debounce } from '../../utils/debounce';
import { requestManager } from '../../utils/requestManager';
import axios from 'axios';
import { useAiStream } from '../../utils/ai';

const route = useRoute()
const multiTab = useMultiTab()
const mode = ref('light')

const { isLoading, streamAiContent } = useAiStream();

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
})

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes
  },
})

// 分类数据
const categoryList = ref([]);
const getTap = async () => {
  getTagList().then((res) => {
    if (res.code === 0) {
      tagList.value = res.data
    } else {
      message.error(res.msg)
    }
  })
}
// 标签数据
const tagList = ref([]);
const getcategory = async () => {
  getcategoryList().then((res) => {
    if (res.code === 0) {
      categoryList.value = res.data
    } else {
      message.error(res.msg)
    }
  })
}

onMounted(async () => {
  await getcategory()
  await getTap()
  const articleId = route.query.id;
  if (articleId) {
    // 根据文章ID 获取文章数据
    const res = await getArticle(articleId);
    if (res.code === 0) {
      formData.value = res.data[0];
    } else {
      message.error('获取文章数据失败');
    }
  }
})

// 文件列表
const fileList = ref([]);

// 封面图片的 Base64 编码
const previewBase64 = ref('');

// 分类名称输入框的值
const categoryName = ref('');

// 标签名称输入框的值
const tagName = ref('');

// 分类加载状态
const categoryLoading = ref(false);

// 标签加载状态
const tagLoading = ref(false);

// 添加分类
function addCategoryFunc(e) {
  e.preventDefault();
  if (!categoryName.value) {
    message.warn('分类名称不能为空');
    return;
  }

  categoryLoading.value = true;
  const newCategory = {
    categoryName: categoryName.value,
  };

  addcategory(newCategory).then(async (res) => {
    if (res.code === 0) {
      message.success('分类添加成功');
      await getcategory()
    } else {
      message.error('分类添加失败');
    }
  }).finally(() => {
    categoryLoading.value = false;
    categoryName.value = '';
  })
}

// 添加标签
async function addTagFunc(e) {
  e.preventDefault();
  if (!tagName.value) {
    message.warn('标签名称不能为空');
    return;
  }

  tagLoading.value = true;
  const newTag = {
    tagName: tagName.value,
  };

  addTag(newTag).then(async (res) => {
    if (res.code === 0) {
      message.success('标签添加成功');
      await getTap()
    } else {
      message.error('标签添加失败');
    }
  }).finally(() => {
    tagLoading.value = false;
    tagName.value = '';
  })
}

async function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
  if (!isJpgOrPng) {
    message.error('文件格式必须是jpg或png或webp')
    return false
  }

  const isLt5M = file.size / 1024 / 1024 < 10
  if (!isLt5M) {
    message.error('图片必须小于 10MB')
    return false
  }

  const ListData = new FormData();
  ListData.append('file', file);

  await uploadImg(ListData).then((res) => {
    if (res.code === 0) {
      previewBase64.value = res.data.path
      formData.value.articleCover = res.data.path
      message.success('上传成功')
    } else {
      message.error(res.msg)
    }
  }).finally(() => {
    fileList.value = []
  })
  return false
}

// 提交表单
async function onFinish() {
  if (!formData.value.articleTitle || !formData.value.categoryName || !formData.value.tagsName || !formData.value.articleContent || !formData.value.userName) {
    message.warn('请检查是否填写完整');
    return;
  }

  if (!formData.value.articleCover) {
    message.warn('请上传文章封面');
    return;
  }

  let tagsName = []
  formData.value.tagsName.forEach(item => {
    if (typeof item === 'object') {
      if (item.label) tagsName.push(item.label)
      else tagsName.push(item.value)
    } else {
      tagsName.push(item)
    }
  });

  await addArticle({
    id: formData.value.id || undefined,
    articleCover: formData.value.articleCover,
    articleTitle: formData.value.articleTitle,
    articleType: formData.value.articleType,
    categoryName: formData.value.categoryName.label || formData.value.categoryName,
    tagsName: tagsName,
    status: formData.value.status,
    articleContent: formData.value.articleContent,
    userName: formData.value.userName,
    isTop: formData.value.isTop
  }).then((res) => {
    if (res.code === 0) {
      message.success('发布成功');
    } else {
      message.error(res.msg);
    }
  }).finally(() => {
    formData.value = {
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
    }
    previewBase64.value = ''
  })
}


function close() {
  multiTab.close(route.fullPath)
}

// AI 功能处理
const aiButtonsDisabled = ref(false);

// AI 续写功能
const handleAiContinue = debounce(async () => {
  if (!formData.value.articleContent) {
    message.warn('请先输入内容');
    return;
  }
  aiButtonsDisabled.value = true; 
  try {
    await streamAiContent('continue', formData.value.articleContent, {
      onProgress: (content) => {
        formData.value.articleContent =
          formData.value.articleContent.split('\n\n')[0] +
          '\n\n' + content;
      },
      onSuccess: (content) => {
        console.log(content)
        formData.value.articleContent =
          formData.value.articleContent.split('\n\n')[0] +
          '\n\n' + content;
      },
      onError: (error) => {
        console.error('AI 续写失败:', error);
      }
    });
  } catch (error) {
    // 错误已在 hook 中处理
  } finally {
    aiButtonsDisabled.value = false;
  }
}, 300);

// AI 润色功能
const handleAiPolish = debounce(async () => {
  if (!formData.value.articleContent) {
    message.warn('请先输入内容');
    return;
  }
  aiButtonsDisabled.value = true;
  try {
    await streamAiContent('polish', formData.value.articleContent, {
      onProgress: (content) => {
        formData.value.articleContent = content
      },
      onSuccess: (content) => {
        formData.value.articleContent = content
      },
      onError: (error) => {
        console.error('AI 润色失败:', error);
      }
    })
  } catch (error) {
    // 错误已在 hook 中处理
  } finally {
    aiButtonsDisabled.value = false;
  }
}, 300);

// AI 总结功能
const handleAiSummarize = debounce(async () => {
  if (!formData.value.articleContent) {
    message.warn('请先输入内容');
    return;
  }
  aiButtonsDisabled.value = true;
  try {
     const originalContent = formData.value.articleContent;
    await streamAiContent('summarize', formData.value.articleContent, {
      onProgress: (content) => {
          formData.value.articleContent = originalContent + '\n\n总结：\n' + content;
      },
      onSuccess: (content) => {
        formData.value.articleContent = originalContent + '\n\n总结：\n' + content;
      },
      onError: (error) => {
        console.error('AI 总结失败:', error);
      }
    })
  } catch (error) {
    // 错误已在 hook 中处理
  } finally {
    aiButtonsDisabled.value = false;
  }
}, 300);

// 扩展工具栏
const toolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '-',
  0,
  1,
  2,
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
]

//富文本图片上传处理 
async function onUploadArticleImg(files, callback) {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', file);

        uploadImg(form).then((response) => {
          if (response.code === 0) {
            response.data.url = response.data.path
            resolve(response.data);
          }
        }).catch(error => reject(error));
      });
    })
  );
  callback(res);
}
</script>

<template>
  <div class="publist">
    <div class="crumbs">
      <a-breadcrumb>
        <a-breadcrumb-item>网站管理</a-breadcrumb-item>
        <a-breadcrumb-item>文章管理</a-breadcrumb-item>
        <a-breadcrumb-item>发布文章</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <layoutTop :is-list="false">
      <template #form-items>

        <a-form-item label="标题" style="margin-right: 1rem">
          <a-input v-model:value="formData.articleTitle" placeholder="输入文章标题" style="width: 15em" />
        </a-form-item>

        <a-form-item label="分类" style="margin-right: 1rem">
          <a-space>
            <a-select v-if="categoryList" v-model:value="formData.categoryName" :labelInValue="true"
                      :loading="categoryLoading" placeholder="选择分类" style="width: 15em"
                      :options="categoryList.map(item => ({ value: item.id, label: item.categoryName }))">
              <template #dropdownRender="{ menuNode: menu }">
                <VNodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <a-space style="padding: 4px 8px">
                  <a-input ref="inputRef" v-model:value="categoryName" placeholder="添加分类" />
                  <a-button type="text" @click="addCategoryFunc">
                    <template #icon>
                      <plus-outlined />
                    </template>
                    添加
                  </a-button>
                </a-space>
              </template>
            </a-select>
          </a-space>
        </a-form-item>

        <a-form-item label="标签" style="margin-right: 1rem">
          <a-select v-if="tagList" v-model:value="formData.tagsName" :labelInValue="true" mode="multiple"
                    :loading="tagLoading" placeholder="选择标签" style="width: 15em"
                    :options="tagList.map(item => ({ value: item.id, label: item.tagName }))">
            <template #dropdownRender="{ menuNode: menu }">
              <VNodes :vnodes="menu" />
              <a-divider style="margin: 4px 0" />
              <a-space style="padding: 4px 8px">
                <a-input ref="inputRef" v-model:value="tagName" placeholder="添加标签" />
                <a-button type="text" @click="addTagFunc">
                  <template #icon>
                    <plus-outlined />
                  </template>
                  添加
                </a-button>
              </a-space>
            </template>
          </a-select>
        </a-form-item>

        <a-form-item label="类型" style="margin-right: 1rem">
          <a-select v-model:value="formData.articleType" style="width: 10em">
            <a-select-option :value="1">
              原创
            </a-select-option>
            <a-select-option :value="2">
              转载
            </a-select-option>
            <a-select-option :value="3">
              翻译
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="状态" style="margin-right: 1rem">
          <a-space>
            <a-select v-model:value="formData.status" style="width: 120px">
              <a-select-option :value="1">
                公开
              </a-select-option>
              <a-select-option :value="2">
                私密
              </a-select-option>
              <a-select-option :value="3">
                草稿
              </a-select-option>
            </a-select>
          </a-space>
        </a-form-item>

        <a-form-item label="是否顶置" style="margin-right: 1rem">
          <a-select v-model:value="formData.isTop" style="width: 10em">
            <a-select-option :value="1">
              是
            </a-select-option>
            <a-select-option :value="0">
              否
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="作者" name="userName" style="margin-right: 1rem">
          <a-input v-model:value="formData.userName" placeholder="请输入作者" style="width: 10em" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <template v-if="previewBase64 || formData.articleCover">
              <a-popover title="预览">
                <template #content>
                  <a-image :width="200" :src="previewBase64 || formData.articleCover" />
                </template>
                <a-upload :file-list="fileList" :before-upload="beforeUpload" :max-count="1" :show-upload-list="false">
                  <a-button>
                    <PictureOutlined />
                    上传封面
                  </a-button>
                </a-upload>
              </a-popover>
            </template>
            <template v-else>
              <a-upload :file-list="fileList" :before-upload="beforeUpload" :max-count="1"
                        :show-upload-list="{ showRemoveIcon: false }">
                <a-button>
                  <PictureOutlined />
                  上传封面
                </a-button>
              </a-upload>
            </template>
            <a-button type="primary" @click="onFinish">
              发布
            </a-button>
            <a-button class="orange" style="margin-right: 10px" @click="close">
              <template #icon>
                <CloseOutlined />
              </template>
              关闭
            </a-button>
          </a-space>
        </a-form-item>
      </template>
      <template #table-content>
        <div style="height: 80vh;width: 100%">
          <MdEditor v-model="formData.articleContent" :theme="mode" style="height: 80vh" :toolbars="toolbars"
                    @onUploadImg="onUploadArticleImg">
            <template #defToolbars>
              <a-button class="ai-button" :disabled="aiButtonsDisabled || isLoading" @click="handleAiContinue" title="AI续写">✍️</a-button>
              <a-button class="ai-button" :disabled="aiButtonsDisabled || isLoading" @click="handleAiPolish" title="AI润色">🎨</a-button>
              <a-button class="ai-button" :disabled="aiButtonsDisabled || isLoading" @click="handleAiSummarize" title="AI总结">📝</a-button>
            </template>
          </MdEditor>
        </div>
      </template>
    </layoutTop>
  </div>
</template>

<style lang="scss" scoped>
.publist {
  background: white;
  min-height: 50vh;
  margin-bottom: 5rem;

  .crumbs {
    padding: 1rem;

    h1 {
      margin-top: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }
  }
}

:deep(.ant-select-arrow) {
  padding-top: 0.8rem;
}

:deep(.anticon-plus) {
  svg {
    margin-top: -0.35rem;
  }
}

.ai-button {
  background: none;
  border: none;
  cursor: pointer;
  height: 1.5rem;
  font-size: 8px;
  margin: 0 2px;
  padding: 5px;
  transition: background-color 0.3s;
}

.ai-button:hover {
  background-color: #f0f0f0;
}
</style>