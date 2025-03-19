import request from '../utils/request'

// AI 续写
export function continueWriting(content) {
  return request({
    url: '/ai/continue',
    method: 'post',
    data: { content }
  })
}

// AI 润色
export function polish(content) {
  return request({
    url: '/ai/polish',
    method: 'post',
    data: { content }
  })
}

// AI 总结
export function summarize(content) {
  return request({
    url: '/ai/summarize',
    method: 'post',
    data: { content }
  })
} 