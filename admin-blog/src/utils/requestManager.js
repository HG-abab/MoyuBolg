import axios from 'axios'

class RequestManager {
  constructor() {
    this.requestQueue = []
  }

  addRequest(content) {
    // 检查是否已经存在相同内容的请求
    const existingRequest = this.requestQueue.find((item) => item.content === content)

    if (existingRequest) {
      // 如果是相同内容，返回现有的取消令牌
      return existingRequest.cancelToken
    }

    // 创建新的取消令牌
    const cancelToken = axios.CancelToken.source()
    this.requestQueue.push({ content, cancelToken })
    return cancelToken
  }

  cancelPreviousRequests(content) {
    // 取消所有不同内容的请求
    this.requestQueue.forEach((item) => {
      if (item.content !== content) {
        item.cancelToken.cancel('取消旧请求')
        this.removeRequest(item)
      }
    })
  }

  removeRequest(request) {
    this.requestQueue = this.requestQueue.filter((item) => item !== request)
  }
}

export const requestManager = new RequestManager()
