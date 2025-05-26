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
      <div class="messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message-wrapper', message.role]">
          <div class="avatar">
            <img :src="message.role === 'ai' ? '/src/assets/imgs/ai-avatar.png' : '/src/assets/imgs/user-avatar.png'"
                 :alt="message.role">
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <span>{{ message.content }}</span>
            </div>
            <div class="message-time">{{ new Date().toLocaleTimeString() }}</div>
          </div>
        </div>
      </div>
      <div class="input-container">
        <el-input v-model="newMessage" placeholder="输入消息..." @keyup.enter="!isLoading && sendMessage" clearable
                  :disabled="isLoading" class="message-input">
          <template #prefix>
            <el-icon>
              <ChatDotRound />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="sendMessage" :disabled="isLoading" class="send-button">
          <el-icon v-if="!isLoading">
            <Position />
          </el-icon>
          <el-icon v-else class="is-loading">
            <Loading />
          </el-icon>
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
  background-color: #f5f7fa;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
}

.message-wrapper {
  display: flex;
  gap: 12px;
  animation: fadeIn 0.3s ease-out;
  max-width: 85%;

  &.user {
    flex-direction: row-reverse;
    margin-left: auto;

    .message-content {
      align-items: flex-end;
    }

    .message-bubble {
      background: linear-gradient(135deg, #1890ff, #096dd9);
      color: white;
      border-radius: 18px 4px 18px 18px;

      &::before {
        right: -8px;
        border-left-color: #1890ff;
      }
    }
  }

  &.ai {
    margin-right: auto;

    .message-bubble {
      background: white;
      color: #333;
      border-radius: 4px 18px 18px 18px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      &::before {
        left: -8px;
        border-right-color: white;
      }
    }
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-bubble {
  padding: 12px 16px;
  position: relative;
  line-height: 1.5;
  font-size: 14px;
  word-break: break-word;

  &::before {
    content: '';
    position: absolute;
    top: 12px;
    border: 6px solid transparent;
  }
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.input-container {
  padding: 16px;
  background: white;
  border-top: 1px solid #eaeaea;
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;

  :deep(.el-input__wrapper) {
    border-radius: 20px;
    padding: 0 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.send-button {
  border-radius: 20px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover:not(.is-disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 添加打字机效果
.ai .message-bubble {
  span {
    display: inline-block;
    overflow: hidden;
    white-space: pre-wrap;
    animation: typing 0.3s steps(40, end);
  }
}

@keyframes typing {
  from {
    width: 0
  }

  to {
    width: 100%
  }
}
</style>