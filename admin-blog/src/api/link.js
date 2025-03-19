// 友链管理
import request from '../utils/request'

// 获取友链列表
export const getLinkList = (id) => request.get(`/link/${id}`)

// 是否通知
export const updateLink = (data) => request.put('/link/isCheck', data)

// 删除
export const deleteLink = (id) => request.delete(`/link/delete/${id}`)

// 搜索
export const searchLink = (data) => request.post('/link/search', data)
