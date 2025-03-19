<script setup>
import { ElMessage } from 'element-plus';
import { ref, watch, onMounted } from 'vue';
import { useAiStream } from '../../utils/ai';
import { initDB, saveMessage, getMessages, saveAIMessage } from '../../utils/db';

const { isLoading, streamAiContent } = useAiStream();

const drawer = ref(false);
const messages = ref([]);
const newMessage = ref('');
const db = ref(null);

// 初始化IndexedDB并加载历史消息
onMounted(async () => {
  try {
    db.value = await initDB();
    if (db.value) {
      const savedMessages = await getMessages(db.value);
      if (savedMessages.length > 0) {
        messages.value = savedMessages;
      } else {
        messages.value = [{ role: 'ai', content: '欢迎使用AI助手！请问有什么可以帮您？' }];
      }
    }
  } catch (error) {
    console.error('初始化数据库失败:', error);
  }
});

// 监听抽屉打开，如果没有消息则显示欢迎语
watch(drawer, async (newVal) => {
  if (newVal && messages.value.length === 0) {
    messages.value = [{ role: 'ai', content: '欢迎使用AI助手！请问有什么可以帮您？' }];
    if (db.value) {
      await saveAIMessage(db.value, '欢迎使用AI助手！请问有什么可以帮您？');
    }
  }
});

async function sendMessage() {
  if (newMessage.value.trim() === '') {
    ElMessage.error('请输入消息');
    return;
  }
  const userMessage = newMessage.value;
  messages.value.push({ role: 'user', content: userMessage });

  if (db.value) {
    await saveMessage(db.value, userMessage);
  }

  newMessage.value = '';
  try {
    await streamAiContent('reply', userMessage, {
      onProgress: (content) => {
        updateAiMessage(content);
      },
      onSuccess: async (content) => {
        updateAiMessage(content);
        if (db.value) {
          await saveAIMessage(db.value, content);
        }
      },
      onError: (error) => {
        console.error('AI 回复失败:', error);
        updateAiMessage('当前服务器繁忙，请稍后再试');
      }
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    updateAiMessage('当前服务器繁忙，请稍后再试');
  }
}

function updateAiMessage(content) {
  const lastMessage = messages.value[messages.value.length - 1];
  if (lastMessage && lastMessage.role === 'ai') {
    lastMessage.content = content;
  } else {
    messages.value.push({ role: 'ai', content });
  }
}
</script>

<template>
  <div class="back-to-top-container">
    <el-tooltip effect="light" class="tooltip" content="Ai小蓝" placement="right">
      <div class="more_rotating">
        <svg-icon name="ai" class="back-to-top" @click="drawer = true" />
      </div>
    </el-tooltip>
  </div>
  <el-drawer v-model="drawer" title="AI 对话" :with-header="false" size="30%">
    <div class="chat-container">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" :class="message.role">
          <span>{{ message.content }}</span>
        </div>
      </div>
      <div class="input-container">
        <el-input v-model="newMessage" placeholder="输入消息..." @keyup.enter="!isLoading && sendMessage" clearable
                  :disabled="isLoading" />
        <el-button type="primary" @click="sendMessage" :disabled="isLoading">
          {{ isLoading ? '发送中...' : '发送' }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.back-to-top {
  height: 40px !important;
  width: 40px !important;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.user {
  text-align: right;
  margin-bottom: 10px;
  background-color: #e6f7ff;
  padding: 8px;
  border-radius: 5px;
  max-width: 80%;
  margin-left: auto;
}

.ai {
  text-align: left;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 5px;
  max-width: 80%;
  margin-right: auto;
}

.input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eaeaea;

  .el-input {
    &.is-disabled {
      opacity: 0.7;
    }
  }

  .el-button {
    &.is-disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}
</style>