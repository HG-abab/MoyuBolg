import request from '../utils/request'

// 获取友链列表
export const getLinkList = () => request.get('/link')

// 创建友链
export const createLink = (data) => request.post('/link/create', data)
