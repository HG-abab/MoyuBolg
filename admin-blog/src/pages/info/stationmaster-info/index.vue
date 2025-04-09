<script setup>
import { reactive, ref, onMounted } from "vue";
import { PlusOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { updateUser } from "../../../api/users";

const emit = defineEmits(['reset:info'])
const props = defineProps({
  info: {
    type: Object,
  }
})

const formData = reactive({ ...props.info });
const avatarFileList = ref([]);
const loading = ref(false);
const imageUrl = ref('');
const backFileList = ref([]);

if (formData.avatar && formData.webmasterProfileBackground) {
  imageUrl.value = formData.avatar;
  backFileList.value = [
    {
      thumbUrl: formData.webmasterProfileBackground,
      name: 'background.jpg', // 设置文件名
    },
  ];
}

// 获取文件的 base64 编码
function getBase64(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => callback(reader.result);
  reader.onerror = (error) => {
    message.error('文件读取失败');
  };
}

// 头像上传回调
function handleChangeAvatar(info) {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    getBase64(info.file.originFileObj, (base64Url) => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  if (info.file.response && info.file.response.code === 0) {
    formData.avatar = info.file.response.data.path;
    message.success('头像上传成功');
  } else {
    message.error(`头像上传失败：${info.file.response?.msg || '未知错误'}`);
  }
  loading.value = false;
}


// 背景上传回调
function handleChangeBack(info) {
  if (info.file.status === 'uploading') {
    return;
  }
  if (info.file.response && info.file.response.code === 0) {
    formData.webmasterProfileBackground = info.file.response.data.path;
    message.success('背景上传成功');
  } else {
    message.error(`背景上传失败：${info.file.response?.msg || '未知错误'}`);
  }
}

// 检验图片格式
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
  if (!isJpgOrPng) {
    message.error('文件格式必须是 jpg、png 或 webp');
  }

  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('图片必须小于 5MB');
  }

  return isJpgOrPng && isLt2M;
}

function updateStationmasterInfo() {
  updateUser(formData).then((res) => {
    if (res.code === 0) {
      message.success('保存成功');
    } else {
      message.error(`保存失败：${res.msg || '未知错误'}`);
    }
  })
}

// 重置
function resetInfo() {
  emit('reset:info')
  Object.assign(formData, props.info);
}
</script>

<template>
  <div class="info">
    <a-form>
      <div class="avatar">
        <a-upload v-model:file-list="avatarFileList" name="file" action="http://114.215.186.193:3000/api/upload"
                  list-type="picture-card" class="avatar-uploader" :show-upload-list="false"
                  :before-upload="beforeUpload" @change="handleChangeAvatar">
          <img v-if="imageUrl" :src="imageUrl" alt="avatar">
          <div v-else>
            <LoadingOutlined v-if="loading" />
            <PlusOutlined v-else />
            <div class="ant-upload-text">
              头像上传
            </div>
          </div>
        </a-upload>
      </div>
      <a-form-item label="名称">
        <a-input v-model:value="formData.name" />
      </a-form-item>
      <a-form-item label="文案">
        <a-input v-model:value="formData.copy" />
      </a-form-item>
      <a-form-item label="背景">
        <div>
          <a-upload v-model:file-list="backFileList" list-type="picture" name="file"
                    :show-upload-list="{ showRemoveIcon: false }" :before-upload="beforeUpload" :max-count="1"
                    action="http://114.215.186.193:3000/api/upload" @change="handleChangeBack">
            <div style="display: flex">
              <a-button>
                <UploadOutlined />
                背景上传
              </a-button>
            </div>
          </a-upload>
          <div style="font-size: 12px; color: grey">图片资源上传与保存按钮无关</div>
        </div>
      </a-form-item>
      <!-- 相关链接 -->
      <a-divider>相关链接</a-divider>
      <a-form-item label="Github">
        <a-input v-model:value="formData.githubLink" />
      </a-form-item>
      <a-form-item label="Gitee&nbsp;&nbsp;">
        <a-input v-model:value="formData.giteeLink" />
      </a-form-item>

      <!-- 保存和重置按钮 -->
      <div style="display: flex; justify-content: center">
        <a-button type="primary" @click="updateStationmasterInfo" style="margin-right: 1rem">保存</a-button>
        <a-button type="default" @click="resetInfo">重置</a-button>
      </div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.info {
  .avatar {
    width: 100px;
    height: 100px;
    margin: 1rem auto;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.ant-divider {
  margin: 1rem 0;
  padding: 0 26%;
}

:deep(.ant-form-item-row) {
  width: 50%;
  margin: 0 auto;
}
</style>