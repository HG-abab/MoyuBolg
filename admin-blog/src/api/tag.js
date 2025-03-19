// 标签管理
import request from '../utils/request'

// 获取标签列表
export const getTagList = () => request.get('/tag')

// 添加标签
export const addTag = (data) => request.post('/tag/createTag', data)

// 删除标签
export const deleteTagList = (id) => request.delete(`/tag/deleteTag/${id}`)

// 修改标签
export const updateTag = (data) => request.put('/tag/updateTag', data)

// 查询
export const searchTag = (data) => request.post('/tag/search', data)
