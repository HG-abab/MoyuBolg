// src/hooks/useAiStream.js
import { ref } from 'vue';
import { message } from 'ant-design-vue';

export function useAiStream() {
  const isLoading = ref(false);
  /**
   * 流式处理 AI 内容
   * @param {string} endpoint - API 端点
   * @param {string} content - 要处理的内容
   * @param {Object} options - 配置选项
   * @param {Function} [options.onProgress] - 进度回调
   * @param {Function} [options.onSuccess] - 成功回调
   * @param {Function} [options.onError] - 错误回调
   * @returns {Promise<string>} 处理后的内容
   */
  async function streamAiContent(endpoint, content, options = {}) {
    const loadingKey = 'aiLoading';
    let fullContent = '';

    if (isLoading.value) return;

    try {
      isLoading.value = true;
      message.loading({ content: '正在处理中...', key: loadingKey, duration: 0 });

      const response = await fetch(`http://114.215.186.193:3000/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }

              if (data.done) {
                if (options.onSuccess) {
                  options.onSuccess(fullContent);
                }
                message.success({ content: '处理成功', key: loadingKey });
                return fullContent;
              }

              if (data.content) {
                fullContent += data.content;
                if (options.onProgress) {
                  options.onProgress(fullContent);
                }
              }
            } catch (e) {
              console.error('解析 SSE 数据失败:', e);
              throw e;
            }
          }
        }
      }
    } catch (error) {
      console.error('AI 请求错误:', error);
      message.error({ content: 'AI 处理失败'});
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    streamAiContent
  };
}