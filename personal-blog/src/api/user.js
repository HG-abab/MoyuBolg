import request from '../utils/request'

// 用户信息
export const userInfo = (id) => request.get(`/users/${id}`)
