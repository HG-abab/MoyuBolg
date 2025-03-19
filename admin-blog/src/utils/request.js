import axios from 'axios'
import { message } from 'ant-design-vue'

const request = axios.create({
  baseURL: 'http://localhost:3000/api', // 设置基础URL
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data // 只返回数据部分
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      console.log(status, data)
      switch (status) {
        case 401:
          message.error('未授权，请登录')
          break
        case 403:
          message.error('禁止访问')
          break
        case 404:
          message.error('请求地址不存在')
          break
        default:
          message.error(data.message || '请求错误')
      }
    } else {
      message.error('网络错误，请检查网络')
    }
    return Promise.reject(error)
  }
)

export default request
