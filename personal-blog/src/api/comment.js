import request from '../utils/request'

// 获取评论数
export const getCommentCount = () => request.get('/comment/count')

//获取评论
export const getComment = (id) => request.get(`/comment/${id}`)

//获取文章或者留言的评论数
export const getCommentCountByType = (data) => request.post(`/comment/TypeCount`, data)

// 添加评论
export const addComment = (data) => request.post('/comment/create', data)
