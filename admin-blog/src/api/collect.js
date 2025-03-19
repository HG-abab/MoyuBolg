// 收藏管理
import request from '../utils/request'

// 获取收藏列表
export const getCollectList = (id) => request.get(`/collect/${id}`)

// 是否通过
export const isCollectCheck = (data) => request.put('/collect/update', data)

//  删除收藏
export const delCollectId = (id) => request.delete(`/collect/delete/${id}`)

// 搜索
export const searchCollect = (data) => request.post('/collect/search', data)
