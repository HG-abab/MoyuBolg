// src/hooks/useAiStream.js
import { ref } from 'vue'
import { ElMessage } from 'element-plus';

export function useAiStream() {
  const isLoading = ref(false)
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
    const loadingKey = 'aiLoading'
    let fullContent = ''

    if (isLoading.value) return

    try {
      isLoading.value = true

      const response = await fetch(`http://114.215.186.193:3000/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      const reader = response.body.getReader()
      // getReader() 返回一个 ReadableStreamDefaultReader 对象，用于读取流式数据。
      const decoder = new TextDecoder()
      // TextDecoder 是一个用于解码 UTF-8 编码的文本的类。
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        // read() 方法返回一个包含两个属性的 Promise 对象：value 和 done。
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        // decode() 方法用于将 UTF-8 编码的二进制数据解码为字符串。
        const lines = buffer.split('\n')
        // split() 方法用于将字符串按指定分隔符分割成数组。
        buffer = lines.pop() || ''
        // pop() 方法用于删除数组的最后一个元素，并返回该元素。
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            // startsWith() 方法用于检查字符串是否以指定的字符串开头。
            try {
              const data = JSON.parse(line.slice(6))
              // slice() 方法用于提取字符串的一部分，并返回一个新的字符串。
              if (data.error) {
                throw new Error(data.error)
              }
              // JSON.parse() 方法用于将 JSON 字符串解析为 JavaScript 对象。

              if (data.done) {
                if (options.onSuccess) {
                  options.onSuccess(fullContent)
                }
                ElMessage.success('处理成功');
                return fullContent
              }

              if (data.content) {
                fullContent += data.content
                if (options.onProgress) {
                  options.onProgress(fullContent)
                }
              }
            } catch (e) {
              console.error('解析 SSE 数据失败:', e)
              throw e
            }
          }
        }
      }
    } catch (error) {
      console.error('AI 请求错误:', error)
      ElMessage.error('AI 处理失败');
      if (options.onError) {
        options.onError(error)
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    streamAiContent,
  }
}
