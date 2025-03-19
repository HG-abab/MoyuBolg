// 评论管理
import request from '../utils/request'

// 获取评论列表
export const getComment = () => request.get(`/comment`)

// 是否通过
export const isCommentCheck = (data) => request.put('/comment/isCheck', data)

// 删除评论
export const delCommentId = (data) => request.delete('/comment/delete', { data })

// 搜索
export const searchComment = (data) => request.post('/comment/search', data)
