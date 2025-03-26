import request from '../utils/request'

// 获取收藏
export const getCollect = (name) => request.get(`/collect/search/${name}`)

// 添加收藏
export const addCollect = (data) => request.post('/collect/create', data)

// 删除收藏
export const deleteCollect = (data) => request.delete('/collect/delete',{data})