import axios from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 创建axios实例
const request = axios.create({
  baseURL: 'http://114.215.186.193:3000/api', // 设置基础URL
  timeout: 5000 // 设置请求超时时间
})

// 错误处理函数，避免重复代码
const handleError = (status, messageText) => {
  switch (status) {
    case 401:
      message.error('未授权，请登录')
      break
    case 403:
      message.error('没有权限，请联系管理员')
      break
    case 404:
      message.error('请求地址不存在')
      break
    case 500:
      message.error('服务器错误，请稍后再试')
      break
    default:
      message.error(messageText || '请求错误')
  }
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 设置Authorization或其他头部信息
    const token = userStore.userToken
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 可以增加对请求错误的处理
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
      console.error(`Error Status: ${status}`, data) // 打印错误状态
      handleError(status, data.message) // 使用封装的错误处理
    } else {
      message.error('网络错误，请检查网络')
    }
    return Promise.reject(error)
  }
)

export default request
